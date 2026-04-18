import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGameHistory extends Document {
  gameId: Types.ObjectId;
  roomCode: string;
  players: {
    userId: Types.ObjectId;
    role: string;
    isWinner: boolean;
    tasksCompleted: number;
    xpEarned: number;
  }[];
  winner: string;
  gameDurationMs: number;
  language: string;
  skillLevel: string;
  playedAt: Date;
}

const GameHistorySchema = new Schema<IGameHistory>({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  roomCode: { type: String, required: true },
  players: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      role: String,
      isWinner: Boolean,
      tasksCompleted: Number,
      xpEarned: Number,
    },
  ],
  winner: String,
  gameDurationMs: Number,
  language: String,
  skillLevel: String,
  playedAt: { type: Date, default: Date.now },
});

export const GameHistory = mongoose.model<IGameHistory>('GameHistory', GameHistorySchema);
