import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { endGame } from '../../services/game.service';
import * as sessionManager from '../../services/sessionManager.service';
import { logger } from '../../utils/logger';

// Reconnect grace window: when a socket drops for any reason other than an
// explicit `room:leave`, we hold off on marking the player eliminated for a
// short while. If they rejoin (refresh, wifi blip, tab reload) within this
// window the disconnect never surfaces as a leave event and they step right
// back into their seat. If the window expires, the normal leave/end-game
// logic runs.
const RECONNECT_GRACE_MS = 10_000;
type PendingLeave = { timer: ReturnType<typeof setTimeout>; socket: AuthenticatedSocket; roomCode: string };
// Keyed by `${roomCode}:${userId}` so a single user can have at most one
// pending leave across all their past sockets (reconnection would replace it).
const pendingLeaves = new Map<string, PendingLeave>();

function pendingKey(roomCode: string, userId: string): string {
  return `${roomCode}:${userId}`;
}

function clearPendingLeave(roomCode: string, userId: string): boolean {
  const key = pendingKey(roomCode, userId);
  const existing = pendingLeaves.get(key);
  if (!existing) return false;
  clearTimeout(existing.timer);
  pendingLeaves.delete(key);
  return true;
}

// Single chokepoint for "player leaving" — explicit `room:leave` and the tail
// end of the grace window both route through here so the chat message + state
// updates fire exactly once per socket. If the leaver was the sole remaining
// imposter (or the last imposter while no good-coders remain), the game ends
// immediately.
async function announceAndHandleLeave(
  io: Server,
  socket: AuthenticatedSocket,
  roomCode: string
): Promise<void> {
  if (socket.data.leaveAnnounced) return;
  socket.data.leaveAnnounced = true;

  // If this socket is being disconnected because the same user signed in on a new
  // device (session takeover), the player did not actually leave. The new socket
  // is about to (or just did) take the seat over. Skip all the leave-path side
  // effects: no "<name> left" chat, no elimination, no end-game check.
  if (sessionManager.consumeTakeoverFlag(socket.id)) {
    logger.info(`${socket.displayName} socket ${socket.id} superseded by newer session — no leave broadcast`);
    return;
  }

  const game = gameService.getLiveGame(roomCode);
  const leaver = game?.players.find((p) => p.socketId === socket.id);

  // If this socket's seat has already been taken over (player's socketId no
  // longer matches this socket), another live socket holds the seat. Again, do
  // not broadcast a leave — the player is still here, just on a different link.
  if (game && !leaver) {
    const stillConnected = game.players.find((p) => p.userId === socket.userId && p.isConnected);
    if (stillConnected) {
      logger.info(`${socket.displayName} socket ${socket.id} orphaned (seat held by newer socket) — no leave broadcast`);
      return;
    }
  }

  gameService.markPlayerDisconnected(roomCode, socket.id);

  io.to(roomCode).emit('room:player-left', { userId: socket.userId });
  io.to(roomCode).emit('chat:system', {
    type: 'leave',
    message: `${socket.displayName} left the game`,
    timestamp: Date.now(),
  });
  logger.info(`${socket.displayName} left room ${roomCode}`);

  // End-game check: only applies during an active round.
  if (!game || game.phase !== 'in-progress' || !leaver) return;

  // Treat the leaver as eliminated for win-condition purposes.
  leaver.isAlive = false;
  const aliveImposters = game.players.filter((p) => p.isAlive && p.role === 'imposter');
  const aliveGoodCoders = game.players.filter((p) => p.isAlive && p.role === 'good-coder');

  let winner: 'good-coders' | 'imposters' | null = null;
  if (aliveImposters.length === 0) winner = 'good-coders';
  else if (aliveImposters.length >= aliveGoodCoders.length) winner = 'imposters';

  if (winner) {
    try { await endGame(roomCode, winner); } catch (err) { logger.error('endGame on leave failed', err as Error); }
    io.to(roomCode).emit('chat:system', {
      type: 'system',
      message: winner === 'good-coders'
        ? 'The imposter left the game — good coders win!'
        : 'Too few good coders remain — imposters win!',
      timestamp: Date.now(),
    });
    io.to(roomCode).emit('game:end', { winner });
  }
}

