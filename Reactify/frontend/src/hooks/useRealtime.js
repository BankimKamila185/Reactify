import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useSessionStore } from '../stores/sessionStore';
import { useAIStore } from '../stores/aiStore';

export const useRealtime = (sessionId) => {
    const socket = useSocket();
    const { setCurrentPollIndex, setParticipantCount, updatePollResults } = useSessionStore();
    const { updateAIJob } = useAIStore();

    useEffect(() => {
        if (!socket || !sessionId) return;

        // Listen to session state updates
        socket.on('session-state', (data) => {
            console.log('Session state received:', data);
            if (data.session) {
                setCurrentPollIndex(data.session.currentPollIndex || 0);
            }
            if (data.participantCount !== undefined) {
                setParticipantCount(data.participantCount);
            }
        });

        // Listen to poll updates (real-time voting results)
        socket.on('poll-updated', (data) => {
            console.log('Poll updated:', data);
            updatePollResults(data.results);
        });

        // Listen to poll changes (navigation)
        socket.on('poll-changed', (data) => {
            console.log('Poll changed to index:', data.pollIndex);
            setCurrentPollIndex(data.pollIndex);
        });

        // Listen to participant joined
        socket.on('participant-joined', (data) => {
            console.log('Participant joined, count:', data.participantCount);
            setParticipantCount(data.participantCount);
        });

        // Listen to new feedback
        socket.on('feedback-new', (data) => {
            console.log('New feedback received:', data);
        });

        // Listen to AI progress updates
        socket.on('ai-progress-update', (data) => {
            console.log('AI progress update:', data);
            updateAIJob(data.jobId, {
                status: data.status,
                progress: data.progress,
                statusMessage: data.statusMessage,
                result: data.result,
                error: data.error
            });
        });

        // Listen to session ended
        socket.on('session-ended', (data) => {
            console.log('Session ended:', data.message);
            alert(data.message);
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off('session-state');
            socket.off('poll-updated');
            socket.off('poll-changed');
            socket.off('participant-joined');
            socket.off('feedback-new');
            socket.off('ai-progress-update');
            socket.off('session-ended');
        };
    }, [socket, sessionId, setCurrentPollIndex, setParticipantCount, updatePollResults, updateAIJob]);

    // Helper functions to emit events
    const joinSession = (participantId) => {
        if (socket && sessionId) {
            socket.emit('join-session', { sessionId, participantId });
        }
    };

    const submitAnswer = (pollId, participantId, answer) => {
        if (socket && sessionId) {
            socket.emit('submit-answer', { pollId, participantId, answer, sessionId });
        }
    };

    const submitFeedback = (pollId, participantId, content, isPublic) => {
        if (socket && sessionId) {
            socket.emit('submit-feedback', { pollId, sessionId, participantId, content, isPublic });
        }
    };

    const navigatePoll = (pollIndex) => {
        if (socket && sessionId) {
            socket.emit('navigate-poll', { sessionId, pollIndex });
        }
    };

    const endSession = () => {
        if (socket && sessionId) {
            socket.emit('end-session', { sessionId });
        }
    };

    return {
        joinSession,
        submitAnswer,
        submitFeedback,
        navigatePoll,
        endSession
    };
};
