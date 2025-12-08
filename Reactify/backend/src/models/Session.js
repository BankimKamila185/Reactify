import mongoose from 'mongoose';


const SessionSchema = new Schema({
    sessionCode: {
        type: String,
        required: true,
        unique: true,
        length: 6
    },
    hostId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type,
        default.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currentPollIndex: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Session', SessionSchema);
