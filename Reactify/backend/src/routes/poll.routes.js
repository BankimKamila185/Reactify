import express from 'express';
import {
    createPoll,
    getPollResults,
    submitFeedback,
    getSessionFeedback,
    resetPoll,
    lockPoll,
    resetSessionPolls,
    getSessionPolls,
    updatePoll,
    deletePoll,
    getMyPresentations,
    getSharedPresentations,
    submitWordCloudResponse,
    submitOpenEndedResponse,
    submitScalesResponse,
    submitRankingResponse,
    submitQAQuestion,
    upvoteQuestion,
    markQuestionAnswered
} from '../controllers/pollController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// PROTECTED ROUTES (require authentication)
// ============================================

// GET /api/poll/my-presentations - Get user's presentations
router.get('/my-presentations', authMiddleware, getMyPresentations);

// GET /api/poll/shared-presentations - Get presentations shared with the user
router.get('/shared-presentations', authMiddleware, getSharedPresentations);

// POST /api/poll/session/:sessionId - Create new poll
router.post('/session/:sessionId', authMiddleware, createPoll);

// PUT /api/poll/:pollId - Update poll
router.put('/:pollId', authMiddleware, updatePoll);

// DELETE /api/poll/:pollId - Delete poll
router.delete('/:pollId', authMiddleware, deletePoll);

// POST /api/poll/:pollId/reset - Reset poll (clear votes)
router.post('/:pollId/reset', authMiddleware, resetPoll);

// POST /api/poll/:pollId/lock - Lock/unlock poll
router.post('/:pollId/lock', authMiddleware, lockPoll);

// POST /api/poll/session/:sessionId/reset - Reset all polls in session
router.post('/session/:sessionId/reset', authMiddleware, resetSessionPolls);

// PUT /api/poll/:pollId/qa/:questionId/answered - Mark question as answered
router.put('/:pollId/qa/:questionId/answered', authMiddleware, markQuestionAnswered);

// ============================================
// PUBLIC ROUTES (for participants)
// ============================================

// GET /api/poll/session/:sessionId - Get all polls for a session
router.get('/session/:sessionId', getSessionPolls);

// GET /api/poll/:pollId/results - Get poll results
router.get('/:pollId/results', getPollResults);

// POST /api/poll/:pollId/feedback - Submit feedback
router.post('/:pollId/feedback', submitFeedback);

// GET /api/poll/session/:sessionId/feedback - Get all feedback for session
router.get('/session/:sessionId/feedback', getSessionFeedback);

// ============================================
// PARTICIPANT SUBMISSION ROUTES
// ============================================

// POST /api/poll/:pollId/word-cloud - Submit word cloud response
router.post('/:pollId/word-cloud', submitWordCloudResponse);

// POST /api/poll/:pollId/open-ended - Submit open-ended response
router.post('/:pollId/open-ended', submitOpenEndedResponse);

// POST /api/poll/:pollId/scales - Submit scales response
router.post('/:pollId/scales', submitScalesResponse);

// POST /api/poll/:pollId/ranking - Submit ranking response
router.post('/:pollId/ranking', submitRankingResponse);

// POST /api/poll/:pollId/qa - Submit Q&A question
router.post('/:pollId/qa', submitQAQuestion);

// POST /api/poll/:pollId/qa/:questionId/upvote - Upvote a question
router.post('/:pollId/qa/:questionId/upvote', upvoteQuestion);

export default router;
