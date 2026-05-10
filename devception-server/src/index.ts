import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { createSocketServer } from './socket';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import gameRoutes from './routes/game.routes';
import matchmakingRoutes from './routes/matchmaking.routes';
import healthRoutes from './routes/health.routes';

const app = express();
const httpServer = http.createServer(app);

// ─── Compression ─────────────────────────────────────────────────────────────
// Gzip/brotli compress all JSON API responses. Saves 60–80% bandwidth.
// Must come before other middleware so the response stream is compressed.
app.use(compression());

// HTTP keep-alive — reduces TCP handshake overhead for repeated API calls
app.use((_req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});

// ─── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = [env.CLIENT_ORIGIN, 'http://localhost:3000'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/health', healthRoutes);       // /health  and  /health/db
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/matchmaking', matchmakingRoutes);

app.use(errorHandler);

// ─── Socket.IO ─────────────────────────────────────────────────────────────────
const io = createSocketServer(httpServer);

// ─── Graceful shutdown ─────────────────────────────────────────────────────────
// Render (and Railway) send SIGTERM before forcefully killing the process.
// We close the HTTP server first (stops accepting new requests), then shut down
// Socket.IO, then close the Mongoose connection cleanly.
let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`${signal} received — starting graceful shutdown`);

  // 1. Stop accepting new HTTP connections
  httpServer.close((err) => {
    if (err) logger.error('Error closing HTTP server', { error: (err as Error).message });
    else logger.info('HTTP server closed');
  });

  // 2. Close Socket.IO (disconnect all clients gracefully)
  io.close(() => {
    logger.info('Socket.IO server closed');
  });

  // 3. Close MongoDB connection
  try {
    await disconnectDB();
  } catch (err) {
    logger.error('Error closing MongoDB', { error: (err as Error).message });
  }

  logger.info('Graceful shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT',  () => void shutdown('SIGINT'));

// Catch unhandled promise rejections and log them without crashing
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: String(reason) });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception — exiting', { error: err.message, stack: err.stack });
  process.exit(1);
});

// ─── Bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  logger.info(`Starting CodeCrew server [platform=${env.PLATFORM}, env=${env.NODE_ENV}]`);
  await connectDB();
  httpServer.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

bootstrap();
