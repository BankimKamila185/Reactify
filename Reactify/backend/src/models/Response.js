import mongoose from 'mongoose';

const { Schema } = mongoose;

const ResponseSchema = new Schema({
    pollId: {
        type: Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    participantId: {
        type: Schema.Types.ObjectId,
        ref: 'Participant',
        required: true
    },
    answer: {
        type: Schema.Types.Mixed,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for fast lookups
ResponseSchema.index({ pollId: 1, participantId: 1 });

export default mongoose.model('Response', ResponseSchema);
