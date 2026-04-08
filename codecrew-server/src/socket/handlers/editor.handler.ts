import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';

// Per-room debounce timers for test case checking
const testCheckTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function registerEditorHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on(
    'editor:change',
    ({ roomCode, fullContent, version }: { roomCode: string; fullContent: string; version: number }) => {
      const result = gameService.updateSharedCode(roomCode, fullContent, version);
      if (result.accepted) {
        socket.to(roomCode).emit('editor:update', {
          fullContent,
          version: result.currentVersion,
          userId: socket.userId,
        });

        // Debounced main-code test case check (runs 2s after last keystroke)
        if (testCheckTimers.has(roomCode)) clearTimeout(testCheckTimers.get(roomCode)!);
        testCheckTimers.set(roomCode, setTimeout(async () => {
          testCheckTimers.delete(roomCode);
          const game = gameService.getLiveGame(roomCode);
          if (!game || game.phase !== 'in-progress') return;

          const checkResult = gameService.checkMainTestCases(roomCode, fullContent);
          if (checkResult.changed) {
            io.to(roomCode).emit('editor:test-results', { testCases: checkResult.testCases });
          }
          if (checkResult.allPassed) {
            try { await gameService.endGame(roomCode, 'good-coders'); } catch (e) { /* db error, still emit */ }
            io.to(roomCode).emit('game:end', { winner: 'good-coders' });
          }
        }, 2000));
      } else {
        // Send the authoritative version back to the sender
        const game = gameService.getLiveGame(roomCode);
        if (game) {
          socket.emit('editor:update', {
            fullContent: game.sharedCode,
            version: game.editorVersion,
            userId: 'server',
          });
        }
      }
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