export function registerRoomHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on('room:join', async ({ roomCode }: { roomCode: string }) => {
    // If this user has a pending leave from a prior socket, cancel it — they
    // are back within the grace window and their seat should stay intact.
    const cancelled = clearPendingLeave(roomCode, socket.userId);

    const game = await gameService.addPlayerToGame(
      roomCode,
      socket.userId,
      socket.id,
      socket.displayName,
      socket.avatarUrl
    );

    if (!game) {
      socket.emit('room:error', { message: 'Room not found or full' });
      return;
    }

    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.leaveAnnounced = false;

    // Broadcast full authoritative state to everyone in the room (including new player).
    // This ensures all clients have consistent player list, isConnected flags, etc.
    io.to(roomCode).emit('room:state', gameService.sanitizeGame(game));

    if (cancelled) {
      // Reconnect inside grace — gentle signal so teammates know the player is back
      // without a noisy join spam for a player who never actually left.
      io.to(roomCode).emit('chat:system', {
        type: 'system',
        message: `${socket.displayName} reconnected.`,
        timestamp: Date.now(),
      });
      logger.info(`${socket.displayName} reconnected to room ${roomCode} inside grace window`);
    } else {
      logger.info(`${socket.displayName} joined room ${roomCode}`);
    }
  });

  socket.on('room:leave', async ({ roomCode }: { roomCode: string }) => {
    // Explicit leave: bypass grace, clear any pending timer, run the full
    // leave-handling logic immediately.
    clearPendingLeave(roomCode, socket.userId);
    await announceAndHandleLeave(io, socket, roomCode);
    socket.leave(roomCode);
  });

  socket.on('room:player-ready', ({ roomCode }: { roomCode: string }) => {
    const allReady = gameService.setPlayerReady(roomCode, socket.userId);
    io.to(roomCode).emit('room:ready-update', { userId: socket.userId, readyToStart: true });

    if (allReady) {
      const { env } = require('../../config/env');
      const game = gameService.getLiveGame(roomCode);
      const connectedCount = game?.players.filter((p) => p.isConnected).length ?? 0;
      if (connectedCount >= env.MIN_PLAYERS) {
        launchGame(io, roomCode);
      }
    }
  });

  // Admin settings update
  socket.on('room:update-settings', ({
    roomCode,
    settings,
  }: {
    roomCode: string;
    settings: Partial<{ imposterCount: number; tasksPerPlayer: number; impostorCooldownMs: number; discussionTimeMs: number; votingTimeMs: number }>;
  }) => {
    const game = gameService.getLiveGame(roomCode);
    if (!game || game.phase !== 'waiting') return;
    const isAdmin = game.players[0]?.userId === socket.userId;
    if (!isAdmin) return;
    const updated = gameService.updateGameSettings(roomCode, settings);
    if (!updated) return;
    io.to(roomCode).emit('room:settings-updated', { settings: updated });
  });

  // Admin force-start: first player (admin) can start regardless of ready state
  socket.on('room:force-start', ({ roomCode }: { roomCode: string }) => {
    const game = gameService.getLiveGame(roomCode);
    if (!game || game.phase !== 'waiting') return;

    const isAdmin = game.players[0]?.userId === socket.userId;
    if (!isAdmin) {
      socket.emit('room:error', { message: 'Only the room admin can force-start' });
      return;
    }

    const connectedCount = game.players.filter((p) => p.isConnected).length;
    const { env } = require('../../config/env');
    if (connectedCount < env.MIN_PLAYERS) {
      socket.emit('room:error', { message: `Need at least ${env.MIN_PLAYERS} players to start` });
      return;
    }

    launchGame(io, roomCode);
    logger.info(`${socket.displayName} force-started room ${roomCode}`);
  });

  // Play Again: reset room back to waiting with same players
  socket.on('room:reset', ({ roomCode }: { roomCode: string }) => {
    const game = gameService.resetGame(roomCode);
    if (!game) return;
    // Unicast only — don't broadcast to players still on the results screen
    socket.emit('room:state', game.toObject());
    logger.info(`${socket.displayName} reset room ${roomCode}`);
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;

    // A takeover or orphaned-seat disconnect runs the sync handler immediately —
    // the seat is already being handled by another live socket, so there is no
    // "real" disconnect to grace.
    if (sessionManager.isTakeoverSocket(socket.id)) {
      void announceAndHandleLeave(io, socket, roomCode);
      return;
    }

    // Mark the player as disconnected right away so teammates see the grayed-out
    // UI without delay. The full leave-handling (chat "left the game", end-game
    // check) is deferred until the grace window expires.
    gameService.markPlayerDisconnected(roomCode, socket.id);
    io.to(roomCode).emit('room:player-disconnected', { userId: socket.userId });

    const key = pendingKey(roomCode, socket.userId);
    // Replace any prior pending leave for the same user — the newest socket's
    // disconnect is the one we care about.
    const existing = pendingLeaves.get(key);
    if (existing) clearTimeout(existing.timer);

    const timer = setTimeout(async () => {
      pendingLeaves.delete(key);
      // Re-check: during the grace window, the user may have reconnected on
      // a new socket. If the game now shows them connected, skip the leave.
      const game = gameService.getLiveGame(roomCode);
      const player = game?.players.find((p) => p.userId === socket.userId);
      if (player?.isConnected) {
        logger.info(`${socket.displayName} reconnected before grace elapsed — no leave broadcast`);
        return;
      }
      await announceAndHandleLeave(io, socket, roomCode);
    }, RECONNECT_GRACE_MS);

    pendingLeaves.set(key, { timer, socket, roomCode });
    logger.info(`${socket.displayName} disconnected from ${roomCode} — grace window ${RECONNECT_GRACE_MS}ms`);
  });
}

