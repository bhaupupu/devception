import { Game, IGame, IMainTestCaseState, IPlayerState, GamePhase } from '../models/Game.model';
import { GameHistory } from '../models/GameHistory.model';
import { User } from '../models/User.model';
import { generateRoomCode } from '../utils/roomCodeGenerator';
import { assignRoles } from '../utils/roleAssigner';
import { generateTasksForGame, getMainCodeTemplate, MainTestCase } from '../utils/taskGenerator';
import {
  extractProtectedRanges,
  getProtectedSignatures,
  computeMinContentLength,
  ProtectedRange,
} from '../utils/protectedCode';
import {
  judgeMainCode,
  extractTopLevelIdentifiers,
  MainTestSpec,
} from './mainCodeJudge.service';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Per-room judge configuration: the tests (regex or executable) plus the set of
// top-level identifiers that must remain present. Built once at startGame.
interface RoomJudgeConfig {
  tests: MainTestSpec[];
  requiredIdentifiers: string[];
  minContentLength: number;
}
const liveJudgeConfig = new Map<string, RoomJudgeConfig>();

// Per-room protected-region metadata, derived at startGame, used by updateSharedCode.
interface RoomProtection {
  ranges: ProtectedRange[];
  signatures: string[];
  minLength: number;
}
const liveProtection = new Map<string, RoomProtection>();

// Per-room audit log of accepted ops — bounded ring buffer.
export interface AuditedOp {
  userId: string;
  rangeOffset: number;
  rangeLength: number;
  text: string;
  version: number;
  timestamp: number;
}
const OPS_LOG_LIMIT = 200;
const liveOpsLog = new Map<string, AuditedOp[]>();

// Single Monaco-style edit op as sent over the wire.
export interface EditorOp {
  rangeOffset: number;
  rangeLength: number;
  text: string;
}

export type UpdateSharedCodeResult =
  | { accepted: true; newCode: string; currentVersion: number }
  | { accepted: false; reason: 'stale-version' | 'protected-violation' | 'min-length' | 'out-of-bounds'; currentVersion: number; currentCode: string; violationName?: string };

// Player colors (Among Us-inspired)
const PLAYER_COLORS = [
  '#C51111', '#132ED1', '#117F2D', '#ED54BA',
  '#EF7D0E', '#F5F557', '#3F474E', '#D6E0F0',
];

// In-memory live game state (for performance)
const liveGames = new Map<string, IGame>();

// Periodic flush to MongoDB every 60s
setInterval(async () => {
  for (const [roomCode, game] of liveGames.entries()) {
    if (game.phase !== 'waiting' && game.phase !== 'results') {
      await Game.findByIdAndUpdate(game._id, {
        sharedCode: game.sharedCode,
        sharedProgress: game.sharedProgress,
        editorVersion: game.editorVersion,
        players: game.players,
        tasks: game.tasks,
        'timer.remainingMs': game.timer.remainingMs,
      }).catch((e) => logger.error('Checkpoint flush failed', e));
    }
  }
}, 60000);

export async function createRoom(
  language: string,
  skillLevel: 'beginner' | 'intermediate' | 'advanced',
  maxPlayers: number = 8
): Promise<IGame> {
  const roomCode = generateRoomCode();
  const clampedMax = Math.min(10, Math.max(4, maxPlayers));
  const game = new Game({ roomCode, language, skillLevel, maxPlayers: clampedMax });
  await game.save();
  liveGames.set(roomCode, game);
  return game;
}

export function getLiveGame(roomCode: string): IGame | undefined {
  return liveGames.get(roomCode);
}

export async function getOrLoadGame(roomCode: string): Promise<IGame | null> {
  if (liveGames.has(roomCode)) return liveGames.get(roomCode)!;
  const game = await Game.findOne({ roomCode });
  if (game) {
    liveGames.set(roomCode, game);
    // Repopulate in-memory judge config if server restarted mid-game
    if (game.phase === 'in-progress' && game.mainTestCases.length > 0 && !liveJudgeConfig.has(roomCode)) {
      const { code: templateCode, testCases } = getMainCodeTemplate(game.language, game.players.length, {
        primaryKey: game.mainCodeTemplateKey ?? undefined,
        secondaryKey: game.mainCodeSecondaryKey ?? undefined,
      });
      liveJudgeConfig.set(roomCode, {
        tests: testCases as MainTestSpec[],
        requiredIdentifiers: extractTopLevelIdentifiers(game.language, templateCode),
        minContentLength: computeMinContentLength(templateCode.length),
      });
    }
    // Repopulate protection metadata from the persisted sharedCode (best-effort).
    if (game.phase === 'in-progress' && game.sharedCode && !liveProtection.has(roomCode)) {
      const ranges = extractProtectedRanges(game.sharedCode);
      liveProtection.set(roomCode, {
        ranges,
        signatures: getProtectedSignatures(ranges),
        // After restart we can't know the original length, so be lenient: half current.
        minLength: computeMinContentLength(game.sharedCode.length * 2),
      });
    }
  }
  return game;
}

