import { env } from '../config/env';
import { createRoom, addPlayerToGame, getLiveGame } from './game.service';
import { logger } from '../utils/logger';

interface QueueEntry {
  userId: string;
  socketId: string;
  displayName: string;
  avatarUrl: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  joinedAt: number;
}

// Bucket key: `${skillLevel}:${language}`
const queues = new Map<string, QueueEntry[]>();

function bucketKey(skillLevel: string, language: string): string {
  return `${skillLevel}:${language}`;
}

export function joinQueue(entry: QueueEntry): void {
  const key = bucketKey(entry.skillLevel, entry.language);
  const queue = queues.get(key) ?? [];
  // Remove if already in queue
  const filtered = queue.filter((e) => e.userId !== entry.userId);
  filtered.push(entry);
  queues.set(key, filtered);
  logger.info(`Player ${entry.displayName} joined queue [${key}] — queue size: ${filtered.length}`);
}

export function leaveQueue(userId: string): void {
  for (const [key, queue] of queues.entries()) {
    const filtered = queue.filter((e) => e.userId !== userId);
    queues.set(key, filtered);
  }
}

export function getQueueStatus(userId: string): { position: number; total: number } | null {
  for (const queue of queues.values()) {
    const idx = queue.findIndex((e) => e.userId === userId);
    if (idx >= 0) return { position: idx + 1, total: queue.length };
  }
  return null;
}

export async function tryMatchPlayers(
  key: string,
  onMatch: (roomCode: string, players: QueueEntry[]) => void
): Promise<void> {
  const queue = queues.get(key) ?? [];
  if (queue.length < env.MIN_PLAYERS) return;

  const [skillLevel, language] = key.split(':') as [
    'beginner' | 'intermediate' | 'advanced',
    string,
  ];

  const toMatch = queue.splice(0, env.MAX_PLAYERS);
  queues.set(key, queue);

  const game = await createRoom(language, skillLevel);
  for (const entry of toMatch) {
    await addPlayerToGame(
      game.roomCode,
      entry.userId,
      entry.socketId,
      entry.displayName,
      entry.avatarUrl
    );
  }

  logger.info(`Matched ${toMatch.length} players into room ${game.roomCode}`);
  onMatch(game.roomCode, toMatch);
}

export function getAllQueueKeys(): string[] {
  return [...queues.keys()];
}
