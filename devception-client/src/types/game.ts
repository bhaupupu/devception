export type GamePhase =
  | 'waiting'
  | 'role-reveal'
  | 'in-progress'
  | 'meeting'
  | 'voting'
  | 'results';

export type Role = 'good-coder' | 'imposter';

export interface PlayerState {
  userId: string;
  socketId: string;
  displayName: string;
  avatarUrl: string;
  role: Role;
  isAlive: boolean;
  isConnected: boolean;
  tasksCompleted: string[];
  cursorPosition: { line: number; column: number } | null;
  color: string;
  readyToStart: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'fix-bug' | 'complete-function' | 'answer-quiz' | 'code-review';
  starterCode: string;
  solutionCode: string;
  testCases: { input: string; expectedOutput: string }[];
  assignedTo: string | null;
  completedBy: string | null;
  isCompleted: boolean;
  progressValue: number;
}

export interface Meeting {
  _id: string;
  calledBy: string;
  calledAt: string;
  phase: 'discussion' | 'voting' | 'results';
  discussionDurationMs: number;
  votingDurationMs: number;
  votes: { voterId: string; targetId: string }[];
  ejectedPlayer: string | null;
  wasImposter: boolean | null;
}

export interface MainTestCaseState {
  id: string;
  description: string;
  passed: boolean;
}

export interface ProtectedRange {
  name: string;
  startLine: number;
  endLine: number;
}

export interface GameState {
  roomCode: string;
  phase: GamePhase;
  language: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  maxPlayers: number;
  players: PlayerState[];
  tasks: Task[];
  mainTestCases: MainTestCaseState[];
  protectedRanges?: ProtectedRange[];
  sharedCode: string;
  sharedProgress: number;
  editorVersion: number;
  timer: {
    gameStartedAt: string | null;
    gameDurationMs: number;
    remainingMs: number;
  };
  meetings: Meeting[];
  winner: 'good-coders' | 'imposters' | null;
  settings: {
    imposterCount: number;
    tasksPerPlayer: number;
    impostorCooldownMs: number;
    discussionTimeMs: number;
    votingTimeMs: number;
  };
}
