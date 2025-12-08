import { create } from 'zustand';

export const useSessionStore = create((set) => ({
    session: null,
    polls: [],
    participants: [],
    currentPollIndex: 0,
    participantCount: 0,
    token: localStorage.getItem('reactify_token'),
    currentPollResults: null,

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

    clearSession: () => {
        localStorage.removeItem('reactify_token');
        set({
            session: null,
            polls: [],
            participants: [],
            currentPollIndex: 0,
            participantCount: 0,
            token: null,
            currentPollResults: null
        });
    }
}));
