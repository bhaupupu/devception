import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { isSyntacticallyComplete } from '../../utils/syntaxValidator';
import { logger } from '../../utils/logger';

// Per-room debounce timers for test case checking.
// We only fire the test suite once the user has been idle for 3s AND the
// code parses cleanly. Mid-typing bursts never trigger an evaluation, so
// the judge only runs against complete, settled code.
const testCheckTimers = new Map<string, ReturnType<typeof setTimeout>>();
const TEST_CHECK_DEBOUNCE_MS = 3000;

function scheduleTestCaseCheck(io: Server, roomCode: string): void {
  if (testCheckTimers.has(roomCode)) clearTimeout(testCheckTimers.get(roomCode)!);
  testCheckTimers.set(
    roomCode,
    setTimeout(async () => {
      testCheckTimers.delete(roomCode);
      const game = gameService.getLiveGame(roomCode);
      if (!game || game.phase !== 'in-progress') return;

      // Gate: do not run the judge against code that is still being typed.
      // Mid-edit fragments (dangling brackets, half-finished lines) must be
      // ignored so the judge only sees a stable, parse-clean program.
      if (!isSyntacticallyComplete(game.language, game.sharedCode)) {
        logger.debug(`[editor ${roomCode}] skip judge — code not syntactically complete (len=${game.sharedCode.length})`);
        return;
      }

      // Judge always reads the *current* live code; no snapshot is captured ahead
      // of time so stale buffers can't leak into a later check.
      const checkResult = gameService.checkMainTestCases(roomCode, game.sharedCode);
      logger.debug(
        `[editor ${roomCode}] judge fired len=${game.sharedCode.length} ` +
        `passed=${checkResult.testCases.filter((t) => t.passed).length}/${checkResult.testCases.length} ` +
        `changed=${checkResult.changed} allPassed=${checkResult.allPassed}`
      );

      if (checkResult.changed) {
        io.to(roomCode).emit('editor:test-results', { testCases: checkResult.testCases });
      }
      if (checkResult.allPassed) {
        try { await gameService.endGame(roomCode, 'good-coders'); } catch { /* db error, still emit */ }
        io.to(roomCode).emit('game:end', { winner: 'good-coders' });
      }
    }, TEST_CHECK_DEBOUNCE_MS)
  );
}

export function registerEditorHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Op-based edit protocol. Each payload carries one or more Monaco `IModelContentChange`-
  // shaped ops, the baseVersion the client applied them against, and the authoring userId.
  // The server is authoritative: ops are accepted only if baseVersion matches; otherwise
  // the client is sent a full resync.
  socket.on(
    'editor:op',
    ({
      roomCode,
      ops,
      baseVersion,
    }: {
      roomCode: string;
      ops: gameService.EditorOp[];
      baseVersion: number;
    }) => {
      // Eliminated players are spectators: silently drop their edits.
      const liveGame = gameService.getLiveGame(roomCode);
      const sender = liveGame?.players.find((p) => p.userId === socket.userId);
      if (!sender?.isAlive) return;
      if (!Array.isArray(ops) || ops.length === 0) return;

      const result = gameService.updateSharedCode(roomCode, ops, baseVersion, socket.userId);

      if (process.env.EDITOR_TRACE === '1') {
        const opsSummary = ops.map((o) => `(${o.rangeOffset}+${o.rangeLength}→${o.text.length}b)`).join(',');
        logger.debug(
          `[editor ${roomCode}] user=${socket.userId} baseV=${baseVersion} ` +
          `accepted=${result.accepted} reason=${result.accepted ? '-' : result.reason} ops=${opsSummary}`
        );
      }

      if (result.accepted) {
        // Broadcast the tagged ops to all OTHER clients. Each client applies them via
        // model.applyEdits() which does NOT touch their local undo stack — so Monaco's
        // built-in undo naturally becomes per-user.
        socket.to(roomCode).emit('editor:op-apply', {
          userId: socket.userId,
          ops,
          version: result.currentVersion,
        });

        scheduleTestCaseCheck(io, roomCode);
        return;
      }

      // Rejected → send back authoritative snapshot so the sender can resync.
      if (result.reason === 'protected-violation' || result.reason === 'min-length') {
        socket.emit('editor:protected-violation', {
          reason: result.reason,
          violationName: result.violationName ?? '',
          message:
            result.reason === 'min-length'
              ? 'The core code cannot be cleared.'
              : `Protected region cannot be modified (${result.violationName ?? 'marker'}).`,
        });
      }

      socket.emit('editor:resync', {
        fullContent: result.currentCode,
        version: result.currentVersion,
      });
    }
  );

  socket.on(
    'editor:cursor-move',
    ({ roomCode, line, column }: { roomCode: string; line: number; column: number }) => {
      gameService.updatePlayerCursor(roomCode, socket.id, line, column);
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);

      socket.to(roomCode).emit('editor:cursor-update', {
        userId: socket.userId,
        line,
        column,
        color: player?.color ?? '#ffffff',
        displayName: socket.displayName,
      });
    }
  );
}
