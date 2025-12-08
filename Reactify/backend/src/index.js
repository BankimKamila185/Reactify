import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { setupSocketHandlers } from './events/socketHandlers.js';
import { setIO } from './events/aiProgressEmitter.js';
import sessionRoutes from './routes/session.routes.js';
import pollRoutes from './routes/poll.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import authRoutes from './routes/auth.routes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST']
    }
});

// Set Socket.IO instance for AI progress updates
setIO(io);

// Middleware
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Reactify API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/poll', pollRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start listening
        httpServer.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════╗
║   🚀 Reactify Backend Server         ║
║   Port: ${PORT}                      ║
║   Environment: ${process.env.NODE_ENV || 'development'}     ║
║   Socket.IO: ✅ Ready                ║
╚═══════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

startServer();

