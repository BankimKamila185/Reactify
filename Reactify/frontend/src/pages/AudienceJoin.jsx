import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sessionApi } from '../api/session.api';
import { useSessionStore } from '../stores/sessionStore';

export const AudienceJoin = () => {
    const navigate = useNavigate();
    const { setSession } = useSessionStore();
    const [sessionCode, setSessionCode] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');

        if (!sessionCode || !name) {
            setError('Please enter both session code and your name');
            return;
        }

        setLoading(true);

        try {
            const response = await sessionApi.joinSession(sessionCode, { name });

            // Store participant info
            localStorage.setItem('participantId', response.data.participant._id);
            localStorage.setItem('participantName', response.data.participant.name);

            // Set session
            setSession({
                _id: response.data.session._id,
                title: response.data.session.title,
                currentPollIndex: response.data.session.currentPollIndex,
                sessionCode,
                createdAt: new Date().toISOString(),
                isActive: true
            });

            // Navigate to voting view
            navigate(`/vote/${response.data.session._id}`);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to join session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Join Session
                    </h2>
                    <p className="text-gray-600 text-center mb-6">
                        Enter the session code to participate
                    </p>

                    <form onSubmit={handleJoin} className="space-y-4">
                        <Input
                            label="Session Code"
                            placeholder="e.g., 123456"
                            value={sessionCode}
                            onChange={(e) => setSessionCode(e.target.value.trim())}
                            fullWidth
                            maxLength={6}
                        />

                        <Input
                            label="Your Name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? 'Joining...' : 'Join Session'}
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};
