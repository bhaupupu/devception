import { Router } from 'express';
import { verifyToken } from '../controllers/auth.controller';

const router = Router();
router.post('/verify', verifyToken);

export default router;
