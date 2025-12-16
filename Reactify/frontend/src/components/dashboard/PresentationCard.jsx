import React from 'react';
import './PresentationCard.css';

export const PresentationCard = ({
    question,
    title,
    thumbnail,
    slideType = 'multiple-choice',
    createdAt,
    slideCount = 1,
    options = [],
    backgroundColor = '#FFFFFF',
    onClick,
    onDelete
}) => {
    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete();
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const displayTitle = question || title || 'Your question here';
    const truncatedTitle = displayTitle.length > 35 ? displayTitle.substring(0, 35) + '...' : displayTitle;

    // Use white background by default
    const bgColor = backgroundColor || '#FFFFFF';

    // Get type label for display
    const getTypeLabel = () => {
        const labels = {
            'multiple-choice': 'Poll',
            'single-choice': 'Poll',
            'word-cloud': 'Word Cloud',
            'open-ended': 'Open Ended',
            'scales': 'Scales',
            'ranking': 'Ranking',
            'qa': 'Q&A',
            'rating': 'Rating'
        };
        return labels[slideType] || 'Poll';
    };

    // Render the mini slide that exactly matches the canvas
    const renderMiniSlide = () => {
        switch (slideType) {
            case 'word-cloud':
                return (
                    <div className="mini-slide" style={{ backgroundColor: bgColor }}>
                        <div className="mini-header">
                            <div className="mini-join-pill">{getTypeLabel()}</div>
                            <div className="mini-logo">M</div>
                        </div>
                        <div className="mini-question">{truncatedTitle}</div>
                        <div className="mini-viz mini-wordcloud">
                            <span style={{ fontSize: '11px', color: '#8B9DC3' }}>creative</span>
                            <span style={{ fontSize: '8px', color: '#C9A7C7' }}>fast</span>
                            <span style={{ fontSize: '9px', color: '#D4A5A5' }}>leader</span>
                            <span style={{ fontSize: '7px', color: '#B8A9C9' }}>focus</span>
                            <span style={{ fontSize: '10px', color: '#E8C4C4' }}>bold</span>
                        </div>
                    </div>
                );

            case 'open-ended':
                return (
                    <div className="mini-slide" style={{ backgroundColor: bgColor }}>
                        <div className="mini-header">
                            <div className="mini-join-pill">{getTypeLabel()}</div>
                            <div className="mini-logo">M</div>
                        </div>
                        <div className="mini-question">{truncatedTitle}</div>
                        <div className="mini-viz mini-openended">
                            <div className="mini-response">"Great idea!"</div>
                            <div className="mini-response">"Very helpful"</div>
                            <div className="mini-response">"Excellent"</div>
                        </div>
                    </div>
                );

            case 'scales':
                return (
                    <div className="mini-slide" style={{ backgroundColor: bgColor }}>
                        <div className="mini-header">
                            <div className="mini-join-pill">{getTypeLabel()}</div>
                            <div className="mini-logo">M</div>
                        </div>
                        <div className="mini-question">{truncatedTitle}</div>
                        <div className="mini-viz mini-scales">
                            <div className="mini-scale-track">
                                <div className="mini-scale-fill"></div>
                                <div className="mini-scale-thumb"></div>
                            </div>
                            <div className="mini-scale-labels">
                                <span>1</span>
                                <span>10</span>
                            </div>
                        </div>
                    </div>
                );

            case 'ranking':
                return (
                    <div className="mini-slide" style={{ backgroundColor: bgColor }}>
                        <div className="mini-header">
                            <div className="mini-join-pill">{getTypeLabel()}</div>
                            <div className="mini-logo">M</div>
                        </div>
                        <div className="mini-question">{truncatedTitle}</div>
                        <div className="mini-viz mini-ranking">
                            <div className="mini-rank-item"><span className="mini-rank-num">1</span> Option</div>
                            <div className="mini-rank-item"><span className="mini-rank-num">2</span> Option</div>
                            <div className="mini-rank-item"><span className="mini-rank-num">3</span> Option</div>
                        </div>
                    </div>
                );

            case 'qa':
                return (
                    <div className="mini-slide" style={{ backgroundColor: bgColor }}>
                        <div className="mini-header">
                            <div className="mini-join-pill">{getTypeLabel()}</div>
                            <div className="mini-logo">M</div>
                        </div>
                        <div className="mini-question">{truncatedTitle}</div>
                        <div className="mini-viz mini-qa">
                            <div className="mini-qa-item">❓ Question... <span>▲5</span></div>
                            <div className="mini-qa-item">❓ Question... <span>▲3</span></div>
                        </div>
                    </div>
                );

            case 'multiple-choice':
            case 'single-choice':
            default:
                return (
                    <div className="mini-slide" style={{ backgroundColor: bgColor }}>
                        <div className="mini-header">
                            <div className="mini-join-pill">{getTypeLabel()}</div>
                            <div className="mini-logo">M</div>
                        </div>
                        <div className="mini-question">{truncatedTitle}</div>
                        <div className="mini-viz mini-bars">
                            <div className="mini-bar-group">
                                <span className="mini-vote">42</span>
                                <div className="mini-bar" style={{ height: '28px', backgroundColor: '#5B7FFF' }}></div>
                                <span className="mini-label">A</span>
                            </div>
                            <div className="mini-bar-group">
                                <span className="mini-vote">28</span>
                                <div className="mini-bar" style={{ height: '18px', backgroundColor: '#FF8B8B' }}></div>
                                <span className="mini-label">B</span>
                            </div>
                            <div className="mini-bar-group">
                                <span className="mini-vote">35</span>
                                <div className="mini-bar" style={{ height: '22px', backgroundColor: '#8B7FFF' }}></div>
                                <span className="mini-label">C</span>
                            </div>
                            <div className="mini-bar-group">
                                <span className="mini-vote">19</span>
                                <div className="mini-bar" style={{ height: '12px', backgroundColor: '#7FEFBD' }}></div>
                                <span className="mini-label">D</span>
                            </div>
                        </div>
                        <div className="mini-participant">0 👤</div>
                    </div>
                );
        }
    };

    return (
        <div className="presentation-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className="presentation-thumbnail">
                {thumbnail ? (
                    <img src={thumbnail} alt="Presentation" />
                ) : (
                    renderMiniSlide()
                )}
            </div>
            <div className="presentation-details">
                <p className="presentation-question">{title || question || 'Untitled'}</p>
                <div className="presentation-meta">
                    <span className="meta-slides">{slideCount} slide{slideCount !== 1 ? 's' : ''}</span>
                    {createdAt && <span className="meta-date">{formatDate(createdAt)}</span>}
                </div>
            </div>
            <button
                className="presentation-actions-btn"
                onClick={handleDelete}
                title="Delete presentation"
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 4h12M7 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};
