import express from 'express';
import { syncUser, getProfile, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/sync - Sync Firebase user with MongoDB
router.post('/sync', authMiddleware, syncUser);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authMiddleware, getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authMiddleware, updateProfile);

export default router;
