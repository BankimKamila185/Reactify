import mongoose from 'mongoose';

const { Schema } = mongoose;

const ParticipantSchema = new Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    socketId: {
        type: String
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for session queries
ParticipantSchema.index({ sessionId: 1 });

export default mongoose.model('Participant', ParticipantSchema);
