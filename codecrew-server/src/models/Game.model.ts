import mongoose, { Schema, Document, Types } from 'mongoose';

export type GamePhase =
  | 'waiting'
  | 'role-reveal'
  | 'in-progress'
  | 'meeting'
  | 'voting'
  | 'results';

export interface IPlayerState {
  userId: string;
  socketId: string;
  displayName: string;
  avatarUrl: string;
  role: 'good-coder' | 'imposter';
  isAlive: boolean;
  isConnected: boolean;
  tasksCompleted: string[];
  cursorPosition: { line: number; column: number } | null;
  color: string;
  readyToStart: boolean;
}

export interface ITaskDoc {
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

export interface IMeetingDoc {
  _id: string;
  calledBy: string;
  calledAt: Date;
  phase: 'discussion' | 'voting' | 'results';
  discussionDurationMs: number;
  votingDurationMs: number;
  votes: { voterId: string; targetId: string }[];
  ejectedPlayer: string | null;
  wasImposter: boolean | null;
}

export interface IGame extends Document {
  roomCode: string;
  phase: GamePhase;
  language: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  maxPlayers: number;
  players: IPlayerState[];
  tasks: ITaskDoc[];
  sharedCode: string;
  sharedProgress: number;
  editorVersion: number;
  timer: {
    gameStartedAt: Date | null;
    gameDurationMs: number;
    remainingMs: number;
  };
  imposterActions: {
    lastBugInjectedAt: Date | null;
    lastBlurAt: Date | null;
    lastHintAt: Date | null;
  };
  meetings: IMeetingDoc[];
  winner: 'good-coders' | 'imposters' | null;
  createdAt: Date;
  endedAt: Date | null;
  settings: {
    imposterCount: number;
    tasksPerPlayer: number;
    impostorCooldownMs: number;
  };
}

const PlayerStateSchema = new Schema<IPlayerState>(
  {
    userId: { type: String, required: true },
    socketId: { type: String, default: '' },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['good-coder', 'imposter'], default: 'good-coder' },
    isAlive: { type: Boolean, default: true },
    isConnected: { type: Boolean, default: true },
    tasksCompleted: { type: [String], default: [] },
    cursorPosition: { type: Schema.Types.Mixed, default: null },
    color: { type: String, default: '#ffffff' },
    readyToStart: { type: Boolean, default: false },
  },
  { _id: false }
);

const GameSchema = new Schema<IGame>(
  {
    roomCode: { type: String, required: true, unique: true },
    phase: {
      type: String,
      enum: ['waiting', 'role-reveal', 'in-progress', 'meeting', 'voting', 'results'],
      default: 'waiting',
    },
    language: { type: String, default: 'javascript' },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    maxPlayers: { type: Number, default: 8, min: 4, max: 10 },
    players: { type: [PlayerStateSchema], default: [] },
    tasks: { type: Schema.Types.Mixed, default: [] },
    sharedCode: { type: String, default: '' },
    sharedProgress: { type: Number, default: 0 },
    editorVersion: { type: Number, default: 0 },
    timer: {
      gameStartedAt: { type: Date, default: null },
      gameDurationMs: { type: Number, default: 900000 },
      remainingMs: { type: Number, default: 900000 },
    },
    imposterActions: {
      lastBugInjectedAt: { type: Date, default: null },
      lastBlurAt: { type: Date, default: null },
      lastHintAt: { type: Date, default: null },
    },
    meetings: { type: Schema.Types.Mixed, default: [] },
    winner: { type: String, enum: ['good-coders', 'imposters', null], default: null },
    endedAt: { type: Date, default: null },
    settings: {
      imposterCount: { type: Number, default: 1 },
      tasksPerPlayer: { type: Number, default: 5 },
      impostorCooldownMs: { type: Number, default: 60000 },
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model<IGame>('Game', GameSchema);
