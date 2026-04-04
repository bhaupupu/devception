import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/codecrew',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  // Cooldowns (ms)
  IMPOSTER_BUG_COOLDOWN_MS: parseInt(process.env.IMPOSTER_BUG_COOLDOWN_MS || '45000', 10),
  IMPOSTER_BLUR_COOLDOWN_MS: parseInt(process.env.IMPOSTER_BLUR_COOLDOWN_MS || '60000', 10),
  IMPOSTER_HINT_COOLDOWN_MS: parseInt(process.env.IMPOSTER_HINT_COOLDOWN_MS || '30000', 10),

  // Game settings
  GAME_DURATION_MS: parseInt(process.env.GAME_DURATION_MS || '900000', 10),
  MEETING_DISCUSSION_MS: parseInt(process.env.MEETING_DISCUSSION_MS || '60000', 10),
  MEETING_VOTING_MS: parseInt(process.env.MEETING_VOTING_MS || '30000', 10),
  MAX_PLAYERS: parseInt(process.env.MAX_PLAYERS || '8', 10),
  MIN_PLAYERS: parseInt(process.env.MIN_PLAYERS || '4', 10),
};
