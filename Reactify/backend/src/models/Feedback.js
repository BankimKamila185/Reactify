import mongoose from 'mongoose';


const FeedbackSchema = new Schema({
    pollId: {
        type.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    sessionId: {
        type.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    participantId: {
        type.Types.ObjectId,
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
        type,
        default.now
    }
});

// Index for efficient queries
FeedbackSchema.index({ sessionId: 1, pollId: 1 });

export default mongoose.model('Feedback', FeedbackSchema);
