import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authMiddleware, getProfile);

export default router;
