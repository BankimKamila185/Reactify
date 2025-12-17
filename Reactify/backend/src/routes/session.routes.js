import express from 'express';
import {
    createSession,
    getSession,
    joinSession,
    deleteSession,
    updateSession
} from '../controllers/sessionController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// PROTECTED ROUTES (require authentication)
// ============================================

// POST /api/session - Create new session
router.post('/', authMiddleware, createSession);

// PUT /api/session/:id - Update session
router.put('/:id', authMiddleware, updateSession);

// DELETE /api/session/:id - Delete session
router.delete('/:id', authMiddleware, deleteSession);

// ============================================
// PUBLIC ROUTES (for participants)
// ============================================

// GET /api/session/:id - Get session details
router.get('/:id', getSession);

// POST /api/session/join/:sessionCode - Join session
router.post('/join/:sessionCode', joinSession);

export default router;
