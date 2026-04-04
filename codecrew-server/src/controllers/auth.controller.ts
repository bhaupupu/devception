import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User.model';

export async function verifyToken(req: Request, res: Response): Promise<void> {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: 'Token required' });
    return;
  }

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
        $set: {
          displayName: decoded.name ?? 'Anonymous',
          email: decoded.email ?? '',
          avatarUrl: decoded.picture ?? '',
          lastSeen: new Date(),
        },
        $setOnInsert: { googleId: decoded.sub },
      },
      { upsert: true, new: true }
    );

    res.json({ userId: user._id, displayName: user.displayName });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
