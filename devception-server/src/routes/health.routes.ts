import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env';

const router = Router();

// GET /health
// Lightweight liveness probe — used by Render's health check system.
// Returns 200 immediately; does NOT check DB (so the service stays "up" even
// during a transient MongoDB hiccup rather than cycling the health-check alarm).
router.get('/', (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    platform: env.PLATFORM,
    nodeVersion: process.version,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// GET /health/db
// Readiness probe — checks live MongoDB connection state.
// Returns 200 when connected, 503 when not, so callers can distinguish
// "server alive but DB unavailable" from "server down".
router.get('/db', (_req: Request, res: Response): void => {
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const state = mongoose.connection.readyState;
  const statusText = stateMap[state] ?? 'unknown';
  const isHealthy = state === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: statusText,
    healthy: isHealthy,
    // Expose DB host (without credentials) for debugging — safe in server logs
    host: mongoose.connection.host ?? null,
    db: mongoose.connection.name ?? null,
  });
});

export default router;
