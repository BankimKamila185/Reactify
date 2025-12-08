import { Request, Response } from 'express';
import Poll from '../models/Poll.js';
import Response as ResponseModel from '../models/Response.js';
import Feedback from '../models/Feedback.js';
import Session from '../models/Session.js';
import { PollType } from '../types/index.js';
import { nanoid } from 'nanoid';

export const createPoll = async (req, res: Response) => {
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

export const getPollResults = async (req, res: Response) => {
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
            const voteCounts: { [key] } = {};

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

export const submitFeedback = async (req, res: Response) => {
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

export const getSessionFeedback = async (req, res: Response) => {
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
