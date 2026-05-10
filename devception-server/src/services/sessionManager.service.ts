// Per-user socket registry.
//
// Problem we are fixing: the app used to allow unlimited concurrent sockets for a
// single Google sub. If the user signed into a second device (or even a second tab),
// the server happily accepted both. When the second socket called room:join, the
// player record's socketId was overwritten but the first socket stayed subscribed
// to the room — a "ghost" that kept receiving broadcasts and could emit edits that
// routed to a stale seat.
//
// Policy (Option B from the bug report): "one active socket per user". When a new
// socket authenticates for a userId that already has a live socket, we force-
// disconnect the old one with a well-known reason. The client surfaces that reason
// as "You have been signed in on another device" and redirects to /login.
//
// Implementation notes:
//   - We keep it tiny and in-memory. A single-node deployment is what this
//     codebase targets. Scaling to multiple nodes would route this through
//     Redis pub/sub; the interface below is the only thing a later refactor
//     would need to swap.
//   - `register()` is called from socketAuth AFTER token verification succeeds.
//     It returns the socketId of the displaced peer (if any) so the caller can
//     notify+disconnect it. The caller does that, not us — keeps this module
//     free of a Socket.IO dependency.
//   - `unregister()` is called from the main disconnect handler. It is defensive:
//     if the registered socket has already been replaced (common on takeover),
//     we leave the newer registration in place.

import { logger } from '../utils/logger';
import Redis from 'ioredis';
import * as gameService from './game.service';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

// Track sockets that we deliberately disconnected as part of a takeover, so the
// room-leave handler can skip broadcasting "<name> left" — the user didn't leave,
// they were signed out on the old device in favor of the new one.
const takeoverSockets = new Set<string>();

export interface TakeoverNotice {
  previousSocketId: string;
}

export async function checkActiveGameConflict(userId: string): Promise<boolean> {
  // If Redis isn't available, we fall back to not blocking (or we could use local games)
  if (!redis) return false;
  
  // Find all games where this player is alive
  const games = Array.from(gameService.getAllLiveGames().values());
  const inLiveGame = games.some(g => 
    g.phase === 'in-progress' && 
    g.players.some(p => p.userId === userId && p.isAlive && p.isConnected)
  );
  
  // If they are actively playing, they shouldn't log in elsewhere
  return inLiveGame;
}

export async function register(userId: string, socketId: string): Promise<TakeoverNotice | null> {
  if (!redis) return null;
  
  const existingSocketId = await redis.get(`session:${userId}`);
  await redis.set(`session:${userId}`, socketId, 'EX', 86400); // 24hr TTL

  if (existingSocketId && existingSocketId !== socketId) {
    takeoverSockets.add(existingSocketId);
    logger.info(`session takeover: user=${userId} oldSocket=${existingSocketId} newSocket=${socketId}`);
    return { previousSocketId: existingSocketId };
  }
  return null;
}

export async function unregister(userId: string, socketId: string): Promise<void> {
  if (!redis) return;
  const existingSocketId = await redis.get(`session:${userId}`);
  if (existingSocketId === socketId) {
    await redis.del(`session:${userId}`);
  }
  takeoverSockets.delete(socketId);
}

export function isTakeoverSocket(socketId: string): boolean {
  return takeoverSockets.has(socketId);
}

export function consumeTakeoverFlag(socketId: string): boolean {
  const was = takeoverSockets.has(socketId);
  takeoverSockets.delete(socketId);
  return was;
}

export async function activeSocketFor(userId: string): Promise<string | undefined> {
  if (!redis) return undefined;
  const val = await redis.get(`session:${userId}`);
  return val || undefined;
}
