import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('reactify_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
