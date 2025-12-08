import apiClient from './client';

export const pollApi = {
    createPoll: async (sessionId, data) => {
        const response = await apiClient.post(`/poll/session/${sessionId}`, data);
        return response.data;
    },

    getPollResults: async (pollId) => {
        const response = await apiClient.get(`/poll/${pollId}/results`);
        return response.data;
    },

    submitFeedback: async (pollId, data) => {
        const response = await apiClient.post(`/poll/${pollId}/feedback`, data);
        return response.data;
    },

    getSessionFeedback: async (sessionId, publicOnly = false) => {
        const response = await apiClient.get(`/poll/session/${sessionId}/feedback`, {
            params: { publicOnly: publicOnly.toString() }
        });
        return response.data;
    }
};
