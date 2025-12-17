import Session from '../models/Session.js';
import Participant from '../models/Participant.js';
import Poll from '../models/Poll.js';
import Response from '../models/Response.js';
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
            userId: req.userId, // Store the authenticated user's ID
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

        // Calculate vote counts for each poll from the Response collection
        const pollsWithVotes = await Promise.all(polls.map(async (poll) => {
            const pollObj = poll.toObject();

            // Get all responses for this poll
            const responses = await Response.find({ pollId: poll._id });

            if (pollObj.options && pollObj.options.length > 0) {
                // Count votes for each option
                const voteCounts = {};
                responses.forEach(response => {
                    const answers = Array.isArray(response.answer) ? response.answer : [response.answer];
                    answers.forEach(ans => {
                        voteCounts[ans] = (voteCounts[ans] || 0) + 1;
                    });
                });

                // Update options with vote counts
                pollObj.options = pollObj.options.map(opt => ({
                    ...opt,
                    votes: voteCounts[opt.id] || 0
                }));
            }

            pollObj.totalResponses = responses.length;
            return pollObj;
        }));

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
                polls: pollsWithVotes,
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

        // Verify ownership - user must be the owner or have edit permission
        const isOwner = session.userId && session.userId.toString() === req.userId?.toString();
        const hasEditPermission = session.sharedWith?.some(
            share => share.email === req.firebaseUser?.email && share.permission === 'edit'
        );

        if (!isOwner && !hasEditPermission) {
            res.status(403).json({
                success: false,
                error: { message: 'Not authorized to delete this session' }
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

// Update session (e.g., title, currentPollIndex)
export const updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, currentPollIndex, isActive } = req.body;

        const session = await Session.findById(id);

        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found' }
            });
            return;
        }

        // Verify ownership - user must be the owner or have edit permission
        const isOwner = session.userId && session.userId.toString() === req.userId?.toString();
        const hasEditPermission = session.sharedWith?.some(
            share => share.email === req.firebaseUser?.email && share.permission === 'edit'
        );

        if (!isOwner && !hasEditPermission) {
            res.status(403).json({
                success: false,
                error: { message: 'Not authorized to update this session' }
            });
            return;
        }

        // Update allowed fields
        if (title !== undefined) {
            session.title = title.trim();
        }
        if (currentPollIndex !== undefined) {
            session.currentPollIndex = currentPollIndex;
        }
        if (isActive !== undefined) {
            session.isActive = isActive;
        }
        session.updatedAt = new Date();

        await session.save();

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    sessionCode: session.sessionCode,
                    title: session.title,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt,
                    isActive: session.isActive,
                    currentPollIndex: session.currentPollIndex
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
