export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
];

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const GAME_PHASES = {
  WAITING: 'waiting',
  ROLE_REVEAL: 'role-reveal',
  IN_PROGRESS: 'in-progress',
  MEETING: 'meeting',
  VOTING: 'voting',
  RESULTS: 'results',
} as const;

export const PLAYER_COLORS = [
  '#C51111', '#132ED1', '#117F2D', '#ED54BA',
  '#EF7D0E', '#F5F557', '#3F474E', '#D6E0F0',
];
