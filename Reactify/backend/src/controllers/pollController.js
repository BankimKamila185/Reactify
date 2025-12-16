import Poll from '../models/Poll.js';
import ResponseModel from '../models/Response.js';
import Feedback from '../models/Feedback.js';
import Session from '../models/Session.js';
import { PollType } from '../types/index.js';
import { nanoid } from 'nanoid';

export const createPoll = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { type, question, options } = req.body;

        // Validation
        if (!question || !type) {
            res.status(400).json({
                success: false,
                error: { message: 'Question and type are required' }
            });
            return;
        }

        if (!Object.values(PollType).includes(type)) {
            res.status(400).json({
                success: false,
                error: { message: 'Invalid poll type' }
            });
            return;
        }

        // Verify session exists
        const session = await Session.findById(sessionId);
        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found' }
            });
            return;
        }

        // Get next order number
        const pollCount = await Poll.countDocuments({ sessionId });

        // Format options with IDs
        const formattedOptions = options?.map((opt) => ({
            id: nanoid(8),
            text: opt.text || opt,
            votes: 0
        }));

        const poll = await Poll.create({
            sessionId,
            type,
            question: question.trim(),
            options: formattedOptions,
            aiGenerated: false,
            order: pollCount
        });

        res.status(201).json({
            success: true,
            data: { poll }
        });
    } catch (error) {
        console.error('Create poll error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to create poll' }
        });
    }
};

export const getPollResults = async (req, res) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        const responses = await ResponseModel.find({ pollId });

        // Aggregate results based on poll type
        let results = { totalResponses: responses.length };

        if (poll.type === PollType.SINGLE_CHOICE || poll.type === PollType.MULTIPLE_CHOICE) {
            // Count votes for each option
            const voteCounts = {};

            responses.forEach(response => {
                const answers = Array.isArray(response.answer) ? response.answer : [response.answer];
                answers.forEach(answer => {
                    voteCounts[answer] = (voteCounts[answer] || 0) + 1;
                });
            });

            results.options = poll.options?.map(opt => ({
                id: opt.id,
                text: opt.text,
                votes: voteCounts[opt.id] || 0
            }));
        } else if (poll.type === PollType.RATING) {
            // Calculate average rating
            const ratings = responses.map(r => Number(r.answer));
            const average = ratings.length > 0
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : 0;
            results.averageRating = average.toFixed(2);
            results.ratings = ratings;
        } else if (poll.type === PollType.OPEN_TEXT) {
            // Return all text responses
            results.responses = responses.map(r => ({
                text: r.answer,
                timestamp: r.timestamp
            }));
        }

        res.json({
            success: true,
            data: {
                poll: {
                    id: poll._id,
                    question: poll.question,
                    type: poll.type
                },
                results
            }
        });
    } catch (error) {
        console.error('Get poll results error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to retrieve poll results' }
        });
    }
};

export const submitFeedback = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { participantId, content, isPublic } = req.body;

        if (!content || !participantId) {
            res.status(400).json({
                success: false,
                error: { message: 'Content and participant ID are required' }
            });
            return;
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        const feedback = await Feedback.create({
            pollId,
            sessionId: poll.sessionId,
            participantId,
            content: content.trim(),
            isPublic: isPublic || false
        });

        res.status(201).json({
            success: true,
            data: { feedback }
        });
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to submit feedback' }
        });
    }
};

export const getSessionFeedback = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { publicOnly } = req.query;

        const filter = { sessionId };
        if (publicOnly === 'true') {
            filter.isPublic = true;
        }

        const feedbackList = await Feedback.find(filter)
            .populate('participantId', 'name')
            .populate('pollId', 'question')
            .sort({ timestamp: -1 });

        res.json({
            success: true,
            data: { feedback: feedbackList }
        });
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to retrieve feedback' }
        });
    }
};

// Reset poll - clears all votes/responses
export const resetPoll = async (req, res) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        // Delete all responses for this poll
        await ResponseModel.deleteMany({ pollId });

        // Reset option votes to 0
        if (poll.options) {
            poll.options = poll.options.map(opt => ({
                ...opt.toObject(),
                votes: 0
            }));
            await poll.save();
        }

        res.json({
            success: true,
            data: {
                message: 'Poll reset successfully',
                pollId
            }
        });
    } catch (error) {
        console.error('Reset poll error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to reset poll' }
        });
    }
};

