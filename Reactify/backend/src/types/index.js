// Type enums for the application

export const PollType = {
    SINGLE_CHOICE: 'single-choice',
    MULTIPLE_CHOICE: 'multiple-choice',
    WORD_CLOUD: 'word-cloud',
    OPEN_ENDED: 'open-ended',
    SCALES: 'scales',
    RANKING: 'ranking',
    QA: 'qa',
    RATING: 'rating',
    // Content slide types
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    INSTRUCTIONS: 'instructions'
};

export const AIJobStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

export const ContentType = {
    YOUTUBE: 'youtube',
    PDF: 'pdf',
    DOCX: 'docx',
    PPTX: 'pptx',
    TXT: 'txt'
};
