import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtime } from '../hooks/useRealtime';
import { useSessionStore } from '../stores/sessionStore';
import { sessionApi } from '../api/session.api';
import { pollApi } from '../api/poll.api';
import './VotingView.css';

// Theme definitions (matching ThemesPicker)
const themes = {
    default: { primary: '#5B7FFF', background: '#f8f9fa', isDark: false },
    ocean: { primary: '#0EA5E9', background: '#F0F9FF', isDark: false },
    forest: { primary: '#22C55E', background: '#F0FDF4', isDark: false },
    sunset: { primary: '#F97316', background: '#FFF7ED', isDark: false },
    lavender: { primary: '#A855F7', background: '#FAF5FF', isDark: false },
    rose: { primary: '#EC4899', background: '#FDF2F8', isDark: false },
    dark: { primary: '#8B5CF6', background: '#1f2937', isDark: true },
    midnight: { primary: '#3B82F6', background: '#0F172A', isDark: true },
    coral: { primary: '#F43F5E', background: '#FFF1F2', isDark: false },
    mint: { primary: '#14B8A6', background: '#F0FDFA', isDark: false },
    amber: { primary: '#F59E0B', background: '#FFFBEB', isDark: false },
    slate: { primary: '#64748B', background: '#F8FAFC', isDark: false },
};

