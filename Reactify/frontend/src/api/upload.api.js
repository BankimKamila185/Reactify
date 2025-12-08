import apiClient from './client';

export const uploadApi = {
    uploadContent: async (sessionId, file, youtubeUrl, onProgress) => {
        const formData = new FormData();
        formData.append('sessionId', sessionId);

        if (file) {
            formData.append('file', file);
        }

        if (youtubeUrl) {
            formData.append('youtubeUrl', youtubeUrl);
        }

        const response = await apiClient.post('/upload/content', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentage);
                }
            }
        });

        return response.data;
    },

    getAIJobStatus: async (jobId) => {
        const response = await apiClient.get(`/upload/job/${jobId}`);
        return response.data;
    }
};
