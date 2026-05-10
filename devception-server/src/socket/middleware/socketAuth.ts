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

// ─── In-process user profile cache ───────────────────────────────────────────
// Every socket connection previously hit MongoDB to upsert & fetch the user
// profile. At 4–8 players connecting simultaneously at game start this causes
// a burst of sequential DB round-trips during the most latency-sensitive moment.
//
// We cache the profile keyed by googleId (decoded.sub) for 5 minutes.
// The $set fields (displayName, avatarUrl, lastSeen) change rarely. A 5-minute
// stale window has zero gameplay impact while reducing handshake latency from
// ~100ms (DB round-trip) to <1ms (Map lookup).
interface CachedProfile {
  displayName: string;
  avatarUrl: string;
  email: string;
  cachedAt: number;
}
const profileCache = new Map<string, CachedProfile>();
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function resolveProfile(
  googleId: string,
  decoded: { name?: string; email?: string; picture?: string }
): Promise<CachedProfile> {
  const cached = profileCache.get(googleId);
  if (cached && Date.now() - cached.cachedAt < PROFILE_CACHE_TTL_MS) {
    return cached;
  }

  // Cache miss — upsert and fetch from MongoDB
  const user = await User.findOneAndUpdate(
    { googleId },
    {
      $set: {
        displayName: decoded.name ?? 'Anonymous',
        email: decoded.email ?? '',
        avatarUrl: decoded.picture ?? '',
        lastSeen: new Date(),
      },
      $setOnInsert: { googleId },
    },
    { upsert: true, new: true }
  );

  const profile: CachedProfile = {
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    email: user.email,
    cachedAt: Date.now(),
  };
  profileCache.set(googleId, profile);
  return profile;
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

    const profile = await resolveProfile(userId, decoded);

    (socket as AuthenticatedSocket).userId = userId;
    (socket as AuthenticatedSocket).displayName = profile.displayName;
    (socket as AuthenticatedSocket).avatarUrl = profile.avatarUrl;
    (socket as AuthenticatedSocket).email = profile.email;

    next();
  } catch (e) {
    logger.warn('Socket auth failed', e);
    next(new Error('Invalid token'));
  }
}
