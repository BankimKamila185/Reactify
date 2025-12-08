import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const signup = async (req, res) => {
    try {
        const { email, password, fullName, organization, role, phoneNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: { message: 'Email already registered' }
            });
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            fullName,
            organization,
            role,
            phoneNumber
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to create account' }
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' }
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' }
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Login failed' }
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get profile' }
        });
    }
};
