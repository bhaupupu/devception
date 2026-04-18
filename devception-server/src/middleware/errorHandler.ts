import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
}
