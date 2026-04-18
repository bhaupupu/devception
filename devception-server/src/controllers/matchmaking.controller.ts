import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as matchmakingService from '../services/matchmaking.service';

export function joinQueue(req: AuthRequest, res: Response): void {
  const { skillLevel, language } = req.body;
  if (!skillLevel || !language) {
    res.status(400).json({ error: 'skillLevel and language are required' });
    return;
  }

  matchmakingService.joinQueue({
    userId: req.userId!,
    socketId: '', // will be updated on socket connect
    displayName: req.userDoc?.displayName ?? 'Anonymous',
    avatarUrl: req.userDoc?.avatarUrl ?? '',
    skillLevel,
    language,
    joinedAt: Date.now(),
  });

  res.json({ status: 'queued' });
}

export function leaveQueue(req: AuthRequest, res: Response): void {
  matchmakingService.leaveQueue(req.userId!);
  res.json({ status: 'left' });
}

export function getQueueStatus(req: AuthRequest, res: Response): void {
  const status = matchmakingService.getQueueStatus(req.userId!);
  if (!status) {
    res.json({ inQueue: false });
    return;
  }
  res.json({ inQueue: true, ...status });
}
