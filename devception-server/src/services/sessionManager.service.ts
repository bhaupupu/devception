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

interface Session {
  socketId: string;
  connectedAt: number;
}

const activeByUser = new Map<string, Session>();

// Track sockets that we deliberately disconnected as part of a takeover, so the
// room-leave handler can skip broadcasting "<name> left" — the user didn't leave,
// they were signed out on the old device in favor of the new one.
const takeoverSockets = new Set<string>();

export interface TakeoverNotice {
  previousSocketId: string;
}

export function register(userId: string, socketId: string): TakeoverNotice | null {
  const existing = activeByUser.get(userId);
  activeByUser.set(userId, { socketId, connectedAt: Date.now() });

  if (existing && existing.socketId !== socketId) {
    takeoverSockets.add(existing.socketId);
    logger.info(`session takeover: user=${userId} oldSocket=${existing.socketId} newSocket=${socketId}`);
    return { previousSocketId: existing.socketId };
  }
  return null;
}

export function unregister(userId: string, socketId: string): void {
  const existing = activeByUser.get(userId);
  if (existing && existing.socketId === socketId) {
    activeByUser.delete(userId);
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

export function activeSocketFor(userId: string): string | undefined {
  return activeByUser.get(userId)?.socketId;
}
