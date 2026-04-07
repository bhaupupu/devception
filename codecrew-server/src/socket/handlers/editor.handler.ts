import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { endGame } from '../../services/game.service';

function isMainCodeFixed(code: string, language: string): boolean {
  const bugPattern = language === 'python' ? '# BUG' : '// BUG';
  const todoPattern = language === 'python' ? '# your code here' : '// your code here';
  return !code.includes(bugPattern) && !code.includes(todoPattern);
}

export function registerEditorHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on(
    'editor:change',
    async ({ roomCode, fullContent, version }: { roomCode: string; fullContent: string; version: number }) => {
      const result = gameService.updateSharedCode(roomCode, fullContent, version);
      if (result.accepted) {
        socket.to(roomCode).emit('editor:update', {
          fullContent,
          version: result.currentVersion,
          userId: socket.userId,
        });

        // Auto-detect: if all // BUG markers and // your code here stubs are gone, good coders win
        const game = gameService.getLiveGame(roomCode);
        if (game && game.phase === 'in-progress' && isMainCodeFixed(fullContent, game.language)) {
          await endGame(roomCode, 'good-coders');
          io.to(roomCode).emit('game:end', { winner: 'good-coders' });
        }
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
