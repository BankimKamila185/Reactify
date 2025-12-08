import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AIJob from '../models/AIJob.js';
import { ContentType, AIJobStatus } from '../types/index.js';
import { processAIContent } from '../services/aiProcessing.service.js';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.pptx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, PPTX, and TXT files are allowed.'));
    }
};

// Multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 50) * 1024 * 1024 // Default 50MB
    }
});

export const uploadContent = async (req, res) => {
    try {
        const { sessionId, youtubeUrl } = req.body;
        const file = req.file;

        if (!sessionId) {
            res.status(400).json({
                success: false,
                error: { message: 'Session ID is required' }
            });
            return;
        }

        if (!file && !youtubeUrl) {
            res.status(400).json({
                success: false,
                error: { message: 'Either file or YouTube URL is required' }
            });
            return;
        }

        let contentType;
        let fileUrl;
        let fileName;

        if (youtubeUrl) {
            contentType = ContentType.YOUTUBE;
            fileUrl = youtubeUrl;
            fileName = 'YouTube Video';
        } else if (file) {
            const ext = path.extname(file.originalname).toLowerCase();

            switch (ext) {
                case '.pdf':
                    contentType = ContentType.PDF;
                    break;
                case '.docx':
                    contentType = ContentType.DOCX;
                    break;
                case '.pptx':
                    contentType = ContentType.PPTX;
                    break;
                case '.txt':
                    contentType = ContentType.TXT;
                    break;
                default:
                    res.status(400).json({
                        success: false,
                        error: { message: 'Unsupported file type' }
                    });
                    return;
            }

            fileUrl = file.path;
            fileName = file.originalname;
        } else {
            res.status(400).json({
                success: false,
                error: { message: 'No content provided' }
            });
            return;
        }

        // Create AI job record
        const aiJob = await AIJob.create({
            sessionId,
            status: AIJobStatus.PENDING,
            contentType,
            fileUrl,
            fileName,
            progress: 0,
            statusMessage: 'Queued for processing...'
        });

        // Start async processing
        processAIContent(aiJob._id.toString()).catch(error => {
            console.error('AI processing error:', error);
        });

        res.status(201).json({
            success: true,
            data: {
                jobId: aiJob._id,
                status: aiJob.status,
                message: 'Content upload successful. Processing started.'
            }
        });
    } catch (error) {
        console.error('Upload content error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to upload content' }
        });
    }
};

export const getAIJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;

        const aiJob = await AIJob.findById(jobId);

        if (!aiJob) {
            res.status(404).json({
                success: false,
                error: { message: 'AI job not found' }
            });
            return;
        }

        res.json({
            success: true,
            data: {
                jobId: aiJob._id,
                status: aiJob.status,
                progress: aiJob.progress,
                statusMessage: aiJob.statusMessage,
                result: aiJob.result,
                error: aiJob.error
            }
        });
    } catch (error) {
        console.error('Get AI job status error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to retrieve AI job status' }
        });
    }
};
