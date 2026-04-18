import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getMe, updateMe, getProfile, getHistory } from '../controllers/user.controller';

const router = Router();
router.use(authMiddleware);
router.get('/me', getMe);
router.patch('/me', updateMe);
router.get('/me/history', getHistory);
router.get('/:userId', getProfile);

export default router;