export async function addPlayerToGame(
  roomCode: string,
  userId: string,
  socketId: string,
  displayName: string,
  avatarUrl: string
): Promise<IGame | null> {
  const game = await getOrLoadGame(roomCode);
  if (!game) return null;
  if (game.players.length >= game.maxPlayers) return null;

  const existingIdx = game.players.findIndex((p) => p.userId === userId);
  if (existingIdx >= 0) {
    // Reconnect
    game.players[existingIdx].socketId = socketId;
    game.players[existingIdx].isConnected = true;
  } else {
    const color = PLAYER_COLORS[game.players.length % PLAYER_COLORS.length];
    const player: IPlayerState = {
      userId: userId,
      socketId,
      displayName,
      avatarUrl,
      role: 'good-coder',
      isAlive: true,
      isConnected: true,
      tasksCompleted: [],
      cursorPosition: null,
      color,
      readyToStart: false,
    };
    game.players.push(player);
  }

  await Game.findByIdAndUpdate(game._id, { players: game.players });
  return game;
}

export function markPlayerDisconnected(roomCode: string, socketId: string): void {
  const game = liveGames.get(roomCode);
  if (!game) return;
  const player = game.players.find((p) => p.socketId === socketId);
  if (player) player.isConnected = false;
}

export function setPlayerReady(roomCode: string, userId: string): boolean {
  const game = liveGames.get(roomCode);
  if (!game) return false;
  const player = game.players.find((p) => p.userId === userId);
  if (player) player.readyToStart = true;
  return game.players.filter((p) => p.isConnected).every((p) => p.readyToStart);
}

export function startGame(roomCode: string): IGame | null {
  const game = liveGames.get(roomCode);
  if (!game) return null;

  // Reset per-round state so a new game always starts clean, even if the
  // previous round wasn't properly teardown'd (e.g. game loaded from DB,
  // or resetGame was skipped because the phase was already 'waiting').
  game.sharedProgress = 0;
  game.editorVersion = 0;
  game.meetings = [];
  game.imposterActions = { lastBugInjectedAt: null, lastBlurAt: null, lastHintAt: null };
  game.timer.remainingMs = env.GAME_DURATION_MS;
  (game as any).winner = null;
  (game as any).endedAt = null;
  game.players.forEach((p) => {
    p.tasksCompleted = [];
    p.isAlive = true;
  });

  const imposterCount = game.settings?.imposterCount ?? 1;
  const roles = assignRoles(game.players.map((p) => p.userId), imposterCount);
  game.players.forEach((p) => {
    p.role = roles.get(p.userId) ?? 'good-coder';
  });

  const tasksPerPlayer = game.settings?.tasksPerPlayer ?? 5;
  // Only good-coders receive tasks — imposters have sabotage abilities instead.
  const coders = game.players.filter((p) => p.role === 'good-coder');
  const totalTasksNeeded = coders.length * tasksPerPlayer;
  const tasks = generateTasksForGame(game.language, game.skillLevel, totalTasksNeeded);
  coders.forEach((player, playerIdx) => {
    for (let t = 0; t < tasksPerPlayer; t++) {
      const taskIdx = playerIdx * tasksPerPlayer + t;
      if (tasks[taskIdx]) tasks[taskIdx].assignedTo = player.userId;
    }
  });

  game.tasks = tasks;
  const { code, testCases, primaryKey, secondaryKey } = getMainCodeTemplate(game.language, game.players.length);
  game.sharedCode = code;
  game.mainTestCases = testCases.map(tc => ({ id: tc.id, description: tc.description, passed: false }));
  game.mainCodeTemplateKey = primaryKey;
  game.mainCodeSecondaryKey = secondaryKey;

  const initialMinLength = computeMinContentLength(code.length);
  liveJudgeConfig.set(roomCode, {
    tests: testCases as MainTestSpec[],
    // Pin required identifiers to whatever the template exposed at game start so
    // the judge can detect if the user has deleted declarations outright.
    requiredIdentifiers: extractTopLevelIdentifiers(game.language, code),
    minContentLength: initialMinLength,
  });

  // Derive protection metadata from the fresh template.
  const ranges = extractProtectedRanges(code);
  liveProtection.set(roomCode, {
    ranges,
    signatures: getProtectedSignatures(ranges),
    minLength: initialMinLength,
  });
  liveOpsLog.set(roomCode, []);

  game.phase = 'role-reveal';
  game.timer.gameStartedAt = new Date();

  return game;
}