function launchGame(io: Server, roomCode: string): void {
  const started = gameService.startGame(roomCode);
  if (!started) return;

  // Wipe chat for all clients so a fresh game starts with a clean panel.
  io.to(roomCode).emit('chat:clear', { reason: 'new-game' });
  io.to(roomCode).emit('chat:system', {
    type: 'system',
    message: 'A new game has started.',
    timestamp: Date.now(),
  });

  io.to(roomCode).emit('game:phase-change', { phase: 'role-reveal' });

  started.players.forEach((player) => {
    const playerSocket = io.sockets.sockets.get(player.socketId);
    if (playerSocket) {
      playerSocket.emit('game:role-reveal', { role: player.role, color: player.color });
    }
  });

  setTimeout(() => {
    gameService.setGamePhase(roomCode, 'in-progress');
    const currentGame = gameService.getLiveGame(roomCode);
    const gameObj = currentGame ? gameService.sanitizeGame(currentGame) as any : undefined;
    if (gameObj && currentGame) {
      gameObj.settings = {
        imposterCount: currentGame.settings.imposterCount,
        tasksPerPlayer: currentGame.settings.tasksPerPlayer,
        impostorCooldownMs: currentGame.settings.impostorCooldownMs,
        discussionTimeMs: currentGame.settings.discussionTimeMs,
        votingTimeMs: currentGame.settings.votingTimeMs,
      };
    }
    io.to(roomCode).emit('game:phase-change', {
      phase: 'in-progress',
      game: gameObj,
    });
    startGameTimer(io, roomCode);
  }, 3000);
}

function startGameTimer(io: Server, roomCode: string): void {
  const { env } = require('../../config/env');
  const endAt = Date.now() + env.GAME_DURATION_MS;

  const interval = setInterval(async () => {
    const phase = gameService.getGamePhase(roomCode);
    if (!phase || phase === 'results') {
      clearInterval(interval);
      return;
    }
    if (phase === 'meeting' || phase === 'voting') return;

    const remaining = Math.max(0, endAt - Date.now());
    const game = gameService.getLiveGame(roomCode);
    if (game) game.timer.remainingMs = remaining;

    io.to(roomCode).emit('game:timer-tick', { remainingMs: remaining });

    if (remaining <= 0) {
      clearInterval(interval);
      try { await gameService.endGame(roomCode, 'imposters'); } catch (err) { console.error('endGame error:', err); }
      io.to(roomCode).emit('game:end', { winner: 'imposters' });
    }
  }, 1000);
}
