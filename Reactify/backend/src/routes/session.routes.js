import express from 'express';
import {
    createSession,
    getSession,
    joinSession
} from '../controllers/sessionController.js';

const router = express.Router();

// POST /api/session - Create new session
router.post('/', createSession);

// GET /api/session/:id - Get session details
router.get('/:id', getSession);

// POST /api/session/join/:sessionCode - Join session
router.post('/join/:sessionCode', joinSession);

export default router;
