import apiClient from './client';

export const authApi = {
    signup: async (data) => {
        const response = await apiClient.post('/auth/signup', data);
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('reactify_token', response.data.data.token);
            localStorage.setItem('reactify_user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    login: async (data) => {
        const response = await apiClient.post('/auth/login', data);
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('reactify_token', response.data.data.token);
            localStorage.setItem('reactify_user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('reactify_token');
        localStorage.removeItem('reactify_user');
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('reactify_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('reactify_token');
    }
};
