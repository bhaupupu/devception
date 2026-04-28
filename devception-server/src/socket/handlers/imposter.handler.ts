import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import * as imposterService from '../../services/imposter.service';
import { pickBugMutation, pickShadowMutation } from '../../utils/bugMutator';
import { logger } from '../../utils/logger';

export function registerImposterHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Inject Bug — server picks a believable mutation against the live shared
  // code (comparator flip, off-by-one, missing await, wrong-return, …) and
  // applies it as a normal editor op. The client used to supply the bug text
  // directly which (a) was easy to spot and (b) couldn't sit in the right
  // language. The client payload is now ignored entirely.
  socket.on(
    'imposter:inject-bug',
    ({ roomCode }: { roomCode: string }) => {
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);
      if (!player || player.role !== 'imposter') return;

      const { allowed, remainingMs } = imposterService.checkCooldown(roomCode, 'bug');
      if (!allowed) {
        socket.emit('imposter:cooldown-update', { action: 'bug', remainingMs });
        return;
      }

      let applied = false;
      if (game) {
        const mutation = pickBugMutation(game.language, game.sharedCode);
        if (mutation) {
          const op = {
            rangeOffset: mutation.rangeOffset,
            rangeLength: mutation.rangeLength,
            text: mutation.text,
          };
          const result = gameService.updateSharedCode(roomCode, [op], game.editorVersion, socket.userId);
          if (result.accepted) {
            io.to(roomCode).emit('editor:op-apply', {
              userId: 'imposter',
              ops: [op],
              version: result.currentVersion,
            });
            io.to(roomCode).emit('imposter:bug-injected', { affectedLine: mutation.affectedLine });
            logger.debug(`[imposter ${roomCode}] inject-bug ${mutation.description} @line=${mutation.affectedLine}`);
            applied = true;
          }
        }
      }

      // Whether or not we found a site to mutate, charging the cooldown is the
      // right behavior — otherwise an imposter could probe for "no eligible
      // sites" and effectively get a free check on the codebase shape.
      imposterService.recordAction(roomCode, 'bug');
      const sharedCooldownMs = game?.settings?.impostorCooldownMs ?? 45000;
      socket.emit('imposter:cooldown-update', {
        action: 'bug', remainingMs: 0, startCooldown: true, cooldownMs: sharedCooldownMs,
        applied,
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

  // Variable Shadow — replaces the old "False Hint" sabotage. Inserts a single
  // line that re-binds an existing variable to None/null right after its
  // original assignment. Reads downstream of the assignment now see the wiped
  // value, producing a quiet, subtle failure that's easy to miss in a diff.
  socket.on(
    'imposter:variable-shadow',
    ({ roomCode }: { roomCode: string }) => {
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);
      if (!player || player.role !== 'imposter') return;

      const { allowed, remainingMs } = imposterService.checkCooldown(roomCode, 'hint');
      if (!allowed) {
        socket.emit('imposter:cooldown-update', { action: 'hint', remainingMs });
        return;
      }

      let applied = false;
      if (game) {
        const mutation = pickShadowMutation(game.language, game.sharedCode);
        if (mutation) {
          const op = {
            rangeOffset: mutation.rangeOffset,
            rangeLength: mutation.rangeLength,
            text: mutation.text,
          };
          const result = gameService.updateSharedCode(roomCode, [op], game.editorVersion, socket.userId);
          if (result.accepted) {
            io.to(roomCode).emit('editor:op-apply', {
              userId: 'imposter',
              ops: [op],
              version: result.currentVersion,
            });
            io.to(roomCode).emit('imposter:bug-injected', { affectedLine: mutation.affectedLine });
            logger.debug(`[imposter ${roomCode}] variable-shadow ${mutation.description} @line=${mutation.affectedLine}`);
            applied = true;
          }
        }
      }

      imposterService.recordAction(roomCode, 'hint');
      const sharedCooldownMs = game?.settings?.impostorCooldownMs ?? 45000;
      socket.emit('imposter:cooldown-update', {
        action: 'hint', remainingMs: 0, startCooldown: true, cooldownMs: sharedCooldownMs,
        applied,
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
