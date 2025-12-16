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
    },

    // Get all polls for a session
    getSessionPolls: async (sessionId) => {
        const response = await apiClient.get(`/poll/session/${sessionId}`);
        return response.data;
    },

    // Update a poll
    updatePoll: async (pollId, data) => {
        const response = await apiClient.put(`/poll/${pollId}`, data);
        return response.data;
    },

    // Delete a poll
    deletePoll: async (pollId) => {
        const response = await apiClient.delete(`/poll/${pollId}`);
        return response.data;
    },

    // Reset poll votes
    resetPoll: async (pollId) => {
        const response = await apiClient.post(`/poll/${pollId}/reset`);
        return response.data;
    },

    // Lock/unlock poll
    lockPoll: async (pollId, isLocked) => {
        const response = await apiClient.post(`/poll/${pollId}/lock`, { isLocked });
        return response.data;
    },

    // Get user's presentations/polls
    getMyPresentations: async () => {
        const response = await apiClient.get('/poll/my-presentations');
        return response.data;
    },

    // Get presentations shared with the current user
    getSharedPresentations: async (userEmail) => {
        const response = await apiClient.get('/poll/shared-presentations', {
            params: { email: userEmail }
        });
        return response.data;
    },

    // ============================================
    // NEW POLL TYPE SUBMISSION METHODS
    // ============================================

    // Submit word cloud response
    submitWordCloudResponse: async (pollId, data) => {
        const response = await apiClient.post(`/poll/${pollId}/word-cloud`, data);
        return response.data;
    },

    // Submit open-ended response
    submitOpenEndedResponse: async (pollId, data) => {
        const response = await apiClient.post(`/poll/${pollId}/open-ended`, data);
        return response.data;
    },

    // Submit scales response
    submitScalesResponse: async (pollId, data) => {
        const response = await apiClient.post(`/poll/${pollId}/scales`, data);
        return response.data;
    },

    // Submit ranking response
    submitRankingResponse: async (pollId, data) => {
        const response = await apiClient.post(`/poll/${pollId}/ranking`, data);
        return response.data;
    },

    // Submit Q&A question
    submitQAQuestion: async (pollId, data) => {
        const response = await apiClient.post(`/poll/${pollId}/qa`, data);
        return response.data;
    },

    // Upvote a Q&A question
    upvoteQuestion: async (pollId, questionId) => {
        const response = await apiClient.post(`/poll/${pollId}/qa/${questionId}/upvote`);
        return response.data;
    },

    // Mark Q&A question as answered
    markQuestionAnswered: async (pollId, questionId) => {
        const response = await apiClient.put(`/poll/${pollId}/qa/${questionId}/answered`);
        return response.data;
    },

    // Generate slides with AI
    generateWithAI: async (data) => {
        const response = await apiClient.post('/ai/generate-slides', data);
        return response.data;
    }
};