export const VotingView = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { session, polls, currentPollIndex, setSession, setPolls } = useSessionStore();
    const { joinSession, submitAnswer, submitFeedback } = useRealtime(sessionId);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    // Track which polls have been voted on using a Set (persisted in localStorage)
    const [votedPollIds, setVotedPollIds] = useState(() => {
        const stored = localStorage.getItem(`votedPolls_${sessionId}`);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    });
    const [participantId, setParticipantId] = useState(null);
    const [showReaction, setShowReaction] = useState(false);
    const [isSessionEnded, setIsSessionEnded] = useState(false);

    // State for different poll types
    const [wordCloudInput, setWordCloudInput] = useState('');
    const [wordCloudWords, setWordCloudWords] = useState([]);
    const [openEndedInput, setOpenEndedInput] = useState('');
    const [scaleValue, setScaleValue] = useState(5);
    const [rankingItems, setRankingItems] = useState([]);
    const [qaQuestion, setQaQuestion] = useState('');

    // Theme state - detect from poll or use default
    const [currentTheme, setCurrentTheme] = useState(themes.default);

    const socket = useRealtime(sessionId).socket || window.socket;

    useEffect(() => {
        if (!socket) return;

        const handleSessionEnded = () => {
            console.log('Session ended event received');
            setIsSessionEnded(true);
        };

        socket.on('session-ended', handleSessionEnded);

        return () => {
            socket.off('session-ended', handleSessionEnded);
        };
    }, [socket]);

    // Initial session loading
    useEffect(() => {
        const initSession = async () => {
            if (!sessionId || sessionId === 'undefined') {
                navigate('/join');
                return;
            }

            try {
                const storedParticipantId = localStorage.getItem('participantId');

                // If no participant ID, redirect to join page
                if (!storedParticipantId) {
                    // Store intended destination
                    sessionStorage.setItem('joinDestination', `/vote/${sessionId}`);
                    navigate('/join');
                    return;
                }

                setParticipantId(storedParticipantId);

                const response = await sessionApi.getSession(sessionId);
                if (response.success) {
                    setSession(response.data.session);
                    setPolls(response.data.polls);

                    // Set theme from session if available
                    const themeId = response.data.session.theme || 'default';
                    setCurrentTheme(themes[themeId] || themes.default);
                }
            } catch (err) {
                setError('Failed to load session');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        initSession();
    }, [sessionId]);

    // Join session when socket is ready and session is loaded
    useEffect(() => {
        const storedParticipantId = localStorage.getItem('participantId');
        if (session && storedParticipantId && joinSession) {
            console.log('Audience joining session room:', sessionId);
            joinSession(storedParticipantId);
        }
    }, [session, joinSession, sessionId]);

    if (isSessionEnded) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: currentTheme?.background || '#f8f9fa' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
                >
                    <div className="mb-6 text-blue-500">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">Presentation Ended</h1>
                    <p className="text-gray-600 text-lg mb-8">
                        Thank you for your participation! The host has ended the session.
                    </p>
                    <button
                        onClick={() => navigate('/join')}
                        className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        Join Another Session
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentPoll = polls[currentPollIndex];

    // Helper to check if current poll has been voted on
    const hasVoted = currentPoll ? votedPollIds.has(currentPoll._id) : false;

    // Helper to mark a poll as voted
    const markPollAsVoted = (pollId) => {
        const newVotedIds = new Set(votedPollIds);
        newVotedIds.add(pollId);
        setVotedPollIds(newVotedIds);
        localStorage.setItem(`votedPolls_${sessionId}`, JSON.stringify([...newVotedIds]));
    };

    // Reset input state when poll changes (but keep vote status - that's tracked in votedPollIds)
    useEffect(() => {
        setSelectedOption(null);
        setWordCloudInput('');
        setWordCloudWords([]);
        setOpenEndedInput('');
        setScaleValue(5);
        setQaQuestion('');

        // Initialize ranking items from current poll
        if (currentPoll?.rankingItems) {
            setRankingItems([...currentPoll.rankingItems]);
        }
    }, [currentPollIndex, currentPoll]);

    const handleOptionClick = (optionId) => {
        if (hasVoted) return;
        setSelectedOption(optionId);
    };

    const handleSubmitVote = async () => {
        if (!currentPoll || hasVoted) return;

        const pollType = currentPoll.type;

        try {
            // Multiple Choice / Select Answer
            if (pollType === 'single-choice' || pollType === 'multiple-choice' || pollType === 'select-answer') {
                if (!selectedOption) return;
                submitAnswer(currentPoll._id, participantId, selectedOption);
            }
            // Word Cloud
            else if (pollType === 'word-cloud') {
                if (wordCloudWords.length === 0) return;
                await pollApi.submitWordCloudResponse(currentPoll._id, {
                    participantId,
                    words: wordCloudWords
                });
            }
            // Open Ended
            else if (pollType === 'open-ended') {
                if (!openEndedInput.trim()) return;
                await pollApi.submitOpenEndedResponse(currentPoll._id, {
                    participantId,
                    text: openEndedInput.trim()
                });
            }
            // Scales
            else if (pollType === 'scales') {
                await pollApi.submitScalesResponse(currentPoll._id, {
                    participantId,
                    value: scaleValue
                });
            }
            // Ranking
            else if (pollType === 'ranking') {
                await pollApi.submitRankingResponse(currentPoll._id, {
                    participantId,
                    ranking: rankingItems.map((item, idx) => ({ id: item.id, rank: idx + 1 }))
                });
            }
            // Q&A
            else if (pollType === 'qa') {
                if (!qaQuestion.trim()) return;
                await pollApi.submitQAQuestion(currentPoll._id, {
                    participantId,
                    question: qaQuestion.trim()
                });
            }
            // Rating
            else if (pollType === 'rating') {
                submitAnswer(currentPoll._id, participantId, scaleValue);
            }

            markPollAsVoted(currentPoll._id);
        } catch (err) {
            console.error('Failed to submit:', err);
            setError('Failed to submit response');
        }
    };

    // Word Cloud: Add word
    const handleAddWord = () => {
        const word = wordCloudInput.trim();
        if (word && wordCloudWords.length < (currentPoll?.maxWordsPerParticipant || 3)) {
            setWordCloudWords([...wordCloudWords, word]);
            setWordCloudInput('');
        }
    };

    const handleRemoveWord = (index) => {
        setWordCloudWords(wordCloudWords.filter((_, i) => i !== index));
    };

    // Ranking: Move item
    const moveRankingItem = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= rankingItems.length) return;
        const items = [...rankingItems];
        const [removed] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, removed);
        setRankingItems(items);
    };

    // Handle reaction
    const handleReaction = () => {
        setShowReaction(!showReaction);
        if (currentPoll && participantId) {
            submitFeedback(currentPoll._id, participantId, '👍', false);
        }
    };

    // Check if can submit based on poll type
    const canSubmit = () => {
        if (!currentPoll || hasVoted) return false;

        const pollType = currentPoll.type;

        if (pollType === 'single-choice' || pollType === 'multiple-choice' || pollType === 'select-answer') {
            return selectedOption !== null;
        }
        if (pollType === 'word-cloud') {
            return wordCloudWords.length > 0;
        }
        if (pollType === 'open-ended') {
            return openEndedInput.trim().length > 0;
        }
        if (pollType === 'scales' || pollType === 'rating') {
            return true;
        }
        if (pollType === 'ranking') {
            return rankingItems.length > 0;
        }
        if (pollType === 'qa') {
            return qaQuestion.trim().length > 0;
        }
        return false;
    };

    const themeClass = currentTheme.isDark ? 'theme-dark' : 'theme-light';

    // Render Reactify Logo
    const renderLogo = () => (
        <div className="voting-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="8" width="8" height="16" rx="2" fill="#3B82F6" />
                <rect x="12" y="4" width="8" height="24" rx="2" fill="#1E3A5F" />
                <rect x="22" y="12" width="8" height="12" rx="2" fill="#EF4444" />
            </svg>
            <span className="voting-logo-text">Reactify</span>
        </div>
    );

    // Render Footer
    const renderFooter = () => (
        <div className="voting-footer">
            <p className="voting-footer-text">
                Create your own at <a href="/" className="voting-footer-link">reactify.com</a>
            </p>
        </div>
    );

    // Render poll content based on type
    const renderPollContent = () => {
        if (!currentPoll) return null;

        const pollType = currentPoll.type;

        // Multiple Choice / Select Answer
        if (pollType === 'single-choice' || pollType === 'multiple-choice' || pollType === 'select-answer') {
            return (
                <div className="voting-options">
                    <AnimatePresence>
                        {currentPoll.options?.map((option, index) => (
                            <motion.button
                                key={option.id}
                                className={`voting-option-card ${selectedOption === option.id ? 'selected' : ''} ${hasVoted ? 'disabled' : ''}`}
                                onClick={() => handleOptionClick(option.id)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {option.image && (
                                    <img src={option.image} alt="" className="voting-option-image" />
                                )}
                                <span className="voting-option-text">{option.text}</span>
                                <div className="voting-option-radio">
                                    <div className="voting-option-radio-inner" />
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            );
        }

        // Word Cloud
        if (pollType === 'word-cloud') {
            const maxWords = currentPoll.maxWordsPerParticipant || 3;
            return (
                <div className="voting-wordcloud">
                    <div className="voting-wordcloud-input-row">
                        <input
                            type="text"
                            className="voting-wordcloud-input"
                            placeholder="Enter a word..."
                            value={wordCloudInput}
                            onChange={(e) => setWordCloudInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                            disabled={hasVoted || wordCloudWords.length >= maxWords}
                        />
                        <button
                            className="voting-wordcloud-add-btn"
                            onClick={handleAddWord}
                            disabled={hasVoted || !wordCloudInput.trim() || wordCloudWords.length >= maxWords}
                        >
                            Add
                        </button>
                    </div>
                    <div className="voting-wordcloud-tags">
                        {wordCloudWords.map((word, idx) => (
                            <span key={idx} className="voting-wordcloud-tag">
                                {word}
                                {!hasVoted && (
                                    <button className="voting-wordcloud-tag-remove" onClick={() => handleRemoveWord(idx)}>×</button>
                                )}
                            </span>
                        ))}
                    </div>
                    <p className="voting-wordcloud-count">{wordCloudWords.length}/{maxWords} words</p>
                </div>
            );
        }

        // Open Ended
        if (pollType === 'open-ended') {
            const maxChars = currentPoll.maxCharacters || 500;
            return (
                <div style={{ width: '100%' }}>
                    <textarea
                        className="voting-textarea"
                        placeholder="Share your thoughts..."
                        value={openEndedInput}
                        onChange={(e) => setOpenEndedInput(e.target.value.slice(0, maxChars))}
                        disabled={hasVoted}
                        rows={4}
                    />
                    <p className="voting-char-count">{openEndedInput.length}/{maxChars}</p>
                </div>
            );
        }

        // Scales / Rating
        if (pollType === 'scales' || pollType === 'rating') {
            const min = currentPoll.scaleMin || currentPoll.scaleConfig?.min || 1;
            const max = currentPoll.scaleMax || currentPoll.scaleConfig?.max || 10;
            const leftLabel = currentPoll.leftLabel || currentPoll.scaleConfig?.minLabel || 'Low';
            const rightLabel = currentPoll.rightLabel || currentPoll.scaleConfig?.maxLabel || 'High';

            return (
                <div className="voting-scales">
                    <div className="voting-scales-labels">
                        <span>{leftLabel}</span>
                        <span>{rightLabel}</span>
                    </div>
                    <input
                        type="range"
                        className="voting-slider"
                        min={min}
                        max={max}
                        value={scaleValue}
                        onChange={(e) => setScaleValue(parseInt(e.target.value))}
                        disabled={hasVoted}
                    />
                    <div className="voting-scales-value">{scaleValue}</div>
                    <div className="voting-scales-ticks">
                        {Array.from({ length: max - min + 1 }, (_, i) => (
                            <span key={i}>{min + i}</span>
                        ))}
                    </div>
                </div>
            );
        }

        // Ranking
        if (pollType === 'ranking') {
            return (
                <div className="voting-ranking">
                    {rankingItems.map((item, index) => (
                        <div key={item.id} className="voting-ranking-item">
                            <span className="voting-ranking-number">{index + 1}</span>
                            <span className="voting-ranking-text">{item.text}</span>
                            <div className="voting-ranking-controls">
                                <button
                                    className="voting-ranking-btn"
                                    onClick={() => moveRankingItem(index, index - 1)}
                                    disabled={hasVoted || index === 0}
                                >↑</button>
                                <button
                                    className="voting-ranking-btn"
                                    onClick={() => moveRankingItem(index, index + 1)}
                                    disabled={hasVoted || index === rankingItems.length - 1}
                                >↓</button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Q&A
        if (pollType === 'qa') {
            return (
                <div style={{ width: '100%' }}>
                    <textarea
                        className="voting-textarea"
                        placeholder="Ask a question..."
                        value={qaQuestion}
                        onChange={(e) => setQaQuestion(e.target.value)}
                        disabled={hasVoted}
                        rows={3}
                    />
                    <p className="voting-char-count" style={{ textAlign: 'center', marginTop: '8px' }}>
                        Your question will be visible to the presenter
                    </p>
                </div>
            );
        }

        return null;
    };

    // Loading State
    if (loading) {
        return (
            <div className={`voting-view ${themeClass} loading-state`}>
                <div className="voting-loader">
                    <div className="voting-loader-spinner" />
                    <span className="voting-loader-text">Loading session...</span>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className={`voting-view ${themeClass}`}>
                <div className="voting-container">
                    {renderLogo()}
                    <div className="voting-error">
                        <span className="voting-error-icon">⚠️</span>
                        <h2 className="voting-error-title">Oops!</h2>
                        <p className="voting-error-text">{error}</p>
                        <button className="voting-error-btn" onClick={() => navigate('/join')}>Go Back</button>
                    </div>
                </div>
                {renderFooter()}
            </div>
        );
    }

    // Waiting State (no poll)
    if (!currentPoll) {
        return (
            <div className={`voting-view ${themeClass}`}>
                <div className="voting-container">
                    {renderLogo()}
                    <div className="voting-waiting">
                        <div className="voting-waiting-pulse" style={{ backgroundColor: currentTheme.primary }} />
                        <h2 className="voting-waiting-title">Waiting for poll...</h2>
                        <p className="voting-waiting-text">The host will start the poll shortly</p>
                    </div>
                </div>
                {renderFooter()}
            </div>
        );
    }

    // Note: hasVoted state is handled in the main voting view - shows disabled options with "Voted!"

    // Main Voting View
    return (
        <div
            className={`voting-view ${themeClass}`}
            style={{ backgroundColor: currentTheme.background }}
        >
            <div className="voting-container">
                {renderLogo()}

                {/* Poll Progress */}
                {polls.length > 1 && (
                    <div className="voting-progress">
                        {currentPollIndex + 1} / {polls.length}
                    </div>
                )}

                {/* Question */}
                <motion.h1
                    className="voting-question"
                    key={currentPoll._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {currentPoll.question}
                </motion.h1>

                {/* Poll Content */}
                {renderPollContent()}

                {/* Submit Button or Voted Confirmation */}
                {hasVoted ? (
                    <div className="voting-voted-confirmation">
                        <span className="voting-voted-check">✓</span>
                        <span className="voting-voted-text">Vote submitted!</span>
                        <p className="voting-voted-waiting">Waiting for next poll...</p>
                    </div>
                ) : (
                    <button
                        className="voting-submit-btn"
                        style={{ backgroundColor: currentTheme.primary }}
                        onClick={handleSubmitVote}
                        disabled={!canSubmit()}
                    >
                        Submit
                    </button>
                )}

                {/* Reaction Button */}
                <button
                    className={`voting-reaction-btn ${showReaction ? 'active' : ''}`}
                    style={showReaction ? { backgroundColor: currentTheme.primary, borderColor: currentTheme.primary } : {}}
                    onClick={handleReaction}
                >
                    👍
                </button>
            </div>

            {renderFooter()}
        </div>
    );
};
