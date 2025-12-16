import { create } from 'zustand';

export const useSessionStore = create((set) => ({
    session: null,
    polls: [],
    participants: [],
    currentPollIndex: 0,
    participantCount: 0,
    token: localStorage.getItem('reactify_token'),
    currentPollResults: null,
    feedbackList: [],

    setSession: (session) => set({ session }),

    setToken: (token) => {
        localStorage.setItem('reactify_token', token);
        set({ token });
    },

    setPolls: (polls) => set({ polls }),

    addPoll: (poll) => set((state) => ({
        polls: [...state.polls, poll]
    })),

    setParticipants: (participants) => set({ participants }),

    setParticipantCount: (count) => set({ participantCount: count }),

    setCurrentPollIndex: (index) => set({ currentPollIndex: index }),

    updatePollResults: (results) => set({ currentPollResults: results }),

    // Feedback actions
    addFeedback: (feedback) => set((state) => ({
        feedbackList: [feedback, ...state.feedbackList].slice(0, 100) // Keep last 100
    })),

    setFeedbackList: (feedbackList) => set({ feedbackList }),

    clearFeedback: () => set({ feedbackList: [] }),

    clearSession: () => {
        localStorage.removeItem('reactify_token');
        set({
            session: null,
            polls: [],
            participants: [],
            currentPollIndex: 0,
            participantCount: 0,
            token: null,
            currentPollResults: null,
            feedbackList: []
        });
    }
}));
