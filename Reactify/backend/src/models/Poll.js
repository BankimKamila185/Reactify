import mongoose from 'mongoose';
import { PollType } from '../types/index.js';

const { Schema } = mongoose;

const PollOptionSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
}, { _id: false });

const PollSchema = new Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(PollType),
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [PollOptionSchema],
    aiGenerated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Poll', PollSchema);
