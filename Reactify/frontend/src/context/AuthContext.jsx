import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sync user with backend MongoDB
    const syncUserWithBackend = async (firebaseUser) => {
        try {
            const idToken = await firebaseUser.getIdToken();

            // Set auth header for API calls
            localStorage.setItem('reactify_token', idToken);

            // Sync user data with backend
            const response = await apiClient.post('/auth/sync', {
                email: firebaseUser.email,
                fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                firebaseUid: firebaseUser.uid,
                photoURL: firebaseUser.photoURL
            });

            if (response.data.success) {
                const userData = {
                    ...response.data.data.user,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                };
                localStorage.setItem('reactify_user', JSON.stringify(userData));
                return userData;
            }
        } catch (err) {
            console.error('Error syncing user with backend:', err);
            throw err;
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            try {
                if (firebaseUser) {
                    const userData = await syncUserWithBackend(firebaseUser);
                    setUser(userData);
                } else {
                    setUser(null);
                    localStorage.removeItem('reactify_token');
                    localStorage.removeItem('reactify_user');
                }
            } catch (err) {
                console.error('Auth state change error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Sign up with email and password
    const signup = async (email, password, fullName, additionalData = {}) => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            await updateProfile(userCredential.user, { displayName: fullName });

            // Sync with backend including additional data
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem('reactify_token', idToken);

            const response = await apiClient.post('/auth/sync', {
                email,
                fullName,
                firebaseUid: userCredential.user.uid,
                ...additionalData
            });

            if (response.data.success) {
                const userData = response.data.data.user;
                localStorage.setItem('reactify_user', JSON.stringify(userData));
                setUser(userData);
                return { success: true, data: { user: userData } };
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Sign in with email and password
    const login = async (email, password) => {
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = await syncUserWithBackend(userCredential.user);
            return { success: true, data: { user: userData } };
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Sign in with Google
    const loginWithGoogle = async () => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userData = await syncUserWithBackend(result.user);
            return { success: true, data: { user: userData } };
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Sign out
    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('reactify_token');
            localStorage.removeItem('reactify_user');
            setUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Get current user from localStorage (for initial load)
    const getCurrentUser = () => {
        const userStr = localStorage.getItem('reactify_user');
        return userStr ? JSON.parse(userStr) : null;
    };

    // Check if authenticated
    const isAuthenticated = () => {
        return !!user || !!localStorage.getItem('reactify_token');
    };

    // Refresh token
    const getIdToken = async () => {
        if (auth.currentUser) {
            return await auth.currentUser.getIdToken(true);
        }
        return localStorage.getItem('reactify_token');
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        loginWithGoogle,
        logout,
        getCurrentUser,
        isAuthenticated,
        getIdToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
