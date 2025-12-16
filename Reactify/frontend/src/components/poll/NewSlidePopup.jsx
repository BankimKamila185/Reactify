import React from 'react';
import './NewSlidePopup.css';

const slideTypes = {
    interactiveQuestions: [
        { id: 'multiple-choice', name: 'Multiple Choice', icon: '📊', color: '#4285F4' },
        { id: 'word-cloud', name: 'Word Cloud', icon: '✖', color: '#EA4335' },
        { id: 'open-ended', name: 'Open Ended', icon: '💬', color: '#FF7B7B' },
        { id: 'scales', name: 'Scales', icon: '📏', color: '#7B8FFF' },
        { id: 'ranking', name: 'Ranking', icon: '🏆', color: '#34A853' },
        { id: 'qa', name: 'Q&A', icon: '❓', color: '#FF9F7B' },
        { id: 'guess-number', name: 'Guess the Number', icon: '❔', color: '#EA4335' },
        { id: '100-points', name: '100 Points', icon: '📈', color: '#4285F4' },
        { id: '2x2-grid', name: '2 x 2 Grid', icon: '▦', color: '#FF7B7B' },
        { id: 'quick-form', name: 'Quick Form', icon: '✏️', color: '#FBBC04', premium: true },
        { id: 'pin-on-image', name: 'Pin on Image', icon: '📍', color: '#FF7B7B' },
    ],
    quizCompetitions: [
        { id: 'select-answer', name: 'Select Answer', icon: '✓', color: '#4285F4' },
        { id: 'type-answer', name: 'Type Answer', icon: '⌨', color: '#34A853' },
    ],
    contentSlides: [
        { id: 'text', name: 'Text', icon: 'T', color: '#4285F4' },
        { id: 'image', name: 'Image', icon: '🖼', color: '#4285F4' },
        { id: 'video', name: 'Video', icon: '▶', color: '#EA4335' },
        { id: 'instructions', name: 'Instructions', icon: '⊞', color: '#1A1A1A' },
    ],
    integrations: [
        { id: 'google-slides', name: 'Google Slides', icon: '📊', color: '#FBBC04' },
        { id: 'powerpoint', name: 'PowerPoint', icon: '📊', color: '#EA4335' },
        { id: 'pdf', name: 'PDF', icon: '📄', color: '#34A853' },
    ],
};

