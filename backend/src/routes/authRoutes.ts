// src/routes/authRoutes.ts
import { Router } from 'express';
import { login } from '../controllers/authController';
import { userLimiter } from '../middlewares/rateLimiter';

const router = Router();
router.post('/login', userLimiter, login);

export default router;