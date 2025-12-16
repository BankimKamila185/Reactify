import mongoose from 'mongoose';
import { PollType } from '../types/index.js';

const { Schema } = mongoose;

const PollOptionSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
}, { _id: false });

// Word Cloud word entry
const WordEntrySchema = new Schema({
    text: { type: String, required: true },
    count: { type: Number, default: 1 }
}, { _id: false });

// Scale configuration
const ScaleConfigSchema = new Schema({
    min: { type: Number, default: 1 },
    max: { type: Number, default: 10 },
    minLabel: { type: String, default: '' },
    maxLabel: { type: String, default: '' },
    step: { type: Number, default: 1 }
}, { _id: false });

// Ranking item
const RankingItemSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    averageRank: { type: Number, default: 0 }
}, { _id: false });

// Q&A question
const QAQuestionSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    participantId: { type: String },
    upvotes: { type: Number, default: 0 },
    isAnswered: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Open ended response
const OpenEndedResponseSchema = new Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    participantId: { type: String },
    timestamp: { type: Date, default: Date.now }
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
    // For multiple choice polls
    options: [PollOptionSchema],

    // For word cloud polls
    words: [WordEntrySchema],
    maxWordsPerParticipant: { type: Number, default: 3 },

    // For scales polls
    scaleConfig: ScaleConfigSchema,
    scaleResponses: [{ type: Number }],

    // For ranking polls
    rankingItems: [RankingItemSchema],

    // For Q&A polls
    questions: [QAQuestionSchema],
    isModerated: { type: Boolean, default: false },
    allowAnonymous: { type: Boolean, default: true },

    // For open ended polls
    openEndedResponses: [OpenEndedResponseSchema],
    maxCharacters: { type: Number, default: 500 },

    // For content slides (text, image, video, instructions)
    textContent: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },

    aiGenerated: {
        type: Boolean,
        default: false
    },
    isLocked: {
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

