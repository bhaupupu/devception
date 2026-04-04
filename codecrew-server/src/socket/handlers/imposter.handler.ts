import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import * as imposterService from '../../services/imposter.service';

export function registerImposterHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on(
    'imposter:inject-bug',
    ({ roomCode, targetLine, bugCode }: { roomCode: string; targetLine: number; bugCode: string }) => {
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);
      if (!player || player.role !== 'imposter') return;

      const { allowed, remainingMs } = imposterService.checkCooldown(roomCode, 'bug');
      if (!allowed) {
        socket.emit('imposter:cooldown-update', { action: 'bug', remainingMs });
        return;
      }

      imposterService.recordAction(roomCode, 'bug');

      if (game) {
        const lines = game.sharedCode.split('\n');
        if (targetLine >= 0 && targetLine < lines.length) {
          lines[targetLine] = bugCode;
          const newCode = lines.join('\n');
          gameService.updateSharedCode(roomCode, newCode, game.editorVersion);
          io.to(roomCode).emit('editor:update', {
            fullContent: newCode,
            version: game.editorVersion,
            userId: 'imposter',
          });
          io.to(roomCode).emit('imposter:bug-injected', { affectedLine: targetLine });
        }
      }

      socket.emit('imposter:cooldown-update', {
        action: 'bug', remainingMs: 0, startCooldown: true, cooldownMs: 45000,
      });
    }
  );

  socket.on(
    'imposter:blur-screen',
    ({ roomCode, targetUserId }: { roomCode: string; targetUserId: string }) => {
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);
      if (!player || player.role !== 'imposter') return;

      const { allowed, remainingMs } = imposterService.checkCooldown(roomCode, 'blur');
      if (!allowed) {
        socket.emit('imposter:cooldown-update', { action: 'blur', remainingMs });
        return;
      }

      imposterService.recordAction(roomCode, 'blur');

      const targetPlayer = game?.players.find((p) => p.userId === targetUserId);
      // Never blur another imposter's screen
      if (targetPlayer && targetPlayer.role !== 'imposter') {
        const targetSocket = io.sockets.sockets.get(targetPlayer.socketId);
        targetSocket?.emit('imposter:screen-blurred', { durationMs: 8000 });
      }

      socket.emit('imposter:cooldown-update', {
        action: 'blur', remainingMs: 0, startCooldown: true, cooldownMs: 60000,
      });
    }
  );

  socket.on(
    'imposter:send-hint',
    ({ roomCode, hintText }: { roomCode: string; hintText: string }) => {
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);
      if (!player || player.role !== 'imposter') return;

      const { allowed, remainingMs } = imposterService.checkCooldown(roomCode, 'hint');
      if (!allowed) {
        socket.emit('imposter:cooldown-update', { action: 'hint', remainingMs });
        return;
      }

      imposterService.recordAction(roomCode, 'hint');

      io.to(roomCode).emit('imposter:hint-received', {
        hintText: hintText.slice(0, 200),
        sender: 'anonymous',
      });

      socket.emit('imposter:cooldown-update', {
        action: 'hint', remainingMs: 0, startCooldown: true, cooldownMs: 30000,
      });
    }
  );

  // Lock a player's keyboard for 15 seconds
  socket.on(
    'imposter:lock-keyboard',
    ({ roomCode, targetUserId }: { roomCode: string; targetUserId: string }) => {
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);
      if (!player || player.role !== 'imposter') return;

      const { allowed, remainingMs } = imposterService.checkCooldown(roomCode, 'lock');
      if (!allowed) {
        socket.emit('imposter:cooldown-update', { action: 'lock', remainingMs });
        return;
      }

      imposterService.recordAction(roomCode, 'lock');

      const targetPlayer = game?.players.find((p) => p.userId === targetUserId);
      // Never lock another imposter
      if (targetPlayer && targetPlayer.role !== 'imposter') {
        const targetSocket = io.sockets.sockets.get(targetPlayer.socketId);
        targetSocket?.emit('imposter:keyboard-locked', { durationMs: 15000 });
      }

      socket.emit('imposter:cooldown-update', {
        action: 'lock', remainingMs: 0, startCooldown: true, cooldownMs: 45000,
      });
    }
  );
}
