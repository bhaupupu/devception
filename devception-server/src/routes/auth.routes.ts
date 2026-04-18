import { Router } from 'express';
import { verifyToken, signupEmail, loginEmail } from '../controllers/auth.controller';

const router = Router();
router.post('/verify', verifyToken);
router.post('/signup', signupEmail);
router.post('/login-email', loginEmail);

export default router;
