import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { logger } from '../../utils/logger';

export function registerRoomHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on('room:join', async ({ roomCode }: { roomCode: string }) => {
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

    // Broadcast full authoritative state to everyone in the room (including new player).
    // This ensures all clients have consistent player list, isConnected flags, etc.
    io.to(roomCode).emit('room:state', game.toObject());

    logger.info(`${socket.displayName} joined room ${roomCode}`);
  });

  socket.on('room:leave', ({ roomCode }: { roomCode: string }) => {
    gameService.markPlayerDisconnected(roomCode, socket.id);
    socket.leave(roomCode);
    io.to(roomCode).emit('room:player-left', { userId: socket.userId });
    logger.info(`${socket.displayName} left room ${roomCode}`);
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
    io.to(roomCode).emit('room:state', game.toObject());
    logger.info(`${socket.displayName} reset room ${roomCode}`);
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (roomCode) {
      gameService.markPlayerDisconnected(roomCode, socket.id);
      io.to(roomCode).emit('room:player-left', { userId: socket.userId });
    }
  });
}

function launchGame(io: Server, roomCode: string): void {
  const started = gameService.startGame(roomCode);
  if (!started) return;

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
    const gameObj = currentGame ? currentGame.toObject() : undefined;
    // Ensure settings reflect in-memory values (bypasses Mongoose subdocument serialization quirks)
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
