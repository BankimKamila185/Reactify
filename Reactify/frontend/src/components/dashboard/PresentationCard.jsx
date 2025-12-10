import React from 'react';
import './PresentationCard.css';

export const PresentationCard = ({ question, thumbnail }) => {
    return (
        <div className="presentation-card">
            <div className="presentation-thumbnail">
                {thumbnail ? (
                    <img src={thumbnail} alt="Presentation" />
                ) : (
                    <div className="thumbnail-placeholder">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="8" fill="#E5E7EB" />
                            <path d="M12 16h16M12 20h16M12 24h10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="presentation-details">
                <p className="presentation-question">{question}</p>
            </div>
            <button className="presentation-actions-btn">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 4h12M7 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};
