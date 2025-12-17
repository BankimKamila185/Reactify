import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add fresh Firebase token
apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Get fresh token if Firebase user is logged in
            if (auth.currentUser) {
                const token = await auth.currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
                // Also update localStorage for consistency
                localStorage.setItem('reactify_token', token);
            } else {
                // Fallback to localStorage token (may be expired)
                const token = localStorage.getItem('reactify_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error('Failed to get auth token:', error);
            // Try using stored token as fallback
            const token = localStorage.getItem('reactify_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error?.message || 'An error occurred';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

export default apiClient;

