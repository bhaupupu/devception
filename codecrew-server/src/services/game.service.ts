import { Game, IGame, IPlayerState, GamePhase } from '../models/Game.model';
import { GameHistory } from '../models/GameHistory.model';
import { User } from '../models/User.model';
import { generateRoomCode } from '../utils/roomCodeGenerator';
import { assignRoles } from '../utils/roleAssigner';
import { generateTasksForGame, getMainCodeTemplate } from '../utils/taskGenerator';
import { env } from '../config/env';
import { logger } from '../utils/logger';

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
  if (game) liveGames.set(roomCode, game);
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

  const imposterCount = game.settings?.imposterCount ?? 1;
  const roles = assignRoles(game.players.map((p) => p.userId), imposterCount);
  game.players.forEach((p) => {
    p.role = roles.get(p.userId) ?? 'good-coder';
  });

  const tasksPerPlayer = game.settings?.tasksPerPlayer ?? 5;
  const totalTasksNeeded = game.players.length * tasksPerPlayer;
  const tasks = generateTasksForGame(game.language, game.skillLevel, totalTasksNeeded);
  // Assign tasksPerPlayer tasks to each player
  game.players.forEach((player, playerIdx) => {
    for (let t = 0; t < tasksPerPlayer; t++) {
      const taskIdx = playerIdx * tasksPerPlayer + t;
      if (tasks[taskIdx]) tasks[taskIdx].assignedTo = player.userId;
    }
  });

  game.tasks = tasks;
  game.sharedCode = getMainCodeTemplate(game.language, game.players.length);
  game.phase = 'role-reveal';
  game.timer.gameStartedAt = new Date();

  return game;
}

export function updateSharedCode(
  roomCode: string,
  newCode: string,
  version: number
): { accepted: boolean; currentVersion: number } {
  const game = liveGames.get(roomCode);
  if (!game) return { accepted: false, currentVersion: 0 };
  if (version < game.editorVersion) return { accepted: false, currentVersion: game.editorVersion };
  game.sharedCode = newCode;
  game.editorVersion = version + 1;
  return { accepted: true, currentVersion: game.editorVersion };
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
  game.meetings = [];
  game.sharedCode = '';
  game.sharedProgress = 0;
  game.editorVersion = 0;
  (game as any).endedAt = null;
  game.timer = { gameStartedAt: null, gameDurationMs: env.GAME_DURATION_MS, remainingMs: env.GAME_DURATION_MS };
  game.imposterActions = { lastBugInjectedAt: null, lastBlurAt: null, lastHintAt: null };

  return game;
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
