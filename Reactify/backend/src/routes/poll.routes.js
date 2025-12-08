import express from 'express';
import {
    createPoll,
    getPollResults,
    submitFeedback,
    getSessionFeedback
} from '../controllers/pollController.js';

const router = express.Router();

// POST /api/poll/session/:sessionId - Create new poll
router.post('/session/:sessionId', createPoll);

// GET /api/poll/:pollId/results - Get poll results
router.get('/:pollId/results', getPollResults);

// POST /api/poll/:pollId/feedback - Submit feedback
router.post('/:pollId/feedback', submitFeedback);

// GET /api/poll/session/:sessionId/feedback - Get all feedback for session
router.get('/session/:sessionId/feedback', getSessionFeedback);

export default router;
