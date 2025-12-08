import { create } from 'zustand';

export const useAIStore = create((set) => ({
    aiJobs: {},
    uploadProgress: 0,
    generatedPolls: [],

    addAIJob: (job) => set((state) => ({
        aiJobs: {
            ...state.aiJobs,
            [job._id]: job
        }
    })),

    updateAIJob: (jobId, updates) => set((state) => ({
        aiJobs: {
            ...state.aiJobs,
            [jobId]: {
                ...state.aiJobs[jobId],
                ...updates
            }
        }
    })),

    setUploadProgress: (progress) => set({ uploadProgress: progress }),

    setGeneratedPolls: (polls) => set({ generatedPolls: polls }),

    clearAIData: () => set({
        aiJobs: {},
        uploadProgress: 0,
        generatedPolls: []
    })
}));
