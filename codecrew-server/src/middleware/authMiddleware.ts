import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User.model';

export interface AuthRequest extends Request {
  userId?: string;
  userDoc?: InstanceType<typeof User>;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token' });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, env.NEXTAUTH_SECRET) as {
      sub?: string;
      name?: string;
      email?: string;
      picture?: string;
    };
    if (!decoded.sub) throw new Error('No sub');

    const user = await User.findOneAndUpdate(
      { googleId: decoded.sub },
      {
        $setOnInsert: {
          googleId: decoded.sub,
          email: decoded.email ?? `${decoded.sub}@codecrew.dev`,
          displayName: decoded.name ?? 'Player',
          avatarUrl: decoded.picture ?? '',
        },
      },
      { upsert: true, new: true }
    );

    req.userId = user._id.toString();
    req.userDoc = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
