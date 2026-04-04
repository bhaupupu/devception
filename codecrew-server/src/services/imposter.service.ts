import { getLiveGame } from './game.service';
import { env } from '../config/env';

type ImposterAction = 'bug' | 'blur' | 'hint' | 'lock';

// In-memory cooldown tracker for lock (avoids schema changes)
const lockCooldowns = new Map<string, number>(); // roomCode -> lastUsedTimestamp

export function checkCooldown(
  roomCode: string,
  action: ImposterAction
): { allowed: boolean; remainingMs: number } {
  const game = getLiveGame(roomCode);
  // Use per-game cooldown setting, fallback to env defaults
  const gameCooldownMs = game?.settings?.impostorCooldownMs ?? env.IMPOSTER_BLUR_COOLDOWN_MS;

  if (action === 'lock') {
    const lastAt = lockCooldowns.get(roomCode);
    if (!lastAt) return { allowed: true, remainingMs: 0 };
    const remaining = gameCooldownMs - (Date.now() - lastAt);
    return { allowed: remaining <= 0, remainingMs: Math.max(0, remaining) };
  }

  if (!game) return { allowed: false, remainingMs: 0 };

  const { imposterActions } = game;
  const now = Date.now();
  let lastAt: Date | null;

  if (action === 'bug') {
    lastAt = imposterActions.lastBugInjectedAt;
  } else if (action === 'blur') {
    lastAt = imposterActions.lastBlurAt;
  } else {
    lastAt = imposterActions.lastHintAt;
  }

  if (!lastAt) return { allowed: true, remainingMs: 0 };

  const elapsed = now - lastAt.getTime();
  const remaining = gameCooldownMs - elapsed;
  return { allowed: remaining <= 0, remainingMs: Math.max(0, remaining) };
}

export function recordAction(roomCode: string, action: ImposterAction): void {
  if (action === 'lock') {
    lockCooldowns.set(roomCode, Date.now());
    return;
  }

  const game = getLiveGame(roomCode);
  if (!game) return;

  const now = new Date();
  if (action === 'bug') game.imposterActions.lastBugInjectedAt = now;
  else if (action === 'blur') game.imposterActions.lastBlurAt = now;
  else game.imposterActions.lastHintAt = now;
}
