import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtime } from '../hooks/useRealtime';
import { useSessionStore } from '../stores/sessionStore';
import { sessionApi } from '../api/session.api';
import './LiveResultsDisplay.css';

export const LiveResultsDisplay = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const {
        session,
        polls,
        currentPollIndex,
        participantCount,
        currentPollResults,
        feedbackList,
        setSession,
        setPolls,
        setCurrentPollIndex
    } = useSessionStore();
    const { joinSession, navigatePoll, resetPoll, lockPoll, resetSession, endSession } = useRealtime(sessionId);

    const [loading, setLoading] = useState(true);
    const [sessionCode, setSessionCode] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Mentimeter-style controls
    const [showControls, setShowControls] = useState(false); // Hover reveal
    const [showPercent, setShowPercent] = useState(false); // Show % vs count
    const [hideResults, setHideResults] = useState(false); // Hide vote bars
    const [showJoinOverlay, setShowJoinOverlay] = useState(false); // QR code overlay
    const [showCountdownModal, setShowCountdownModal] = useState(false); // Timer modal
    const [showResetModal, setShowResetModal] = useState(false); // Reset confirmation
    const [countdown, setCountdown] = useState(null); // Active countdown
    const [countdownInterval, setCountdownInterval] = useState(null);

    // Color palette for options - matching Mentimeter
    const optionColors = [
        '#5B7FFF', '#FF8B8B', '#8B7FFF', '#7FEFBD', '#FFB366', '#FF7FB3'
    ];

    useEffect(() => {
        const initSession = async () => {
            try {
                const response = await sessionApi.getSession(sessionId);
                if (response.success) {
                    setSession(response.data.session);
                    setPolls(response.data.polls);
                    setSessionCode(response.data.session.sessionCode);
                    joinSession(null);
                }
            } catch (err) {
                console.error('Failed to load session:', err);
            } finally {
                setLoading(false);
            }
        };

        initSession();
    }, [sessionId]);

    const currentPoll = polls[currentPollIndex];

    // Calculate results for multiple choice
    const calculateResults = () => {
        if (!currentPoll?.options) return [];
        const options = currentPollResults?.options || currentPoll.options;
        const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
        const maxVotes = Math.max(...options.map(o => o.votes || 0), 1);

        return options.map((option, index) => ({
            ...option,
            votes: option.votes || 0,
            percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
            heightPercent: maxVotes > 0 ? ((option.votes || 0) / maxVotes) * 100 : 0,
            color: optionColors[index % optionColors.length]
        }));
    };

    const results = calculateResults();

    const handlePrevPoll = async () => {
        if (currentPollIndex > 0) {
            const newIndex = currentPollIndex - 1;
            // Optimistic update - immediate local state change
            setCurrentPollIndex(newIndex);
            // Socket broadcast for other clients
            navigatePoll(newIndex);
            // Also update via API as fallback
            try {
                await sessionApi.updateSession(sessionId, { currentPollIndex: newIndex });
            } catch (err) {
                console.error('Failed to update session via API:', err);
            }
        }
    };

    const handleNextPoll = async () => {
        if (currentPollIndex < polls.length - 1) {
            const newIndex = currentPollIndex + 1;
            // Optimistic update - immediate local state change
            setCurrentPollIndex(newIndex);
            // Socket broadcast for other clients
            navigatePoll(newIndex);
            // Also update via API as fallback
            try {
                await sessionApi.updateSession(sessionId, { currentPollIndex: newIndex });
            } catch (err) {
                console.error('Failed to update session via API:', err);
            }
        }
    };

    const handleResetPoll = () => {
        if (currentPoll && confirm('Clear all votes for this poll?')) {
            resetPoll(currentPoll._id);
        }
    };

    const handleLockPoll = () => {
        if (currentPoll) {
            const newLockState = !isLocked;
            lockPoll(currentPoll._id, newLockState);
            setIsLocked(newLockState);
        }
    };

    const handleEndPresentation = () => {
        if (confirm('End this presentation?')) {
            endSession();
            navigate('/dashboard');
        }
    };

    // Start countdown timer
    const startCountdown = (seconds) => {
        // Clear any existing countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        setCountdown(seconds);
        setShowCountdownModal(false);

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCountdownInterval(null);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        setCountdownInterval(interval);
    };

    // Format countdown display (MM:SS)
    const formatCountdown = (seconds) => {
        if (!seconds) return null;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Reset poll with modal confirmation
    const handleResetConfirm = (resetAll) => {
        if (resetAll) {
            resetSession();
        } else if (currentPoll) {
            resetPoll(currentPoll._id);
        }
        setShowResetModal(false);
    };

    // Format join code with space (e.g., "2730 8197")
    const formatJoinCode = (code) => {
        if (!code) return '';
        const cleaned = code.toString().replace(/\s/g, '');
        if (cleaned.length <= 4) return cleaned;
        return cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
    };

    // Render Bar Chart - Mentimeter style with growing bars
    const renderBarChart = () => (
        <div className="menti-bar-chart">
            {results.map((option, index) => (
                <motion.div
                    key={option.id || index}
                    className="menti-bar-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    {/* Vote count or percentage above bar */}
                    <motion.div
                        className="menti-vote-count"
                        key={`${option.votes}-${showPercent}`}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                    >
                        {showPercent ? `${option.percentage}%` : option.votes}
                    </motion.div>

                    {/* Growing bar */}
                    <div className="menti-bar-wrapper">
                        <motion.div
                            className="menti-bar"
                            style={{ backgroundColor: option.color }}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(option.heightPercent, 2)}%` }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        />
                    </div>

                    {/* Colored line under bar */}
                    <div
                        className="menti-bar-line"
                        style={{ backgroundColor: option.color }}
                    />

                    {/* Option label */}
                    <div className="menti-option-label">{option.text || `Option ${index + 1}`}</div>
                </motion.div>
            ))}
        </div>
    );

    // Render poll content based on type
    const renderPollContent = () => {
        if (!currentPoll) {
            return (
                <div className="menti-no-poll">
                    <p>No active poll</p>
                </div>
            );
        }

        if (hideResults) {
            return (
                <div className="menti-results-hidden">
                    <span>👁</span>
                    <p>Results are currently hidden</p>
                </div>
            );
        }

        return renderBarChart();
    };

    if (loading) {
        return (
            <div className="menti-presentation loading">
                <div className="menti-loader"></div>
                <span>Loading presentation...</span>
            </div>
        );
    }

    return (
        <div className="menti-presentation">
            {/* Top Black Bar */}
            <div className="menti-top-bar">
                <button className="menti-close-btn" onClick={() => navigate(`/poll/edit/${session?.presentationId || sessionId}`)}>
                    ×
                </button>

                <div className="menti-join-pill">
                    <span>Join at <strong>reactify.com/join</strong> | use code</span>
                    <strong className="menti-code">{formatJoinCode(sessionCode)}</strong>
                </div>

                <div className="menti-logo">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                        <rect x="2" y="8" width="8" height="16" rx="2" fill="#3B82F6" />
                        <rect x="12" y="4" width="8" height="24" rx="2" fill="#1E3A5F" />
                        <rect x="22" y="12" width="8" height="12" rx="2" fill="#EF4444" />
                    </svg>
                    <span>Reactify</span>
                    <button className="menti-fullscreen-btn">⛶</button>
                </div>
            </div>

            {/* White Content Area */}
            <div className="menti-content">
                {/* Side Tools - Left margin */}
                <div className="menti-side-tools">
                    <button className="menti-tool-btn" title="Pointer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 2l9 6-4 1-2 4-3-11z" fill="currentColor" />
                        </svg>
                    </button>
                    <button
                        className="menti-tool-btn"
                        title="Timer"
                        onClick={() => setShowCountdownModal(true)}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </button>
                    <button
                        className={`menti-tool-btn ${showPercent ? 'active' : ''}`}
                        title="Percentage"
                        onClick={() => setShowPercent(!showPercent)}
                    >
                        %
                    </button>
                    <button className="menti-tool-btn" title="Chart">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 14h12M4 10v4M8 6v8M12 8v6" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                </div>

                {/* Main Content - Left side */}
                <div className="menti-main-content">
                    {/* Question */}
                    <motion.h1
                        className="menti-question"
                        key={currentPoll?._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {currentPoll?.question || 'No question'}
                    </motion.h1>

                    {/* Results Visualization */}
                    <div className="menti-visualization">
                        {renderPollContent()}
                    </div>
                </div>

                {/* QR Code - Right side */}
                <div className="menti-qr-section">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/vote/${sessionId}`)}`}
                        alt="QR Code to join"
                        className="menti-qr-code"
                    />
                </div>
            </div>

            {/* Bottom Black Bar - Always Visible like Mentimeter */}
            <div className="menti-bottom-bar visible">
                {/* Left Section - Navigation */}
                <div className="menti-nav-left">
                    <button
                        className="menti-nav-btn"
                        onClick={handlePrevPoll}
                        disabled={currentPollIndex === 0}
                        title="Previous slide"
                    >
                        ←
                    </button>
                    <button className="menti-pointer-btn" title="Pointer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="4" fill="currentColor" />
                        </svg>
                    </button>
                    <button
                        className="menti-next-slide-btn"
                        onClick={handleNextPoll}
                        disabled={currentPollIndex >= polls.length - 1}
                        title="Next slide"
                    >
                        → Next slide
                    </button>
                </div>

                {/* Center Section - Controls (Mentimeter style) */}
                <div className="menti-controls-center">
                    {/* Fullscreen */}
                    <button className="menti-control-btn" title="Fullscreen">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 6V3h3M15 6V3h-3M3 12v3h3M15 12v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    {/* Reset */}
                    <button
                        className="menti-control-btn"
                        onClick={() => setShowResetModal(true)}
                        title="Reset results"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9a6 6 0 1 1 1.5 4M3 14v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    {/* Timer */}
                    <button
                        className="menti-control-btn"
                        onClick={() => setShowCountdownModal(true)}
                        title="Set countdown"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M9 7v3l2 1M7 2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    {/* Comments */}
                    <button
                        className={`menti-control-btn ${showFeedback ? 'active' : ''}`}
                        onClick={() => setShowFeedback(!showFeedback)}
                        title="Comments"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 4h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6l-3 2v-2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                    {/* Q&A */}
                    <button className="menti-control-btn" title="Q&A">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 7a2 2 0 1 1 2 2v1M9 12v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    {/* Grid */}
                    <button className="menti-control-btn" title="Grid">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="3" y="3" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="11" y="3" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="3" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="11" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                    {/* Eye - Hide/Show results */}
                    <button
                        className={`menti-control-btn ${hideResults ? 'active' : ''}`}
                        onClick={() => setHideResults(!hideResults)}
                        title={hideResults ? 'Show results' : 'Hide results'}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <ellipse cx="9" cy="9" rx="6" ry="4" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                    {/* Lock */}
                    <button
                        className={`menti-control-btn ${isLocked ? 'active' : ''}`}
                        onClick={handleLockPoll}
                        title={isLocked ? 'Open voting' : 'Close voting'}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="4" y="8" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M6 8V6a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </button>
                </div>

                {/* Right Section - Info */}
                <div className="menti-nav-right">
                    {countdown && (
                        <div className="menti-countdown-display">
                            {formatCountdown(countdown)}
                        </div>
                    )}
                    <div className="menti-participant-count" title="Participants">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="5" r="3" fill="currentColor" />
                            <path d="M2 14c0-3 3-5 6-5s6 2 6 5" fill="currentColor" />
                        </svg>
                        <span>{participantCount}</span>
                    </div>
                    <div className="menti-slide-counter">
                        {currentPollIndex + 1} / {polls.length}
                    </div>
                </div>
            </div>

            {/* Hover trigger zone at bottom */}
            <div
                className="menti-hover-trigger"
                onMouseEnter={() => setShowControls(true)}
            />

            {/* Join Instructions Overlay */}
            <AnimatePresence>
                {showJoinOverlay && (
                    <motion.div
                        className="menti-join-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowJoinOverlay(false)}
                    >
                        <div className="menti-join-content" onClick={e => e.stopPropagation()}>
                            <button className="menti-overlay-close" onClick={() => setShowJoinOverlay(false)}>×</button>
                            <h2>Go to reactify.com/vote</h2>
                            <p>and use the session ID</p>
                            <div className="menti-big-code">{sessionId}</div>
                            <div className="menti-qr-placeholder">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/vote/${sessionId}`)}`}
                                    alt="QR Code"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Countdown Timer Modal */}
            <AnimatePresence>
                {showCountdownModal && (
                    <motion.div
                        className="menti-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCountdownModal(false)}
                    >
                        <motion.div
                            className="menti-countdown-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3>Set countdown</h3>
                            <div className="menti-countdown-options">
                                <button onClick={() => startCountdown(15)}>15s</button>
                                <button onClick={() => startCountdown(30)}>30s</button>
                                <button onClick={() => startCountdown(60)}>1m</button>
                                <button onClick={() => startCountdown(120)}>2m</button>
                                <button onClick={() => startCountdown(180)}>3m</button>
                            </div>
                            <button className="menti-modal-cancel" onClick={() => setShowCountdownModal(false)}>
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reset Confirmation Modal */}
            <AnimatePresence>
                {showResetModal && (
                    <motion.div
                        className="menti-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowResetModal(false)}
                    >
                        <motion.div
                            className="menti-reset-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3>Clear results to start fresh?</h3>
                            <div className="menti-reset-options">
                                <button onClick={() => handleResetConfirm(true)}>All slides</button>
                                <button onClick={() => handleResetConfirm(false)}>This slide only</button>
                            </div>
                            <button className="menti-modal-cancel" onClick={() => setShowResetModal(false)}>
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live Feedback Panel */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        className="live-feedback-panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="feedback-panel-header">
                            <h3>💬 Live Feedback</h3>
                            <button className="close-feedback-btn" onClick={() => setShowFeedback(false)}>
                                ×
                            </button>
                        </div>
                        <div className="feedback-list">
                            {feedbackList.length === 0 ? (
                                <div className="no-feedback">
                                    <span>📨</span>
                                    <p>No feedback yet</p>
                                    <small>Participant feedback will appear here in real-time</small>
                                </div>
                            ) : (
                                feedbackList.map((fb, index) => (
                                    <motion.div
                                        key={fb._id || index}
                                        className="feedback-item"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="feedback-item-header">
                                            <span className="feedback-author">
                                                {fb.participantId?.name || 'Anonymous'}
                                            </span>
                                            <span className="feedback-time">
                                                {fb.timestamp ? new Date(fb.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                            </span>
                                        </div>
                                        <p className="feedback-content">{fb.content}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
