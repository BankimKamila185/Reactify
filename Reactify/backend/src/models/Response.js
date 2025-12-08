import mongoose from 'mongoose';


const ResponseSchema = new Schema({
    pollId: {
        type.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    participantId: {
        type.Types.ObjectId,
        ref: 'Participant',
        required: true
    },
    answer: {
        type.Types.Mixed,
        required: true
    },
    timestamp: {
        type,
        default.now
    }
});

// Index for fast lookups
ResponseSchema.index({ pollId: 1, participantId: 1 });

export default mongoose.model('Response', ResponseSchema);
