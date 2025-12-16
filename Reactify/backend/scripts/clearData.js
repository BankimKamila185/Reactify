// Script to clear all polls and related data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reactify';

async function clearData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the database instance
        const db = mongoose.connection.db;

        // Delete all polls
        const pollsResult = await db.collection('polls').deleteMany({});
        console.log(`✓ Deleted ${pollsResult.deletedCount} polls`);

        // Delete all responses (poll responses)
        const responsesResult = await db.collection('responses').deleteMany({});
        console.log(`✓ Deleted ${responsesResult.deletedCount} responses`);

        // Delete all sessions
        const sessionsResult = await db.collection('sessions').deleteMany({});
        console.log(`✓ Deleted ${sessionsResult.deletedCount} sessions`);

        // Delete all participants
        const participantsResult = await db.collection('participants').deleteMany({});
        console.log(`✓ Deleted ${participantsResult.deletedCount} participants`);

        // Delete all feedback
        const feedbackResult = await db.collection('feedbacks').deleteMany({});
        console.log(`✓ Deleted ${feedbackResult.deletedCount} feedback entries`);

        // Delete all AI jobs
        const aiJobsResult = await db.collection('aijobs').deleteMany({});
        console.log(`✓ Deleted ${aiJobsResult.deletedCount} AI jobs`);

        console.log('\n✅ All data cleared successfully! You now have a fresh database.');

    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

clearData();
