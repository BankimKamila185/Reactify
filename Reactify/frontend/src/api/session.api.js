import apiClient from './client';

export const sessionApi = {
    createSession: async (data) => {
        const response = await apiClient.post('/session', data);
        return response.data;
    },

    getSession: async (sessionId) => {
        const response = await apiClient.get(`/session/${sessionId}`);
        return response.data;
    },

    updateSession: async (sessionId, data) => {
        const response = await apiClient.put(`/session/${sessionId}`, data);
        return response.data;
    },

    deleteSession: async (sessionId) => {
        const response = await apiClient.delete(`/session/${sessionId}`);
        return response.data;
    },

    joinSession: async (sessionCode, data) => {
        const response = await apiClient.post(`/session/join/${sessionCode}`, data);
        return response.data;
    }
};