// Lock/unlock poll - prevents new votes
export const lockPoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { isLocked } = req.body;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        poll.isLocked = isLocked !== undefined ? isLocked : !poll.isLocked;
        await poll.save();

        res.json({
            success: true,
            data: {
                pollId,
                isLocked: poll.isLocked,
                message: poll.isLocked ? 'Poll locked' : 'Poll unlocked'
            }
        });
    } catch (error) {
        console.error('Lock poll error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to lock/unlock poll' }
        });
    }
};

// Reset all polls in a session
export const resetSessionPolls = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId);
        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found' }
            });
            return;
        }

        // Get all polls for this session
        const polls = await Poll.find({ sessionId });

        // Delete all responses for all polls
        await ResponseModel.deleteMany({
            pollId: { $in: polls.map(p => p._id) }
        });

        // Reset all option votes to 0
        for (const poll of polls) {
            if (poll.options) {
                poll.options = poll.options.map(opt => ({
                    ...opt.toObject(),
                    votes: 0
                }));
                await poll.save();
            }
        }

        res.json({
            success: true,
            data: {
                message: 'All polls reset successfully',
                sessionId,
                pollsReset: polls.length
            }
        });
    } catch (error) {
        console.error('Reset session polls error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to reset session polls' }
        });
    }
};

// Get all polls for a session
export const getSessionPolls = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await Session.findById(sessionId);
        if (!session) {
            res.status(404).json({
                success: false,
                error: { message: 'Session not found' }
            });
            return;
        }

        const polls = await Poll.find({ sessionId }).sort({ order: 1 });

        res.json({
            success: true,
            data: { polls }
        });
    } catch (error) {
        console.error('Get session polls error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to retrieve polls' }
        });
    }
};

// Update an existing poll
export const updatePoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { question, options, type, settings } = req.body;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        // Update fields if provided
        if (question) poll.question = question.trim();
        if (type) poll.type = type;
        if (settings) poll.settings = { ...poll.settings, ...settings };
        if (options) {
            poll.options = options.map((opt, index) => ({
                id: opt.id || nanoid(8),
                text: opt.text || '',
                votes: opt.votes || 0,
                color: opt.color || '#6366F1'
            }));
        }

        await poll.save();

        res.json({
            success: true,
            data: { poll }
        });
    } catch (error) {
        console.error('Update poll error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update poll' }
        });
    }
};

// Delete a poll
export const deletePoll = async (req, res) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        // Delete all responses for this poll
        await ResponseModel.deleteMany({ pollId });

        // Delete all feedback for this poll
        await Feedback.deleteMany({ pollId });

        // Delete the poll
        await Poll.deleteOne({ _id: pollId });

        res.json({
            success: true,
            data: {
                message: 'Poll deleted successfully',
                pollId
            }
        });
    } catch (error) {
        console.error('Delete poll error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to delete poll' }
        });
    }
};

// Get user's presentations (sessions with polls)
export const getMyPresentations = async (req, res) => {
    try {
        // Get hostId from query parameter or use a default for now
        // In production, this would come from authenticated user
        const hostId = req.query.hostId;

        // Build query - if hostId provided, filter by it
        const query = hostId ? { hostId } : {};

        // Get recent sessions with their polls
        const sessions = await Session.find(query)
            .sort({ updatedAt: -1, createdAt: -1 })
            .limit(50);

        const presentations = await Promise.all(
            sessions.map(async (session) => {
                const polls = await Poll.find({ sessionId: session._id })
                    .sort({ order: 1 })
                    .limit(1);

                const firstPoll = polls[0];

                return {
                    id: session._id,
                    sessionId: session._id,
                    title: session.title,
                    question: firstPoll?.question || session.title,
                    sessionCode: session.sessionCode,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt || session.createdAt,
                    isActive: session.isActive,
                    pollCount: await Poll.countDocuments({ sessionId: session._id }),
                    slideType: firstPoll?.type || 'multiple-choice'
                };
            })
        );

        res.json({
            success: true,
            data: { presentations }
        });
    } catch (error) {
        console.error('Get presentations error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to retrieve presentations' }
        });
    }
};

