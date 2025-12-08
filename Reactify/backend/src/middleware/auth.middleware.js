import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: { message: 'Authentication required' }
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId || decoded.hostId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: { message: 'Invalid or expired token' }
        });
    }
};

export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
