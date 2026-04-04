import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    timesImposter: number;
    tasksCompleted: number;
    bugsInjected: number;
    xp: number;
    level: number;
  };
  cosmetics: {
    selectedSkin: string;
    ownedSkins: string[];
    selectedHat: string;
    ownedHats: string[];
  };
  createdAt: Date;
  lastSeen: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    preferredLanguages: { type: [String], default: ['javascript'] },
    stats: {
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      timesImposter: { type: Number, default: 0 },
      tasksCompleted: { type: Number, default: 0 },
      bugsInjected: { type: Number, default: 0 },
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
    },
    cosmetics: {
      selectedSkin: { type: String, default: 'default' },
      ownedSkins: { type: [String], default: ['default'] },
      selectedHat: { type: String, default: 'none' },
      ownedHats: { type: [String], default: [] },
    },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
