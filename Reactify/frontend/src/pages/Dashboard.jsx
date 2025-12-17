import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { FeatureCard } from '../components/dashboard/FeatureCard';
import { PresentationCard } from '../components/dashboard/PresentationCard';
import { CreatePollModal } from '../components/poll/CreatePollModal';
import { AIGenerateModal } from '../components/poll/AIGenerateModal';
import { pollApi } from '../api/poll.api';
import { sessionApi } from '../api/session.api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Modal state
    const [isPollModalOpen, setIsPollModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [recentPresentations, setRecentPresentations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Popular features data with navigation types
    const features = [
        {
            id: 1,
            name: 'Word cloud',
            iconType: 'wordcloud',
            color: '#FF9B9B',
            type: 'word-cloud'
        },
        {
            id: 2,
            name: 'Poll',
            iconType: 'poll',
            color: '#8B9FFF',
            type: 'multiple-choice'
        },
        {
            id: 3,
            name: 'Open Ended',
            iconType: 'openended',
            color: '#FFB3C1',
            type: 'open-ended'
        },
        {
            id: 4,
            name: 'Scales',
            iconType: 'scales',
            color: '#A8B3FF',
            type: 'scales'
        },
        {
            id: 5,
            name: 'Ranking',
            iconType: 'ranking',
            color: '#7CECB0',
            type: 'ranking'
        },
        {
            id: 6,
            name: 'Pin on image',
            iconType: 'pin',
            color: '#9B8BFF',
            type: 'pin-image'
        }
    ];

    // Load recent presentations on mount
    useEffect(() => {
        loadRecentPresentations();
    }, []);

    const loadRecentPresentations = async () => {
        setIsLoading(true);
        try {
            const response = await pollApi.getMyPresentations();
            if (response.success && response.data?.presentations) {
                setRecentPresentations(response.data.presentations);
            }
        } catch (error) {
            console.error('Failed to load presentations:', error);
            // Use fallback demo data if API fails
            setRecentPresentations([
                { id: 1, question: "What's the most important trait for a great leader?", title: "Leadership Poll" },
                { id: 2, question: "What was your favorite subject in school?", title: "School Survey" },
                { id: 3, question: "How would you rate your experience with our product?", title: "Product Feedback" }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle feature card clicks - navigate to editor with pre-selected type
    const handleFeatureClick = (feature) => {
        if (feature.name === 'Poll') {
            setIsPollModalOpen(true);
        } else {
            // Clear any existing session data so a new session is created
            localStorage.removeItem('currentSessionId');
            localStorage.removeItem('currentSessionCode');
            localStorage.removeItem('hostToken');
            // Navigate to poll editor with the selected type
            navigate('/poll/edit', {
                state: {
                    template: { id: 'blank', type: feature.type },
                    questionType: feature.type
                }
            });
        }
    };

    // Handle "New Reacti" button click
    const handleNewMenti = () => {
        // Clear any existing session data so a new session is created
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentSessionCode');
        localStorage.removeItem('hostToken');
        navigate('/poll/edit');
    };

    // Handle "Start with AI" button click
    const handleStartWithAI = () => {
        // Open AI generation modal
        setIsAIModalOpen(true);
    };

    // Handle "Import presentation" button click
    const handleImportPresentation = () => {
        // Create file input and trigger click
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pptx,.pdf,.docx,.txt';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Navigate to host dashboard with the file for AI processing
                navigate('/host', { state: { importFile: file } });
            }
        };
        input.click();
    };

    // Handle presentation card click
    const handlePresentationClick = (presentation) => {
        // Clear localStorage so the editor loads data from the database
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentSessionCode');
        localStorage.removeItem('hostToken');

        if (presentation.sessionId) {
            navigate(`/poll/edit/${presentation.sessionId}`);
        } else {
            // If no session ID, just open a new editor
            navigate('/poll/edit', {
                state: {
                    template: {
                        id: 'existing',
                        question: presentation.question
                    }
                }
            });
        }
    };

    // Handle presentation delete
    const handleDeletePresentation = async (presentationId, sessionId) => {
        try {
            // Delete session if available, otherwise delete poll
            if (sessionId) {
                await sessionApi.deleteSession(sessionId);
            } else {
                await pollApi.deletePoll(presentationId);
            }
            setRecentPresentations(prev => prev.filter(p => p.id !== presentationId && p.sessionId !== sessionId));
        } catch (error) {
            console.error('Failed to delete presentation:', error);
        }
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <div className="dashboard-main-new">
                <DashboardHeader />

                <div className="dashboard-content-new">
                    {/* Welcome Section */}
                    <section className="welcome-section">
                        <h1 className="welcome-title">Welcome {user?.displayName || user?.fullName || 'User'}!</h1>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button
                                className="btn-action btn-primary-action"
                                onClick={handleNewMenti}
                            >
                                <span>New Reacti</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                            <button
                                className="btn-action btn-secondary-action"
                                onClick={handleStartWithAI}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                </svg>
                                <span>Start with AI</span>
                            </button>
                            <button
                                className="btn-action btn-secondary-action"
                                onClick={handleImportPresentation}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M3 14h12M9 3v8M6 8l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Import presentation</span>
                            </button>
                        </div>
                    </section>

                    {/* Popular Features */}
                    <section className="features-section">
                        <h2 className="section-heading">Popular features</h2>
                        <div className="features-grid">
                            {features.map(feature => (
                                <FeatureCard
                                    key={feature.id}
                                    iconType={feature.iconType}
                                    name={feature.name}
                                    color={feature.color}
                                    onClick={() => handleFeatureClick(feature)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Recently Viewed */}
                    <section className="recent-section">
                        <h2 className="section-heading">Recently viewed</h2>
                        {isLoading ? (
                            <div className="loading-state">Loading presentations...</div>
                        ) : (
                            <div className="recent-grid">
                                {recentPresentations.map(presentation => (
                                    <PresentationCard
                                        key={presentation.id}
                                        title={presentation.title}
                                        question={presentation.question}
                                        createdAt={presentation.createdAt}
                                        slideCount={presentation.pollCount || 1}
                                        slideType={presentation.slideType || 'multiple-choice'}
                                        onClick={() => handlePresentationClick(presentation)}
                                        onDelete={() => handleDeletePresentation(presentation.id, presentation.sessionId)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Poll Creation Modal */}
            <CreatePollModal
                isOpen={isPollModalOpen}
                onClose={() => setIsPollModalOpen(false)}
            />

            {/* AI Generate Modal */}
            <AIGenerateModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onGenerate={(slides) => {
                    setIsAIModalOpen(false);
                    // Clear localStorage for a fresh session
                    localStorage.removeItem('currentSessionId');
                    localStorage.removeItem('currentSessionCode');
                    localStorage.removeItem('hostToken');
                    // Navigate to editor with AI-generated slides
                    navigate('/poll/edit', {
                        state: {
                            aiGeneratedSlides: slides,
                            template: { id: 'ai-generated' }
                        }
                    });
                }}
            />
        </div>
    );
};
