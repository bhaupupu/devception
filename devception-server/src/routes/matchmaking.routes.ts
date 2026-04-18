import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { joinQueue, leaveQueue, getQueueStatus } from '../controllers/matchmaking.controller';

const router = Router();
router.use(authMiddleware);
router.post('/join', joinQueue);
router.delete('/leave', leaveQueue);
router.get('/status', getQueueStatus);

export default router;