export function getProtectionForRoom(roomCode: string): RoomProtection | undefined {
  return liveProtection.get(roomCode);
}

// Apply a sequence of Monaco-style ops to a base string, in the order supplied.
// Monaco delivers changes in `e.changes` already sorted descending by rangeOffset so that
// earlier (higher-offset) applications don't invalidate later offsets. We preserve that
// contract here — clients are expected to forward `e.changes` verbatim.
export function applyOpsToString(base: string, ops: EditorOp[]): { ok: true; result: string } | { ok: false; reason: 'out-of-bounds' } {
  let out = base;
  for (const op of ops) {
    if (op.rangeOffset < 0 || op.rangeOffset + op.rangeLength > out.length) {
      return { ok: false, reason: 'out-of-bounds' };
    }
    out = out.slice(0, op.rangeOffset) + op.text + out.slice(op.rangeOffset + op.rangeLength);
  }
  return { ok: true, result: out };
}

function violatesProtection(protection: RoomProtection | undefined, nextCode: string): { violated: true; name: string; reason: 'protected-violation' | 'min-length' } | { violated: false } {
  if (!protection) return { violated: false };
  if (nextCode.length < protection.minLength) {
    return { violated: true, name: 'min-length', reason: 'min-length' };
  }
  for (const sig of protection.signatures) {
    if (!nextCode.includes(sig)) {
      return { violated: true, name: sig.slice(0, 40), reason: 'protected-violation' };
    }
  }
  return { violated: false };
}

export function updateSharedCode(
  roomCode: string,
  ops: EditorOp[],
  baseVersion: number,
  userId: string
): UpdateSharedCodeResult {
  const game = liveGames.get(roomCode);
  if (!game) {
    return { accepted: false, reason: 'stale-version', currentVersion: 0, currentCode: '' };
  }

  // Stale version → client must resync; ops would apply at wrong offsets.
  if (baseVersion !== game.editorVersion) {
    return { accepted: false, reason: 'stale-version', currentVersion: game.editorVersion, currentCode: game.sharedCode };
  }

  const applied = applyOpsToString(game.sharedCode, ops);
  if (!applied.ok) {
    return { accepted: false, reason: 'out-of-bounds', currentVersion: game.editorVersion, currentCode: game.sharedCode };
  }

  const protection = liveProtection.get(roomCode);
  const guard = violatesProtection(protection, applied.result);
  if (guard.violated) {
    return { accepted: false, reason: guard.reason, currentVersion: game.editorVersion, currentCode: game.sharedCode, violationName: guard.name };
  }

  game.sharedCode = applied.result;
  game.editorVersion = baseVersion + 1;

  // Audit log (bounded).
  const log = liveOpsLog.get(roomCode) ?? [];
  const now = Date.now();
  for (const op of ops) {
    log.push({ userId, rangeOffset: op.rangeOffset, rangeLength: op.rangeLength, text: op.text, version: game.editorVersion, timestamp: now });
  }
  if (log.length > OPS_LOG_LIMIT) log.splice(0, log.length - OPS_LOG_LIMIT);
  liveOpsLog.set(roomCode, log);

  return { accepted: true, newCode: applied.result, currentVersion: game.editorVersion };
}

// Legacy full-content setter — retained for the debounced main-test-case check
// (which works off `sharedCode` only, so it's unaffected by the protocol change).
// Returns `true` only if the write fully replaced the in-memory snapshot.
export function forceSetSharedCode(roomCode: string, fullContent: string): boolean {
  const game = liveGames.get(roomCode);
  if (!game) return false;
  game.sharedCode = fullContent;
  game.editorVersion += 1;
  return true;
}

