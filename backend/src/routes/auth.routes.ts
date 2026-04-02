/**
 * Auth Routes
 * Authentication endpoints
 */

import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { requireAuth } from '@/middleware/requireAuth.middleware';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

export default router;
