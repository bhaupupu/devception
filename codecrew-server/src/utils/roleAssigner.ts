export type Role = 'good-coder' | 'imposter';

export function assignRoles(playerIds: string[], requestedImposters: number = 1): Map<string, Role> {
  const count = playerIds.length;
  // Solo (1 player) = demo mode, no imposters. Otherwise always ≥1, capped at min(requested, count-1, 2).
  const imposterCount = count <= 1 ? 0 : Math.max(1, Math.min(requestedImposters, count - 1, 2));

  const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
  const roles = new Map<string, Role>();

  shuffled.forEach((id, idx) => {
    roles.set(id, idx < imposterCount ? 'imposter' : 'good-coder');
  });

  return roles;
}
