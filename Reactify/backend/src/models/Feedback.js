import mongoose from 'mongoose';

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    pollId: {
        type: Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    participantId: {
        type: Schema.Types.ObjectId,
        ref: 'Participant',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
FeedbackSchema.index({ sessionId: 1, pollId: 1 });

export default mongoose.model('Feedback', FeedbackSchema);
