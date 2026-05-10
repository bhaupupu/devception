import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { isSyntacticallyComplete } from '../../utils/syntaxValidator';
import { logger } from '../../utils/logger';
import * as Y from 'yjs';
import Redis from 'ioredis';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

const roomDocs = new Map<string, Y.Doc>();

export async function getOrCreateYDoc(roomCode: string, initialCode: string): Promise<Y.Doc> {
  if (!roomDocs.has(roomCode)) {
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText('monaco');
    
    if (redis) {
      try {
        const buffer = await redis.getBuffer(`game:${roomCode}:ydoc`);
        if (buffer) {
          Y.applyUpdate(ydoc, new Uint8Array(buffer));
          roomDocs.set(roomCode, ydoc);
          return ydoc;
        }
      } catch (e) {
        logger.error(`Failed to load Y.Doc from Redis for ${roomCode}`, e);
      }
    }

    ytext.insert(0, initialCode);
    roomDocs.set(roomCode, ydoc);
  }
  return roomDocs.get(roomCode)!;
}

export function clearYDoc(roomCode: string) {
  roomDocs.delete(roomCode);
}

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
  socket.on(
    'editor:ydoc-sync',
    async ({ roomCode, update }: { roomCode: string; update: ArrayBuffer }) => {
      const liveGame = gameService.getLiveGame(roomCode);
      const sender = liveGame?.players.find((p) => p.userId === socket.userId);
      if (!sender?.isAlive) return;
      if (!update) return;

      const ydoc = await getOrCreateYDoc(roomCode, liveGame?.sharedCode || '');
      
      const uint8Update = new Uint8Array(update);
      Y.applyUpdate(ydoc, uint8Update, 'client');

      if (redis) {
        try {
          const stateVector = Y.encodeStateAsUpdate(ydoc);
          // Fire and forget so we don't block the socket
          redis.set(`game:${roomCode}:ydoc`, Buffer.from(stateVector));
        } catch (e) {
          logger.error(`Failed to save Y.Doc to Redis for ${roomCode}`, e);
        }
      }

      if (liveGame) {
        liveGame.sharedCode = ydoc.getText('monaco').toString();
        gameService.forceSetSharedCode(roomCode, liveGame.sharedCode);
      }

      socket.to(roomCode).emit('editor:ydoc-sync', { update });
      
      scheduleTestCaseCheck(io, roomCode);
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
