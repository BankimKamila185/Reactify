import express from 'express';
import { generateSlides } from '../controllers/aiController.js';

const router = express.Router();

// Generate slides with AI (no auth required for now)
router.post('/generate-slides', generateSlides);

export default router;
