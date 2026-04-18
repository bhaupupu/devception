import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../../models/User.model';
import { logger } from '../../utils/logger';

export interface AuthenticatedSocket extends Socket {
  userId: string;
  displayName: string;
  avatarUrl: string;
  email: string;
}

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No auth token'));

  try {
    const decoded = jwt.verify(token, env.NEXTAUTH_SECRET) as {
      sub?: string;
      name?: string;
      email?: string;
      picture?: string;
    };

    const userId = decoded.sub;
    if (!userId) return next(new Error('Invalid token'));

    // Upsert user in DB
    const user = await User.findOneAndUpdate(
      { googleId: userId },
      {
        $set: {
          displayName: decoded.name ?? 'Anonymous',
          email: decoded.email ?? '',
          avatarUrl: decoded.picture ?? '',
          lastSeen: new Date(),
        },
        $setOnInsert: { googleId: userId },
      },
      { upsert: true, new: true }
    );

    (socket as AuthenticatedSocket).userId = userId; // decoded.sub (same as session.user.id)
    (socket as AuthenticatedSocket).displayName = user.displayName;
    (socket as AuthenticatedSocket).avatarUrl = user.avatarUrl;
    (socket as AuthenticatedSocket).email = user.email;

    next();
  } catch (e) {
    logger.warn('Socket auth failed', e);
    next(new Error('Invalid token'));
  }
}
