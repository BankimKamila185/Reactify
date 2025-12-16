import mongoose from 'mongoose';

const { Schema } = mongoose;

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
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currentPollIndex: {
        type: Number,
        default: 0
    },
    // Sharing functionality
    sharedWith: [{
        email: {
            type: String,
            required: true
        },
        name: String,
        permission: {
            type: String,
            enum: ['view', 'edit'],
            default: 'view'
        },
        sharedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

export default mongoose.model('Session', SessionSchema);
