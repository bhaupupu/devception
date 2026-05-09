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
import * as sessionManager from '../services/sessionManager.service';
import { logger } from '../utils/logger';

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if ([env.CLIENT_ORIGIN, 'http://localhost:3000'].includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
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

    // Register this socket as the authoritative connection for the user. If an
    // older socket existed, notify it and disconnect — "one active session" policy.
    const takeover = sessionManager.register(authed.userId, socket.id);
    if (takeover) {
      const old = io.sockets.sockets.get(takeover.previousSocketId);
      if (old) {
        old.emit('session:force-logout', {
          reason: 'signed-in-elsewhere',
          message: 'You were signed in on another device.',
        });
        // Give the client a tick to process the event before we drop the link.
        setTimeout(() => { try { old.disconnect(true); } catch { /* already gone */ } }, 250);
      }
    }

    registerRoomHandlers(io, authed);
    registerEditorHandlers(io, authed);
    registerTaskHandlers(io, authed);
    registerImposterHandlers(io, authed);
    registerMeetingHandlers(io, authed);
    registerChatHandlers(io, authed);

    socket.on('disconnect', () => {
      sessionManager.unregister(authed.userId, socket.id);
      logger.info(`Socket disconnected: ${authed.displayName} (${socket.id})`);
    });
  });

  return io;
}
