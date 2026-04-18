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
          // Compute the rangeOffset/rangeLength of the targeted line, then submit an op.
          let rangeOffset = 0;
          for (let i = 0; i < targetLine; i++) rangeOffset += lines[i].length + 1; // +1 for '\n'
          const rangeLength = lines[targetLine].length;
          const op = { rangeOffset, rangeLength, text: bugCode };
          const result = gameService.updateSharedCode(roomCode, [op], game.editorVersion, socket.userId);
          if (result.accepted) {
            io.to(roomCode).emit('editor:op-apply', {
              userId: 'imposter',
              ops: [op],
              version: result.currentVersion,
            });
            io.to(roomCode).emit('imposter:bug-injected', { affectedLine: targetLine });
          }
        }
      }

      const sharedCooldownMs = game?.settings?.impostorCooldownMs ?? 45000;
      socket.emit('imposter:cooldown-update', {
        action: 'bug', remainingMs: 0, startCooldown: true, cooldownMs: sharedCooldownMs,
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

      const sharedCooldownMs = game?.settings?.impostorCooldownMs ?? 45000;
      socket.emit('imposter:cooldown-update', {
        action: 'blur', remainingMs: 0, startCooldown: true, cooldownMs: sharedCooldownMs,
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

      const sharedCooldownMs = game?.settings?.impostorCooldownMs ?? 45000;
      socket.emit('imposter:cooldown-update', {
        action: 'hint', remainingMs: 0, startCooldown: true, cooldownMs: sharedCooldownMs,
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

      const sharedCooldownMs = game?.settings?.impostorCooldownMs ?? 45000;
      socket.emit('imposter:cooldown-update', {
        action: 'lock', remainingMs: 0, startCooldown: true, cooldownMs: sharedCooldownMs,
      });
    }
  );
}