// Get presentations shared with the current user
export const getSharedPresentations = async (req, res) => {
    try {
        // Get user email from query parameter
        // In production, this would come from authenticated user
        const userEmail = req.query.email;

        if (!userEmail) {
            return res.json({
                success: true,
                data: { presentations: [] }
            });
        }

        // Find sessions where the user is in the sharedWith array
        const sessions = await Session.find({
            'sharedWith.email': userEmail.toLowerCase()
        })
            .sort({ 'sharedWith.sharedAt': -1, createdAt: -1 })
            .limit(50);

        const presentations = await Promise.all(
            sessions.map(async (session) => {
                const polls = await Poll.find({ sessionId: session._id })
                    .sort({ order: 1 })
                    .limit(1);

                const firstPoll = polls[0];

                // Get the sharing info for this user
                const shareInfo = session.sharedWith.find(
                    s => s.email.toLowerCase() === userEmail.toLowerCase()
                );

                return {
                    id: session._id,
                    sessionId: session._id,
                    title: session.title,
                    question: firstPoll?.question || session.title,
                    sessionCode: session.sessionCode,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt || session.createdAt,
                    isActive: session.isActive,
                    pollCount: await Poll.countDocuments({ sessionId: session._id }),
                    slideType: firstPoll?.type || 'multiple-choice',
                    // Sharing metadata
                    sharedBy: session.hostId,
                    sharedByName: shareInfo?.name || 'Unknown',
                    sharedAt: shareInfo?.sharedAt,
                    permission: shareInfo?.permission || 'view'
                };
            })
        );

        res.json({
            success: true,
            data: { presentations }
        });
    } catch (error) {
        console.error('Get shared presentations error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to retrieve shared presentations' }
        });
    }
};

// ============================================
// NEW POLL TYPE HANDLERS
// ============================================

// Submit word cloud response
export const submitWordCloudResponse = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { words, participantId } = req.body;

        if (!words || !Array.isArray(words) || words.length === 0) {
            res.status(400).json({
                success: false,
                error: { message: 'Words array is required' }
            });
            return;
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        if (poll.type !== PollType.WORD_CLOUD) {
            res.status(400).json({
                success: false,
                error: { message: 'This is not a word cloud poll' }
            });
            return;
        }

        if (poll.isLocked) {
            res.status(403).json({
                success: false,
                error: { message: 'Poll is locked' }
            });
            return;
        }

        // Process each submitted word
        const wordsToProcess = words.slice(0, poll.maxWordsPerParticipant || 3);

        for (const word of wordsToProcess) {
            const normalizedWord = word.trim().toLowerCase();
            if (!normalizedWord) continue;

            const existingWord = poll.words.find(w => w.text.toLowerCase() === normalizedWord);
            if (existingWord) {
                existingWord.count += 1;
            } else {
                poll.words.push({ text: normalizedWord, count: 1 });
            }
        }

        await poll.save();

        res.json({
            success: true,
            data: {
                message: 'Words submitted successfully',
                words: poll.words
            }
        });
    } catch (error) {
        console.error('Submit word cloud error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to submit words' }
        });
    }
};

// Submit open-ended response
export const submitOpenEndedResponse = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { text, participantId } = req.body;

        if (!text || !text.trim()) {
            res.status(400).json({
                success: false,
                error: { message: 'Response text is required' }
            });
            return;
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        if (poll.type !== PollType.OPEN_ENDED) {
            res.status(400).json({
                success: false,
                error: { message: 'This is not an open-ended poll' }
            });
            return;
        }

        if (poll.isLocked) {
            res.status(403).json({
                success: false,
                error: { message: 'Poll is locked' }
            });
            return;
        }

        const trimmedText = text.trim().slice(0, poll.maxCharacters || 500);

        poll.openEndedResponses.push({
            id: nanoid(8),
            text: trimmedText,
            participantId,
            timestamp: new Date()
        });

        await poll.save();

        res.json({
            success: true,
            data: {
                message: 'Response submitted successfully',
                responseCount: poll.openEndedResponses.length
            }
        });
    } catch (error) {
        console.error('Submit open-ended error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to submit response' }
        });
    }
};

