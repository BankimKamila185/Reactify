import { Server, Socket } from 'socket.io';
import Participant from '../models/Participant.js';
import Response from '../models/Response.js';
import Feedback from '../models/Feedback.js';
import Poll from '../models/Poll.js';
import Session from '../models/Session.js';

export const setupSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        // Join session room
        socket.on('join-session', async (data: { sessionId; participantId? }) => {
            try {
                const { sessionId, participantId } = data;

                // Join the session room
                socket.join(`session-${sessionId}`);

                // Update participant socket ID if provided
                if (participantId) {
                    await Participant.findByIdAndUpdate(participantId, { socketId: socket.id });
                }

                // Get current session state
                const session = await Session.findById(sessionId);
                const polls = await Poll.find({ sessionId }).sort({ order: 1 });
                const participants = await Participant.find({ sessionId });

                // Send current state to the joining client
                socket.emit('session-state', {
                    session: {
                        id: session?._id,
                        title: session?.title,
                        currentPollIndex: session?.currentPollIndex,
                        isActive: session?.isActive
                    },
                    polls,
                    participantCount: participants.length
                });

                // Notify others in the room
                socket.to(`session-${sessionId}`).emit('participant-joined', {
                    participantCount: participants.length
                });

                console.log(`Participant joined session: ${sessionId}`);
            } catch (error) {
                console.error('Join session error:', error);
                socket.emit('error', { message: 'Failed to join session' });
            }
        });

        // Submit answer
        socket.on('submit-answer', async (data: {
            pollId;
            participantId;
            answer | string[];
            sessionId;
        }) => {
            try {
                const { pollId, participantId, answer, sessionId } = data;

                // Check if participant has already answered
                const existingResponse = await Response.findOne({ pollId, participantId });

                if (existingResponse) {
                    // Update existing response
                    existingResponse.answer = answer;
                    existingResponse.timestamp = new Date();
                    await existingResponse.save();
                } else {
                    // Create new response
                    await Response.create({
                        pollId,
                        participantId,
                        answer,
                        timestamp: new Date()
                    });
                }

                // Get poll with updated results
                const poll = await Poll.findById(pollId);
                const responses = await Response.find({ pollId });

                // Calculate updated results
                let results = { totalResponses: responses.length };

                if (poll?.type === 'single' || poll?.type === 'multiple') {
                    const voteCounts: { [key] } = {};

                    responses.forEach(response => {
                        const answers = Array.isArray(response.answer) ? response.answer : [response.answer];
                        answers.forEach(ans => {
                            voteCounts[ans] = (voteCounts[ans] || 0) + 1;
                        });
                    });

                    results.options = poll.options?.map(opt => ({
                        id: opt.id,
                        text: opt.text,
                        votes: voteCounts[opt.id] || 0
                    }));
                } else if (poll?.type === 'rating') {
                    const ratings = responses.map(r => Number(r.answer));
                    results.averageRating = ratings.length > 0
                        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
                        : 0;
                } else if (poll?.type === 'text') {
                    results.responses = responses.map(r => ({
                        text: r.answer,
                        timestamp: r.timestamp
                    }));
                }

                // Broadcast updated poll results to all in session
                io.to(`session-${sessionId}`).emit('poll-updated', {
                    pollId,
                    results
                });

                console.log(`Answer submitted for poll: ${pollId}`);
            } catch (error) {
                console.error('Submit answer error:', error);
                socket.emit('error', { message: 'Failed to submit answer' });
            }
        });

        // Submit feedback
        socket.on('submit-feedback', async (data: {
            pollId;
            sessionId;
            participantId;
            content;
            isPublic;
        }) => {
            try {
                const { pollId, sessionId, participantId, content, isPublic } = data;

                const feedback = await Feedback.create({
                    pollId,
                    sessionId,
                    participantId,
                    content,
                    isPublic
                });

                const populatedFeedback = await Feedback.findById(feedback._id)
                    .populate('participantId', 'name');

                // Broadcast new feedback to session
                io.to(`session-${sessionId}`).emit('feedback-new', {
                    feedback: populatedFeedback
                });

                console.log(`Feedback submitted for poll: ${pollId}`);
            } catch (error) {
                console.error('Submit feedback error:', error);
                socket.emit('error', { message: 'Failed to submit feedback' });
            }
        });

        // Navigate to poll (host)
        socket.on('navigate-poll', async (data: {
            sessionId;
            pollIndex;
        }) => {
            try {
                const { sessionId, pollIndex } = data;

                // Update session's current poll index
                await Session.findByIdAndUpdate(sessionId, { currentPollIndex: pollIndex });

                // Broadcast to all participants
                io.to(`session-${sessionId}`).emit('poll-changed', {
                    pollIndex
                });

                console.log(`Poll navigation: session ${sessionId}, index ${pollIndex}`);
            } catch (error) {
                console.error('Navigate poll error:', error);
                socket.emit('error', { message: 'Failed to navigate poll' });
            }
        });

        // End session (host)
        socket.on('end-session', async (data: { sessionId }) => {
            try {
                const { sessionId } = data;

                await Session.findByIdAndUpdate(sessionId, { isActive: false });

                // Notify all participants
                io.to(`session-${sessionId}`).emit('session-ended', {
                    message: 'Session has been ended by the host'
                });

                console.log(`Session ended: ${sessionId}`);
            } catch (error) {
                console.error('End session error:', error);
                socket.emit('error', { message: 'Failed to end session' });
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });
};
