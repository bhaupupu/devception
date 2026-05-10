import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

// ─── Connection options ────────────────────────────────────────────────────────
// Tuned for cloud MongoDB Atlas accessed from Render / Railway free-tier hosts.
// • serverSelectionTimeoutMS – how long the driver waits to find a usable server
//   before throwing.  Render cold-starts are slower than Railway, so we give 15 s.
// • connectTimeoutMS – TCP connect handshake deadline.
// • socketTimeoutMS  – idle socket lifetime.  Must be > 30 s to survive Render's
//   keep-alive probes.
// • maxPoolSize      – cap connection pool to keep Atlas M0 (500 max) headroom.
// ──────────────────────────────────────────────────────────────────────────────
const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 15_000,
  connectTimeoutMS: 15_000,
  socketTimeoutMS: 60_000,
  maxPoolSize: 10,
  retryWrites: true,
};

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 3_000;

// ─── Retry connect ─────────────────────────────────────────────────────────────
async function connectWithRetry(retriesLeft: number): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, MONGOOSE_OPTIONS);
    logger.info('MongoDB connected successfully');
  } catch (err) {
    const msg = (err as Error).message ?? String(err);

    if (retriesLeft <= 0) {
      logger.error('MongoDB connection failed after all retries — exiting.', { error: msg });
      process.exit(1);
    }

    const delay = BASE_RETRY_DELAY_MS * (MAX_RETRIES - retriesLeft + 1); // linear back-off
    logger.warn(
      `MongoDB connection failed. Retrying in ${delay / 1000}s… (${retriesLeft} attempt(s) left)`,
      { error: msg }
    );
    await new Promise<void>((resolve) => setTimeout(resolve, delay));
    return connectWithRetry(retriesLeft - 1);
  }
}

// ─── Public API ────────────────────────────────────────────────────────────────
export async function connectDB(): Promise<void> {
  // Attach persistent event listeners BEFORE the first connect call so we
  // never miss events that fire on a reconnect after the initial boot.
  mongoose.connection.on('error', (err: Error) => {
    logger.error('MongoDB runtime error', { error: err.message });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected — Mongoose will attempt auto-reconnect');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  await connectWithRetry(MAX_RETRIES);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed gracefully');
}