export const NewSlidePopup = ({ isOpen, onClose, onSelectSlideType, onSlideTypeHover }) => {
    if (!isOpen) return null;

    const handleSlideTypeClick = (slideType) => {
        if (onSlideTypeHover) onSlideTypeHover(null); // Clear hover on select
        onSelectSlideType(slideType);
        onClose();
    };

    const handlePopupClose = () => {
        if (onSlideTypeHover) onSlideTypeHover(null); // Clear hover on close
        onClose();
    };

    return (
        <div className="new-slide-popup-overlay" onClick={handlePopupClose}>
            <div className="new-slide-popup" onClick={(e) => e.stopPropagation()} onMouseLeave={() => onSlideTypeHover?.(null)}>
                {/* Close button */}
                <button className="new-slide-popup-close" onClick={handlePopupClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Start with AI Button */}
                <button
                    className="start-with-ai-btn"
                    onClick={() => handleSlideTypeClick({ id: 'ai-generate', name: 'AI Generate' })}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>Start with AI</span>
                </button>

                {/* Interactive Questions Section */}
                <div className="slide-type-section">
                    <div className="section-header">
                        <span className="section-title">Interactive questions</span>
                        <span className="section-info-icon">?</span>
                    </div>
                    <div className="slide-type-grid">
                        {slideTypes.interactiveQuestions.map((type) => (
                            <button
                                key={type.id}
                                className="slide-type-item"
                                onClick={() => handleSlideTypeClick(type)}
                                onMouseEnter={() => onSlideTypeHover?.(type.id)}
                            >
                                <span className="slide-type-icon" style={{ color: type.color }}>
                                    {type.id === 'multiple-choice' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="6" width="4" height="12" rx="1" fill="#4285F4" />
                                            <rect x="10" y="10" width="4" height="8" rx="1" fill="#4285F4" />
                                            <rect x="16" y="4" width="4" height="14" rx="1" fill="#4285F4" />
                                        </svg>
                                    )}
                                    {type.id === 'word-cloud' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 12L12 6L18 12L12 18L6 12Z" fill="#EA4335" />
                                        </svg>
                                    )}
                                    {type.id === 'open-ended' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="8" fill="#FF7B7B" />
                                        </svg>
                                    )}
                                    {type.id === 'scales' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="8" width="16" height="8" rx="4" fill="#7B8FFF" />
                                        </svg>
                                    )}
                                    {type.id === 'ranking' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 8H14V12H4V8Z" fill="#34A853" />
                                            <path d="M4 14H10V18H4V14Z" fill="#34A853" opacity="0.6" />
                                        </svg>
                                    )}
                                    {type.id === 'qa' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="8" cy="12" r="4" fill="#FF9F7B" />
                                            <circle cx="16" cy="12" r="4" fill="#FF7B7B" />
                                        </svg>
                                    )}
                                    {type.id === 'guess-number' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <text x="12" y="16" fontSize="16" fill="#EA4335" textAnchor="middle" fontWeight="bold">?</text>
                                        </svg>
                                    )}
                                    {type.id === '100-points' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="14" width="4" height="6" rx="1" fill="#4285F4" />
                                            <rect x="10" y="10" width="4" height="10" rx="1" fill="#4285F4" />
                                            <rect x="16" y="6" width="4" height="14" rx="1" fill="#4285F4" />
                                        </svg>
                                    )}
                                    {type.id === '2x2-grid' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="4" width="6" height="6" rx="1" fill="#FF7B7B" />
                                            <rect x="14" y="4" width="6" height="6" rx="1" fill="#FF7B7B" />
                                            <rect x="4" y="14" width="6" height="6" rx="1" fill="#FF7B7B" />
                                            <rect x="14" y="14" width="6" height="6" rx="1" fill="#FF7B7B" />
                                        </svg>
                                    )}
                                    {type.id === 'quick-form' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 4L18 12L6 20V4Z" fill="#FBBC04" />
                                        </svg>
                                    )}
                                    {type.id === 'pin-on-image' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FF7B7B" />
                                            <circle cx="12" cy="9" r="2.5" fill="white" />
                                        </svg>
                                    )}
                                </span>
                                <span className="slide-type-name">{type.name}</span>
                                {type.premium && <span className="premium-badge">⭐</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quiz Competitions Section */}
                <div className="slide-type-section">
                    <div className="section-header">
                        <span className="section-title">Quiz competitions</span>
                        <span className="section-info-icon">?</span>
                    </div>
                    <div className="slide-type-grid">
                        {slideTypes.quizCompetitions.map((type) => (
                            <button
                                key={type.id}
                                className="slide-type-item"
                                onClick={() => handleSlideTypeClick(type)}
                                onMouseEnter={() => onSlideTypeHover?.(type.id)}
                            >
                                <span className="slide-type-icon" style={{ color: type.color }}>
                                    {type.id === 'select-answer' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="4" width="4" height="16" rx="1" fill="#4285F4" />
                                            <rect x="10" y="8" width="4" height="12" rx="1" fill="#4285F4" />
                                        </svg>
                                    )}
                                    {type.id === 'type-answer' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <text x="12" y="16" fontSize="14" fill="#34A853" textAnchor="middle" fontWeight="bold">I</text>
                                            <rect x="6" y="18" width="12" height="2" fill="#34A853" />
                                        </svg>
                                    )}
                                </span>
                                <span className="slide-type-name">{type.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Slides Section */}
                <div className="slide-type-section">
                    <div className="section-header">
                        <span className="section-title">Content slides</span>
                        <span className="section-info-icon">?</span>
                    </div>
                    <div className="slide-type-grid">
                        {slideTypes.contentSlides.map((type) => (
                            <button
                                key={type.id}
                                className="slide-type-item"
                                onClick={() => handleSlideTypeClick(type)}
                                onMouseEnter={() => onSlideTypeHover?.(type.id)}
                            >
                                <span className="slide-type-icon" style={{ color: type.color }}>
                                    {type.id === 'text' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <text x="6" y="18" fontSize="18" fill="#4285F4" fontWeight="bold">T</text>
                                            <rect x="14" y="8" width="6" height="2" fill="#4285F4" />
                                        </svg>
                                    )}
                                    {type.id === 'image' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 15L8 11L11 14L16 9L20 15V18H4V15Z" fill="#4285F4" />
                                            <circle cx="8" cy="8" r="2" fill="#4285F4" />
                                        </svg>
                                    )}
                                    {type.id === 'video' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 6L18 12L8 18V6Z" fill="#EA4335" />
                                        </svg>
                                    )}
                                    {type.id === 'instructions' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="4" width="6" height="6" rx="1" fill="#1A1A1A" />
                                            <rect x="14" y="4" width="6" height="6" rx="1" fill="#1A1A1A" />
                                            <rect x="4" y="14" width="6" height="6" rx="1" fill="#1A1A1A" />
                                            <rect x="14" y="14" width="6" height="6" rx="1" fill="#1A1A1A" />
                                        </svg>
                                    )}
                                </span>
                                <span className="slide-type-name">{type.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Integrations Section */}
                <div className="slide-type-section">
                    <div className="section-header">
                        <span className="section-title">Integrations</span>
                        <span className="section-info-icon">?</span>
                    </div>
                    <div className="slide-type-grid integrations-grid">
                        {slideTypes.integrations.map((type) => (
                            <button
                                key={type.id}
                                className="slide-type-item integration-item"
                                onClick={() => handleSlideTypeClick(type)}
                                onMouseEnter={() => onSlideTypeHover?.(type.id)}
                            >
                                <span className="slide-type-icon" style={{ color: type.color }}>
                                    {type.id === 'google-slides' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="4" width="16" height="16" rx="2" fill="#FBBC04" />
                                        </svg>
                                    )}
                                    {type.id === 'powerpoint' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="4" width="16" height="16" rx="2" fill="#EA4335" />
                                        </svg>
                                    )}
                                    {type.id === 'pdf' && (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="4" width="16" height="16" rx="2" fill="#34A853" />
                                        </svg>
                                    )}
                                </span>
                                <span className="slide-type-name">{type.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Import Slides Button */}
                <div className="import-slides-section">
                    <button className="import-slides-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 12V4M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Import slides
                        <span className="premium-badge">⭐</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
