import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createPrivateRoom, getRoom, getGameResults } from '../controllers/game.controller';

const router = Router();
router.use(authMiddleware);
router.post('/create', createPrivateRoom);
router.get('/:roomCode', getRoom);
router.get('/results/:gameId', getGameResults);

export default router;
