import { useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useSessionStore } from '../stores/sessionStore';
import { useAIStore } from '../stores/aiStore';

export const useRealtime = (sessionId) => {
    const socket = useSocket();
    const { setCurrentPollIndex, setParticipantCount, updatePollResults, addFeedback, setPolls } = useSessionStore();
    const { updateAIJob } = useAIStore();

    useEffect(() => {
        if (!socket || !sessionId) return;

        // Listen to session state updates
        socket.on('session-state', (data) => {
            if (data.session) {
                setCurrentPollIndex(data.session.currentPollIndex || 0);
            }
            // Sync polls from session-state to keep audience in sync with host
            if (data.polls && Array.isArray(data.polls)) {
                setPolls(data.polls);
            }
            if (data.participantCount !== undefined) {
                setParticipantCount(data.participantCount);
            }
        });

        // Listen to poll updates (real-time voting results)
        socket.on('poll-updated', (data) => {
            updatePollResults(data.results);
        });

        // Listen to poll changes (navigation)
        socket.on('poll-changed', (data) => {
            setCurrentPollIndex(data.pollIndex);
            // Clear stale results when navigating to a new poll
            updatePollResults(null);
        });

        // Listen to participant joined
        socket.on('participant-joined', (data) => {
            setParticipantCount(data.participantCount);
        });

        // Listen to participant left
        socket.on('participant-left', (data) => {
            if (data.participantCount !== undefined) {
                setParticipantCount(data.participantCount);
            }
        });

        // Listen to new feedback
        socket.on('feedback-new', (data) => {
            if (data.feedback) {
                addFeedback(data.feedback);
            }
        });

        // Listen to AI progress updates
        socket.on('ai-progress-update', (data) => {
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
            alert(data.message);
        });

        // Listen to poll reset
        socket.on('poll-reset', (data) => {
            updatePollResults(data.results);
        });

        // Listen to poll lock/unlock
        socket.on('poll-locked', (data) => {
            // Poll lock state is handled by re-fetching session state
        });

        // Listen to session reset
        socket.on('session-reset', (data) => {
            // Reset results to empty
            updatePollResults({ totalResponses: 0, options: [] });
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off('session-state');
            socket.off('poll-updated');
            socket.off('poll-changed');
            socket.off('participant-joined');
            socket.off('participant-left');
            socket.off('feedback-new');
            socket.off('ai-progress-update');
            socket.off('session-ended');
            socket.off('poll-reset');
            socket.off('poll-locked');
            socket.off('session-reset');
        };
    }, [socket, sessionId, setCurrentPollIndex, setParticipantCount, updatePollResults, addFeedback, setPolls, updateAIJob]);

    // Helper functions to emit events
    const joinSession = useCallback((participantId) => {
        console.log('[useRealtime] joinSession called', {
            hasSocket: !!socket,
            sessionId,
            participantId
        });

        if (socket && sessionId) {
            socket.emit('join-session', { sessionId, participantId });
        } else {
            console.warn('[useRealtime] Cannot join session: socket or sessionId missing');
        }
    }, [socket, sessionId]);

    const submitAnswer = useCallback((pollId, participantId, answer) => {
        if (socket && sessionId) {
            socket.emit('submit-answer', { pollId, participantId, answer, sessionId });
        }
    }, [socket, sessionId]);

    const submitFeedback = useCallback((pollId, participantId, content, isPublic) => {
        if (socket && sessionId) {
            socket.emit('submit-feedback', { pollId, sessionId, participantId, content, isPublic });
        }
    }, [socket, sessionId]);

    const navigatePoll = useCallback((pollIndex) => {
        if (socket && sessionId) {
            socket.emit('navigate-poll', { sessionId, pollIndex });
        }
    }, [socket, sessionId]);

    const endSession = useCallback(() => {
        if (socket && sessionId) {
            socket.emit('end-session', { sessionId });
        }
    }, [socket, sessionId]);

    const resetPoll = useCallback((pollId) => {
        if (socket && sessionId) {
            socket.emit('reset-poll', { sessionId, pollId });
        }
    }, [socket, sessionId]);

    const lockPoll = useCallback((pollId, isLocked) => {
        if (socket && sessionId) {
            socket.emit('lock-poll', { sessionId, pollId, isLocked });
        }
    }, [socket, sessionId]);

    const resetSession = useCallback(() => {
        if (socket && sessionId) {
            socket.emit('reset-session', { sessionId });
        }
    }, [socket, sessionId]);

    return {
        joinSession,
        submitAnswer,
        submitFeedback,
        navigatePoll,
        endSession,
        resetPoll,
        lockPoll,
        resetSession
    };
};
