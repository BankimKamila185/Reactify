import Session from '../models/Session.js';
import Participant from '../models/Participant.js';
import Poll from '../models/Poll.js';
import { nanoid, customAlphabet } from 'nanoid';

// Generate unique 8-digit session code using nanoid for better uniqueness
const nanoidNumeric = customAlphabet('0123456789', 8);
const generateSessionCode = () => nanoidNumeric();

export const createSession = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || title.trim() === '') {
            res.status(400).json({
                success: false,
                error: { message: 'Session title is required' }
            });
            return;
        }

        // Generate unique session code
        let sessionCode = generateSessionCode();
        let existingSession = await Session.findOne({ sessionCode });

        // Ensure uniqueness
        while (existingSession) {
            sessionCode = generateSessionCode();
            existingSession = await Session.findOne({ sessionCode });
        }

        const hostId = nanoid();
        const session = await Session.create({
            sessionCode,
            hostId,
            title: title.trim(),
            isActive: true,
            currentPollIndex: 0
        });

        res.status(201).json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    sessionCode: session.sessionCode,
                    title: session.title,
                    createdAt: session.createdAt,
                    isActive: session.isActive,
                    hostId: hostId
                }
            }
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to create session' }
        });
    }
};

export const getSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found' }
            });
            return;
        }

        const polls = await Poll.find({ sessionId: session._id }).sort({ order: 1 });
        const participants = await Participant.find({ sessionId: session._id });

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    sessionCode: session.sessionCode,
                    title: session.title,
                    createdAt: session.createdAt,
                    isActive: session.isActive,
                    currentPollIndex: session.currentPollIndex
                },
                polls,
                participants: participants.map(p => ({
                    id: p._id,
                    name: p.name,
                    joinedAt: p.joinedAt
                }))
            }
        });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to retrieve session' }
        });
    }
};

export const joinSession = async (req, res) => {
    try {
        const { sessionCode } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            res.status(400).json({
                success: false,
                error: { message: 'Participant name is required' }
            });
            return;
        }

        const session = await Session.findOne({ sessionCode, isActive: true });

        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found or inactive' }
            });
            return;
        }

        const participant = await Participant.create({
            sessionId: session._id,
            name: name.trim()
        });

        res.json({
            success: true,
            data: {
                participant: {
                    id: participant._id,
                    name: participant.name,
                    sessionId: session._id
                },
                session: {
                    id: session._id,
                    title: session.title,
                    currentPollIndex: session.currentPollIndex
                }
            }
        });
    } catch (error) {
        console.error('Join session error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to join session' }
        });
    }
};

// Delete session and all associated data
export const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found' }
            });
            return;
        }

        // Delete all associated polls
        await Poll.deleteMany({ sessionId: id });

        // Delete all participants
        await Participant.deleteMany({ sessionId: id });

        // Delete the session
        await Session.findByIdAndDelete(id);

        res.json({
            success: true,
            data: { message: 'Session deleted successfully' }
        });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to delete session' }
        });
    }
};

// Update session (e.g., title)
export const updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const session = await Session.findById(id);

        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found' }
            });
            return;
        }

        if (title) {
            session.title = title.trim();
        }

        await session.save();

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    sessionCode: session.sessionCode,
                    title: session.title,
                    createdAt: session.createdAt,
                    isActive: session.isActive
                }
            }
        });
    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update session' }
        });
    }
};
