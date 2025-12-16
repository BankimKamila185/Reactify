import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// For production, use a service account JSON file
// For development, you can use environment variables

let firebaseAdmin;

if (!admin.apps.length) {
    // Check if using service account file or environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Using service account JSON (recommended for production)
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // Using individual environment variables
        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            })
        });
    }
} else {
    firebaseAdmin = admin.app();
}

export const verifyIdToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        throw error;
    }
};

export default firebaseAdmin;
