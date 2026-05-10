import dotenv from 'dotenv';
dotenv.config();

// ─── Helpers ───────────────────────────────────────────────────────────────────
function requireEnv(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (!val) {
    throw new Error(`[env] Missing required environment variable: ${key}`);
  }
  return val;
}

// ─── Detect hosting platform (for informational logging only) ─────────────────
// RAILWAY_ENVIRONMENT is set automatically on Railway.
// RENDER is set automatically on Render.
export const PLATFORM: 'railway' | 'render' | 'local' = process.env.RAILWAY_ENVIRONMENT
  ? 'railway'
  : process.env.RENDER
    ? 'render'
    : 'local';

// ─── MongoDB URI guard ────────────────────────────────────────────────────────
// Railway's internal MongoDB plugin issues a URL that only resolves inside
// Railway's private network (e.g. mongodb://mongo.railway.internal/...).
// Attempting to use it on Render causes a silent DNS/TCP failure.
// We detect this early and fail loudly with an actionable message.
const rawMongoUri =
  process.env.MONGODB_URI ??
  process.env.MONGO_URL ??
  process.env.MONGODB_URL ??
  '';

function resolveMongoUri(): string {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!rawMongoUri) {
    if (isProduction) {
      throw new Error(
        '[env] MONGODB_URI is not set. On Render, add it in the dashboard → Environment tab. ' +
        'Use a MongoDB Atlas connection string: mongodb+srv://user:pass@cluster.mongodb.net/codecrew'
      );
    }
    // Local dev fallback
    return 'mongodb://localhost:27017/codecrew';
  }

  // Detect Railway-internal URIs being used on a non-Railway host
  const railwayInternalPatterns = ['railway.internal', 'monorail.proxy.rlwy.net'];
  const isRailwayInternal = railwayInternalPatterns.some((p) => rawMongoUri.includes(p));
  if (isRailwayInternal && PLATFORM !== 'railway') {
    throw new Error(
      `[env] MONGODB_URI appears to be a Railway-internal URL (${rawMongoUri.substring(0, 40)}...) ` +
      `but the current platform is "${PLATFORM}". ` +
      'Railway-internal URLs are NOT reachable from Render. ' +
      'Set MONGODB_URI to a MongoDB Atlas connection string instead.'
    );
  }

  return rawMongoUri;
}

// ─── Exported config ──────────────────────────────────────────────────────────
export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  PLATFORM,

  MONGODB_URI: resolveMongoUri(),

  // Must match NEXTAUTH_SECRET in the Vercel frontend env
  NEXTAUTH_SECRET: requireEnv('NEXTAUTH_SECRET', process.env.NODE_ENV !== 'production' ? 'dev-secret-change-me' : undefined),

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  // Imposter cooldowns (ms)
  IMPOSTER_BUG_COOLDOWN_MS:  parseInt(process.env.IMPOSTER_BUG_COOLDOWN_MS  || '45000', 10),
  IMPOSTER_BLUR_COOLDOWN_MS: parseInt(process.env.IMPOSTER_BLUR_COOLDOWN_MS || '60000', 10),
  IMPOSTER_HINT_COOLDOWN_MS: parseInt(process.env.IMPOSTER_HINT_COOLDOWN_MS || '30000', 10),

  // Game settings
  GAME_DURATION_MS:     parseInt(process.env.GAME_DURATION_MS     || '900000', 10),
  MEETING_DISCUSSION_MS: parseInt(process.env.MEETING_DISCUSSION_MS || '60000', 10),
  MEETING_VOTING_MS:    parseInt(process.env.MEETING_VOTING_MS    || '30000', 10),
  MAX_PLAYERS: parseInt(process.env.MAX_PLAYERS || '8', 10),
  MIN_PLAYERS: parseInt(process.env.MIN_PLAYERS || '4', 10),
};
