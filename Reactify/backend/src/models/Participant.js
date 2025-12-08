import mongoose from 'mongoose';


const ParticipantSchema = new Schema({
    sessionId: {
        type.Types.ObjectId,
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
        type,
        default.now
    }
});

// Index for session queries
ParticipantSchema.index({ sessionId: 1 });

export default mongoose.model('Participant', ParticipantSchema);
