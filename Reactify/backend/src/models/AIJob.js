import mongoose from 'mongoose';
import { AIJobStatus, ContentType } from '../types/index.js';

const { Schema } = mongoose;

const AIJobSchema = new Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(AIJobStatus),
        default: AIJobStatus.PENDING
    },
    contentType: {
        type: String,
        enum: Object.values(ContentType),
        required: true
    },
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    result: {
        type: Schema.Types.Mixed
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    statusMessage: {
        type: String,
        default: 'Initializing...'
    },
    error: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
AIJobSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model('AIJob', AIJobSchema);
