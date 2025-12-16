import Participant from '../models/Participant.js';
import Response from '../models/Response.js';
import Feedback from '../models/Feedback.js';
import Poll from '../models/Poll.js';
import Session from '../models/Session.js';

export const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        // Join session room
        socket.on('join-session', async (data) => {
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
        socket.on('submit-answer', async (data) => {
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
                    const voteCounts = {};

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
        socket.on('submit-feedback', async (data) => {
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
        socket.on('navigate-poll', async (data) => {
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
        socket.on('end-session', async (data) => {
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

        // Reset poll (host) - clears all votes
        socket.on('reset-poll', async (data) => {
            try {
                const { sessionId, pollId } = data;

                // Delete all responses for this poll
                await Response.deleteMany({ pollId });

                // Reset option votes to 0
                const poll = await Poll.findById(pollId);
                if (poll?.options) {
                    poll.options = poll.options.map(opt => ({
                        ...opt.toObject(),
                        votes: 0
                    }));
                    await poll.save();
                }

                // Broadcast reset to all clients
                io.to(`session-${sessionId}`).emit('poll-reset', {
                    pollId,
                    results: {
                        totalResponses: 0,
                        options: poll?.options?.map(opt => ({
                            id: opt.id,
                            text: opt.text,
                            votes: 0
                        }))
                    }
                });

                console.log(`Poll reset: ${pollId}`);
            } catch (error) {
                console.error('Reset poll error:', error);
                socket.emit('error', { message: 'Failed to reset poll' });
            }
        });

        // Lock/unlock poll (host)
        socket.on('lock-poll', async (data) => {
            try {
                const { sessionId, pollId, isLocked } = data;

                const poll = await Poll.findById(pollId);
                if (poll) {
                    poll.isLocked = isLocked !== undefined ? isLocked : !poll.isLocked;
                    await poll.save();

                    // Broadcast lock status to all clients
                    io.to(`session-${sessionId}`).emit('poll-locked', {
                        pollId,
                        isLocked: poll.isLocked
                    });

                    console.log(`Poll ${poll.isLocked ? 'locked' : 'unlocked'}: ${pollId}`);
                }
            } catch (error) {
                console.error('Lock poll error:', error);
                socket.emit('error', { message: 'Failed to lock/unlock poll' });
            }
        });

        // Reset all polls in session (host)
        socket.on('reset-session', async (data) => {
            try {
                const { sessionId } = data;

                // Get all polls for this session
                const polls = await Poll.find({ sessionId });

                // Delete all responses for all polls
                await Response.deleteMany({
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

                // Broadcast session reset to all clients
                io.to(`session-${sessionId}`).emit('session-reset', {
                    sessionId,
                    pollsReset: polls.length
                });

                console.log(`Session reset: ${sessionId}, ${polls.length} polls`);
            } catch (error) {
                console.error('Reset session error:', error);
                socket.emit('error', { message: 'Failed to reset session' });
            }
        });

        // Disconnect
        socket.on('disconnect', async () => {
            console.log(`❌ Client disconnected: ${socket.id}`);

            try {
                // Find participant by socket ID and get their session
                const participant = await Participant.findOne({ socketId: socket.id });
                if (participant && participant.sessionId) {
                    const sessionId = participant.sessionId;

                    // Get updated participant count
                    const remainingParticipants = await Participant.find({ sessionId });

                    // Broadcast updated count to the session
                    io.to(`session-${sessionId}`).emit('participant-left', {
                        participantCount: remainingParticipants.length
                    });
                }
            } catch (error) {
                console.error('Disconnect cleanup error:', error);
            }
        });
    });
};
