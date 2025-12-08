import express from 'express';
import { upload, uploadContent, getAIJobStatus } from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload/content - Upload content for AI processing
router.post('/content', upload.single('file'), uploadContent);

// GET /api/upload/job/:jobId - Get AI job status
router.get('/job/:jobId', getAIJobStatus);

export default router;
