import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createRoom, getOrLoadGame } from '../services/game.service';
import { GameHistory } from '../models/GameHistory.model';

export async function createPrivateRoom(req: AuthRequest, res: Response): Promise<void> {
  const { language = 'javascript', skillLevel = 'beginner', maxPlayers = 8 } = req.body;
  const game = await createRoom(language, skillLevel, maxPlayers);
  res.json({ roomCode: game.roomCode });
}

export async function getRoom(req: AuthRequest, res: Response): Promise<void> {
  const roomCode = Array.isArray(req.params.roomCode) ? req.params.roomCode[0] : req.params.roomCode;
  const game = await getOrLoadGame(roomCode);
  if (!game) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json(game);
}

export async function getGameResults(req: AuthRequest, res: Response): Promise<void> {
  const history = await GameHistory.findOne({ gameId: req.params.gameId });
  if (!history) {
    res.status(404).json({ error: 'Results not found' });
    return;
  }
  res.json(history);
}
