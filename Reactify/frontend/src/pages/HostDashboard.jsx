import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { sessionApi } from '../api/session.api';
import { useSessionStore } from '../stores/sessionStore';

export const HostDashboard = () => {
    const navigate = useNavigate();
    const { setSession, setToken } = useSessionStore();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Please enter a session title');
            return;
        }

        setLoading(true);

        try {
            const response = await sessionApi.createSession({ title: title.trim() });

            // Store session and token
            setSession(response.data.session);
            setToken(response.data.token);

            // Navigate to presenter view
            navigate(`/present/${response.data.session._id}`);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-4xl font-bold text-center mb-2">
                        <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            Create New Session
                        </span>
                    </h1>
                    <p className="text-gray-600 text-center mb-8">
                        Set up your polling session and start engaging with your audience
                    </p>

                    <Card className="p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <Plus className="w-6 h-6 mr-2 text-primary-600" />
                            Session Details
                        </h2>

                        <form onSubmit={handleCreateSession} className="space-y-4">
                            <Input
                                label="Session Title"
                                placeholder="e.g., Weekly Team Standup, Product Launch Q&A"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                {loading ? 'Creating...' : 'Create Session'}
                            </Button>
                        </form>
                    </Card>

                    <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200">
                        <h3 className="font-semibold text-gray-900 mb-2">💡 Pro Tip</h3>
                        <p className="text-gray-700">
                            After creating your session, you can add polls manually or upload content (YouTube, PDF, DOCX)
                            to generate polls automatically using AI.
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};
