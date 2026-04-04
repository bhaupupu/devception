import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { env } from '../config/env';
import { User } from '../models/User.model';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function checkPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const hashBuf = Buffer.from(hash, 'hex');
  const supplied = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuf, supplied);
}

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

export async function signupEmail(req: Request, res: Response): Promise<void> {
  const { email, password, displayName } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const hashed = hashPassword(password);
  const user = await User.create({
    googleId: `email:${email.toLowerCase()}`,
    email: email.toLowerCase(),
    displayName: displayName?.trim() || email.split('@')[0],
    avatarUrl: '',
    password: hashed,
  });

  res.status(201).json({ ok: true, userId: user._id });
}

export async function loginEmail(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !user.password) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = checkPassword(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  res.json({
    sub: user.googleId,
    name: user.displayName,
    email: user.email,
    picture: user.avatarUrl || '',
  });
}
