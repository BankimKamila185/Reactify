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
import aiRoutes from './routes/ai.routes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
];

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Dynamic CORS origin checker for both Express and Socket.IO
const checkOrigin = (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    // In development, allow all localhost origins
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
    }

    // Allow Firebase hosting domains (production)
    if (origin.includes('.web.app') || origin.includes('.firebaseapp.com')) {
        return callback(null, true);
    }

    // Check against allowed origins list from environment
    if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
};

// Initialize Socket.IO with CORS and optimized settings for high concurrency
const io = new Server(httpServer, {
    cors: {
        origin: checkOrigin,
        methods: ['GET', 'POST'],
        credentials: true
    },
    // Optimizations for handling 700+ concurrent connections
    pingTimeout: 60000,           // 60 seconds before considering connection dead
    pingInterval: 25000,          // Ping every 25 seconds to keep connections alive
    maxHttpBufferSize: 1e6,       // 1MB max message size
    transports: ['websocket', 'polling'], // Prefer websocket
    allowUpgrades: true,
    perMessageDeflate: {          // Enable compression for efficiency
        threshold: 1024           // Compress messages larger than 1KB
    },
    connectTimeout: 45000         // 45 second connection timeout
});

// Set Socket.IO instance for AI progress updates
setIO(io);

// Middleware - CORS with preflight handling (uses shared checkOrigin function)
const corsOptions = {
    origin: checkOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

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
app.use('/api/ai', aiRoutes);

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

        // Start listening - bind to 0.0.0.0 for cloud deployments
        httpServer.listen(PORT, '0.0.0.0', () => {
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