// Submit scales response
export const submitScalesResponse = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { value, participantId } = req.body;

        if (value === undefined || value === null) {
            res.status(400).json({
                success: false,
                error: { message: 'Scale value is required' }
            });
            return;
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        if (poll.type !== PollType.SCALES) {
            res.status(400).json({
                success: false,
                error: { message: 'This is not a scales poll' }
            });
            return;
        }

        if (poll.isLocked) {
            res.status(403).json({
                success: false,
                error: { message: 'Poll is locked' }
            });
            return;
        }

        const config = poll.scaleConfig || { min: 1, max: 10 };
        const numValue = Number(value);

        if (numValue < config.min || numValue > config.max) {
            res.status(400).json({
                success: false,
                error: { message: `Value must be between ${config.min} and ${config.max}` }
            });
            return;
        }

        poll.scaleResponses.push(numValue);
        await poll.save();

        // Calculate average
        const average = poll.scaleResponses.reduce((a, b) => a + b, 0) / poll.scaleResponses.length;

        res.json({
            success: true,
            data: {
                message: 'Scale response submitted',
                average: average.toFixed(2),
                totalResponses: poll.scaleResponses.length
            }
        });
    } catch (error) {
        console.error('Submit scales error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to submit scale response' }
        });
    }
};

// Submit ranking response
export const submitRankingResponse = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { rankings, participantId } = req.body;

        if (!rankings || !Array.isArray(rankings)) {
            res.status(400).json({
                success: false,
                error: { message: 'Rankings array is required' }
            });
            return;
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        if (poll.type !== PollType.RANKING) {
            res.status(400).json({
                success: false,
                error: { message: 'This is not a ranking poll' }
            });
            return;
        }

        if (poll.isLocked) {
            res.status(403).json({
                success: false,
                error: { message: 'Poll is locked' }
            });
            return;
        }

        // Update average ranks for each item
        // rankings is an array of item IDs in ranked order (first = rank 1)
        for (let i = 0; i < rankings.length; i++) {
            const itemId = rankings[i];
            const item = poll.rankingItems.find(r => r.id === itemId);
            if (item) {
                // Calculate running average
                const currentTotal = item.averageRank * (poll.rankingItems.length > 0 ? 1 : 0);
                item.averageRank = currentTotal === 0 ? (i + 1) : (item.averageRank + (i + 1)) / 2;
            }
        }

        await poll.save();

        res.json({
            success: true,
            data: {
                message: 'Ranking submitted successfully',
                rankingItems: poll.rankingItems
            }
        });
    } catch (error) {
        console.error('Submit ranking error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to submit ranking' }
        });
    }
};

// Submit Q&A question
export const submitQAQuestion = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { question, participantId } = req.body;

        if (!question || !question.trim()) {
            res.status(400).json({
                success: false,
                error: { message: 'Question text is required' }
            });
            return;
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        if (poll.type !== PollType.QA) {
            res.status(400).json({
                success: false,
                error: { message: 'This is not a Q&A poll' }
            });
            return;
        }

        if (poll.isLocked) {
            res.status(403).json({
                success: false,
                error: { message: 'Poll is locked' }
            });
            return;
        }

        poll.questions.push({
            id: nanoid(8),
            text: question.trim(),
            participantId: poll.allowAnonymous ? null : participantId,
            upvotes: 0,
            isAnswered: false,
            timestamp: new Date()
        });

        await poll.save();

        res.json({
            success: true,
            data: {
                message: 'Question submitted successfully',
                questionCount: poll.questions.length
            }
        });
    } catch (error) {
        console.error('Submit Q&A question error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to submit question' }
        });
    }
};

// Upvote a Q&A question
export const upvoteQuestion = async (req, res) => {
    try {
        const { pollId, questionId } = req.params;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        const question = poll.questions.find(q => q.id === questionId);
        if (!question) {
            res.status(404).json({
                success: false,
                error: { message: 'Question not found' }
            });
            return;
        }

        question.upvotes += 1;
        await poll.save();

        res.json({
            success: true,
            data: {
                questionId,
                upvotes: question.upvotes
            }
        });
    } catch (error) {
        console.error('Upvote question error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to upvote question' }
        });
    }
};

// Mark Q&A question as answered
export const markQuestionAnswered = async (req, res) => {
    try {
        const { pollId, questionId } = req.params;
        const { isAnswered } = req.body;

        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(404).json({
                success: false,
                error: { message: 'Poll not found' }
            });
            return;
        }

        const question = poll.questions.find(q => q.id === questionId);
        if (!question) {
            res.status(404).json({
                success: false,
                error: { message: 'Question not found' }
            });
            return;
        }

        question.isAnswered = isAnswered !== undefined ? isAnswered : true;
        await poll.save();

        res.json({
            success: true,
            data: {
                questionId,
                isAnswered: question.isAnswered
            }
        });
    } catch (error) {
        console.error('Mark question answered error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update question' }
        });
    }
};
