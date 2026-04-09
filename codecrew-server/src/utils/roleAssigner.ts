export type Role = 'good-coder' | 'imposter';

export function assignRoles(playerIds: string[], requestedImposters: number = 1): Map<string, Role> {
  const count = playerIds.length;
  // Solo (1 player) = demo mode, no imposters. Otherwise always ≥1, capped at min(requested, count-1, 2).
  const imposterCount = count <= 1 ? 0 : Math.max(1, Math.min(requestedImposters, count - 1, 2));

  const shuffled = [...playerIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const roles = new Map<string, Role>();

  shuffled.forEach((id, idx) => {
    roles.set(id, idx < imposterCount ? 'imposter' : 'good-coder');
  });

  return roles;
}
