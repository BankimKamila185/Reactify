import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    photoURL: {
        type: String,
        trim: true
    },
    organization: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['educator', 'business', 'individual', 'other'],
        default: 'individual'
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('User', UserSchema);
