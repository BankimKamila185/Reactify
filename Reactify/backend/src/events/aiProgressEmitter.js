import { Server } from 'socket.io';
import AIJob from '../models/AIJob.js';

let io: Server;

export const setIO = (ioInstance: Server) => {
    io = ioInstance;
};

export const emitAIProgress = async (sessionId, job) => {
    if (!io) {
        console.warn('Socket.IO instance not initialized');
        return;
    }

    io.to(`session-${sessionId}`).emit('ai-progress-update', {
        jobId: job._id,
        status: job.status,
        progress: job.progress,
        statusMessage: job.statusMessage,
        error: job.error,
        result: job.result
    });
};
