import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { v4 as uuidv4 } from 'uuid';

const MESSAGE_RATE_LIMIT = new Map<string, number[]>(); // socketId → timestamps

function isRateLimited(socketId: string): boolean {
  const now = Date.now();
  const window = 1000; // 1s
  const maxMessages = 3;

  const times = (MESSAGE_RATE_LIMIT.get(socketId) ?? []).filter((t) => now - t < window);
  if (times.length >= maxMessages) return true;

  times.push(now);
  MESSAGE_RATE_LIMIT.set(socketId, times);
  return false;
}

export function registerChatHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on('chat:send', ({ roomCode, message }: { roomCode: string; message: string }) => {
    if (isRateLimited(socket.id)) {
      socket.emit('chat:error', { message: 'Slow down!' });
      return;
    }

    const game = gameService.getLiveGame(roomCode);
    const player = game?.players.find((p) => p.userId === socket.userId);

    const sanitized = message.slice(0, 300).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    io.to(roomCode).emit('chat:message', {
      messageId: uuidv4(),
      userId: socket.userId,
      displayName: socket.displayName,
      message: sanitized,
      color: player?.color ?? '#ffffff',
      timestamp: Date.now(),
    });
  });
}