export function completeTask(
  roomCode: string,
  taskId: string,
  userId: string
): { sharedProgress: number; allDone: boolean } | null {
  const game = liveGames.get(roomCode);
  if (!game) return null;

  const task = game.tasks.find((t) => t._id === taskId);
  if (!task || task.isCompleted) return null;

  task.isCompleted = true;
  task.completedBy = userId;

  const player = game.players.find((p) => p.userId === userId);
  if (player && !player.tasksCompleted.includes(taskId)) {
    player.tasksCompleted.push(taskId);
  }

  const totalProgress = game.tasks.reduce(
    (sum, t) => sum + (t.isCompleted ? t.progressValue : 0),
    0
  );
  const maxProgress = game.tasks.reduce((sum, t) => sum + t.progressValue, 0);
  game.sharedProgress = Math.min(100, Math.round((totalProgress / maxProgress) * 100));

  const allDone = game.sharedProgress >= 100;
  return { sharedProgress: game.sharedProgress, allDone };
}

export function ejectPlayer(
  roomCode: string,
  targetUserId: string
): { ejected: IPlayerState | null; gameOver: boolean; winner: 'good-coders' | 'imposters' | null } {
  const game = liveGames.get(roomCode);
  if (!game) return { ejected: null, gameOver: false, winner: null };

  const player = game.players.find((p) => p.userId === targetUserId);
  if (player) player.isAlive = false;

  const aliveImposters = game.players.filter((p) => p.isAlive && p.role === 'imposter');
  const aliveGoodCoders = game.players.filter((p) => p.isAlive && p.role === 'good-coder');

  if (aliveImposters.length === 0) {
    return { ejected: player ?? null, gameOver: true, winner: 'good-coders' };
  }
  if (aliveImposters.length >= aliveGoodCoders.length) {
    return { ejected: player ?? null, gameOver: true, winner: 'imposters' };
  }
  return { ejected: player ?? null, gameOver: false, winner: null };
}

export async function endGame(
  roomCode: string,
  winner: 'good-coders' | 'imposters'
): Promise<void> {
  const game = liveGames.get(roomCode);
  if (!game) return;

  game.phase = 'results';
  game.winner = winner;
  game.endedAt = new Date();

  const gameDurationMs = game.timer.gameStartedAt
    ? Date.now() - game.timer.gameStartedAt.getTime()
    : 0;

  // Calculate XP and build history
  const historyPlayers = await Promise.all(
    game.players.map(async (p) => {
      const isWinner =
        (winner === 'good-coders' && p.role === 'good-coder') ||
        (winner === 'imposters' && p.role === 'imposter');

      const xpEarned = 50 + p.tasksCompleted.length * 15 + (isWinner ? 100 : 0);

      await User.findOneAndUpdate({ googleId: p.userId }, {
        $inc: {
          'stats.gamesPlayed': 1,
          'stats.gamesWon': isWinner ? 1 : 0,
          'stats.timesImposter': p.role === 'imposter' ? 1 : 0,
          'stats.tasksCompleted': p.tasksCompleted.length,
          'stats.xp': xpEarned,
        },
      });

      return {
        userId: p.userId,
        role: p.role,
        isWinner,
        tasksCompleted: p.tasksCompleted.length,
        xpEarned,
      };
    })
  );

  await GameHistory.create({
    gameId: game._id,
    roomCode,
    players: historyPlayers,
    winner,
    gameDurationMs,
    language: game.language,
    skillLevel: game.skillLevel,
    playedAt: new Date(),
  });

  await Game.findByIdAndUpdate(game._id, {
    phase: 'results',
    winner,
    endedAt: game.endedAt,
    players: game.players,
    tasks: game.tasks,
    sharedProgress: game.sharedProgress,
  });

  // Remove from live cache after a delay — only if not reset in the meantime
  setTimeout(() => {
    const g = liveGames.get(roomCode);
    if (g && g.phase === 'results') liveGames.delete(roomCode);
  }, 5 * 60 * 1000);
}

export function updateGameSettings(
  roomCode: string,
  settings: Partial<{
    imposterCount: number;
    tasksPerPlayer: number;
    impostorCooldownMs: number;
    discussionTimeMs: number;
    votingTimeMs: number;
  }>
): { imposterCount: number; tasksPerPlayer: number; impostorCooldownMs: number; discussionTimeMs: number; votingTimeMs: number } | null {
  const game = liveGames.get(roomCode);
  if (!game || game.phase !== 'waiting') return null;

  // Use game.set() so Mongoose subdocument tracks all mutations properly
  if (settings.imposterCount !== undefined)
    game.set('settings.imposterCount', Math.max(1, Math.min(2, settings.imposterCount)));
  if (settings.tasksPerPlayer !== undefined)
    game.set('settings.tasksPerPlayer', Math.max(1, Math.min(10, settings.tasksPerPlayer)));
  if (settings.impostorCooldownMs !== undefined)
    game.set('settings.impostorCooldownMs', settings.impostorCooldownMs);
  if (settings.discussionTimeMs !== undefined)
    game.set('settings.discussionTimeMs', settings.discussionTimeMs);
  if (settings.votingTimeMs !== undefined)
    game.set('settings.votingTimeMs', settings.votingTimeMs);

  game.markModified('settings');

  // Return plain object so callers don't serialize a Mongoose subdocument
  return {
    imposterCount: game.settings.imposterCount,
    tasksPerPlayer: game.settings.tasksPerPlayer,
    impostorCooldownMs: game.settings.impostorCooldownMs,
    discussionTimeMs: game.settings.discussionTimeMs,
    votingTimeMs: game.settings.votingTimeMs,
  };
}

