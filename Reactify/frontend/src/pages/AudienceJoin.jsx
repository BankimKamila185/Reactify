import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/session.api';
import { useSessionStore } from '../stores/sessionStore';
import './AudienceJoin.css';

export const AudienceJoin = () => {
    const navigate = useNavigate();
    const { setSession } = useSessionStore();
    const [sessionCode, setSessionCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Format the code with space (e.g., "123 456" for 6-digit or "1234 5678" for 8-digit)
    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        if (value.length <= 8) {
            // For 6-digit codes (backend format): "XXX XXX"
            // For 8-digit codes: "XXXX XXXX"
            if (value.length <= 6) {
                if (value.length > 3) {
                    setSessionCode(value.slice(0, 3) + ' ' + value.slice(3));
                } else {
                    setSessionCode(value);
                }
            } else {
                // 7-8 digit: format as XXXX XXXX for legacy support
                setSessionCode(value.slice(0, 4) + ' ' + value.slice(4));
            }
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');

        const cleanCode = sessionCode.replace(/\s/g, '');

        if (!cleanCode) {
            setError('Please enter a code');
            return;
        }

        setLoading(true);

        try {
            // Join session directly with 'Anonymous' name
            const response = await sessionApi.joinSession(cleanCode, { name: 'Anonymous' });

            // Store participant info
            localStorage.setItem('participantId', response.data.participant.id);
            localStorage.setItem('participantName', 'Anonymous');

            // Set session
            setSession({
                _id: response.data.session.id,
                title: response.data.session.title,
                currentPollIndex: response.data.session.currentPollIndex,
                sessionCode: cleanCode,
                createdAt: new Date().toISOString(),
                isActive: true
            });

            // Navigate to voting view
            navigate(`/vote/${response.data.session.id}`);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to join session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-page">
            <div className="join-container">
                {/* Logo */}
                <div className="join-logo">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="2" y="8" width="8" height="16" rx="2" fill="#3B82F6" />
                        <rect x="12" y="4" width="8" height="24" rx="2" fill="#1E3A5F" />
                        <rect x="22" y="12" width="8" height="12" rx="2" fill="#EF4444" />
                    </svg>
                    <span className="logo-text">Reactify</span>
                </div>

                {/* Main Content */}
                <div className="join-content">
                    <h1 className="join-title">
                        Enter the code to join
                    </h1>
                    <p className="join-subtitle">
                        It's on the screen in front of you
                    </p>

                    <form onSubmit={handleJoin} className="join-form">
                        <input
                            type="text"
                            className="code-input"
                            placeholder="123 456"
                            value={sessionCode}
                            onChange={handleCodeChange}
                            autoFocus
                            autoComplete="off"
                        />

                        {error && (
                            <div className="join-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="join-button"
                            disabled={loading || !sessionCode}
                        >
                            {loading ? 'Joining...' : 'Join'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="join-footer">
                    <p className="footer-cta">
                        Create your own polls at <a href="/" className="footer-link">reactify.com</a>
                    </p>
                    <p className="footer-legal">
                        By using Reactify you accept our <a href="#">terms of use</a> and <a href="#">policies</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};
