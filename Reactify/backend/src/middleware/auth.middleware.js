import { verifyIdToken } from '../config/firebase-admin.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: { message: 'Authentication required' }
            });
        }

        const token = authHeader.split(' ')[1];

        // Try to verify as Firebase ID token
        try {
            const decodedToken = await verifyIdToken(token);

            // Find user by Firebase UID
            const user = await User.findOne({ firebaseUid: decodedToken.uid });

            if (user) {
                req.userId = user._id;
                req.firebaseUser = decodedToken;
            } else {
                // User not synced yet, store Firebase data for sync endpoint
                req.firebaseUser = decodedToken;
            }

            next();
        } catch (firebaseError) {
            console.error('Firebase token verification failed:', firebaseError.message);
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid or expired token' }
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            error: { message: 'Authentication failed' }
        });
    }
};

// Optional middleware - allows unauthenticated requests but attaches user if present
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            try {
                const decodedToken = await verifyIdToken(token);
                const user = await User.findOne({ firebaseUid: decodedToken.uid });

                if (user) {
                    req.userId = user._id;
                    req.firebaseUser = decodedToken;
                }
            } catch (error) {
                // Token invalid, continue without auth
                console.log('Optional auth: invalid token, continuing without auth');
            }
        }

        next();
    } catch (error) {
        next();
    }
};