export function resetGame(roomCode: string): IGame | null {
  const game = liveGames.get(roomCode);
  if (!game) return null;

  // If already waiting, don't wipe players who have already rejoined
  if (game.phase === 'waiting') return game;

  game.phase = 'waiting';
  game.players = [];
  (game as any).winner = null;
  game.tasks = [];
  game.mainTestCases = [];
  liveJudgeConfig.delete(roomCode);
  game.meetings = [];
  game.sharedCode = '';
  game.sharedProgress = 0;
  game.editorVersion = 0;
  (game as any).endedAt = null;
  game.timer = { gameStartedAt: null, gameDurationMs: env.GAME_DURATION_MS, remainingMs: env.GAME_DURATION_MS };
  game.imposterActions = { lastBugInjectedAt: null, lastBlurAt: null, lastHintAt: null };

  liveProtection.delete(roomCode);
  liveOpsLog.delete(roomCode);

  return game;
}

export function checkMainTestCases(
  roomCode: string,
  code: string
): { changed: boolean; allPassed: boolean; testCases: IMainTestCaseState[] } {
  const game = liveGames.get(roomCode);
  if (!game || game.mainTestCases.length === 0) {
    return { changed: false, allPassed: false, testCases: [] };
  }

  const config = liveJudgeConfig.get(roomCode);
  if (!config) {
    // No judge config means we have no way to verify — never falsely pass.
    let changed = false;
    for (const tc of game.mainTestCases) {
      if (tc.passed) { tc.passed = false; changed = true; }
    }
    return { changed, allPassed: false, testCases: game.mainTestCases };
  }

  // Recompute every verdict from scratch against the live code. No cached pass
  // state is allowed to survive across calls — that was the old bug.
  const result = judgeMainCode({
    language: game.language,
    code,
    requiredIdentifiers: config.requiredIdentifiers,
    minContentLength: config.minContentLength,
    tests: config.tests,
  });

  if (result.diagnostics.length > 0) {
    // Debug-only visibility — do not emit to clients.
    logger.debug(`[judge ${roomCode}] ${result.diagnostics.join(' | ')}`);
  }

  // Drive the authoritative mainTestCases state from the fresh verdicts. If a
  // test's pass flips (either direction), we flag changed so the socket layer
  // broadcasts the update.
  let changed = false;
  const verdictById = new Map(result.verdicts.map((v) => [v.id, v]));
  for (const tc of game.mainTestCases) {
    const verdict = verdictById.get(tc.id);
    const nowPassed = verdict?.passed ?? false;
    if (nowPassed !== tc.passed) {
      tc.passed = nowPassed;
      changed = true;
    }
  }

  return { changed, allPassed: result.allPassed, testCases: game.mainTestCases };
}

// Strip solutionCode from tasks before sending to clients; attach protection metadata.
export function sanitizeGame(game: IGame): object {
  const obj = game.toObject();
  const protection = liveProtection.get(game.roomCode);
  return {
    ...obj,
    tasks: (obj.tasks as any[]).map(({ solutionCode: _sc, ...rest }: any) => rest),
    protectedRanges: protection?.ranges.map((r) => ({ name: r.name, startLine: r.startLine, endLine: r.endLine })) ?? [],
  };
}

export function getGamePhase(roomCode: string): GamePhase | null {
  return liveGames.get(roomCode)?.phase ?? null;
}

export function setGamePhase(roomCode: string, phase: GamePhase): void {
  const game = liveGames.get(roomCode);
  if (game) game.phase = phase;
}

export function updatePlayerCursor(
  roomCode: string,
  socketId: string,
  line: number,
  column: number
): void {
  const game = liveGames.get(roomCode);
  if (!game) return;
  const player = game.players.find((p) => p.socketId === socketId);
  if (player) player.cursorPosition = { line, column };
}
