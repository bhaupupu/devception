import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env';
import { socketAuthMiddleware, AuthenticatedSocket } from './middleware/socketAuth';
import { registerRoomHandlers } from './handlers/room.handler';
import { registerEditorHandlers } from './handlers/editor.handler';
import { registerTaskHandlers } from './handlers/task.handler';
import { registerImposterHandlers } from './handlers/imposter.handler';
import { registerMeetingHandlers } from './handlers/meeting.handler';
import { registerChatHandlers } from './handlers/chat.handler';
import { logger } from '../utils/logger';

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    const authed = socket as AuthenticatedSocket;
    logger.info(`Socket connected: ${authed.displayName} (${socket.id})`);

    registerRoomHandlers(io, authed);
    registerEditorHandlers(io, authed);
    registerTaskHandlers(io, authed);
    registerImposterHandlers(io, authed);
    registerMeetingHandlers(io, authed);
    registerChatHandlers(io, authed);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${authed.displayName} (${socket.id})`);
    });
  });

  return io;
}
