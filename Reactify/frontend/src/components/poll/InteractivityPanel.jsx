import React from 'react';
import './InteractivityPanel.css';

export const InteractivityPanel = ({ onClose }) => {
    const interactivityOptions = [
        { id: 'reactions', name: 'Live Reactions', icon: '👍', description: 'Let audience send reactions', enabled: true },
        { id: 'pace', name: 'Pace Feedback', icon: '🏃', description: 'Too fast / Too slow feedback', enabled: false },
        { id: 'confetti', name: 'Confetti Effect', icon: '🎉', description: 'Celebrate correct answers', enabled: true },
        { id: 'sound', name: 'Sound Effects', icon: '🔊', description: 'Play sounds on events', enabled: false },
        { id: 'countdown', name: 'Countdown Timer', icon: '⏱️', description: 'Add time limit to questions', enabled: false },
        { id: 'music', name: 'Background Music', icon: '🎵', description: 'Play music during session', enabled: false },
    ];

    return (
        <div className="interactivity-panel">
            <div className="interactivity-header">
                <h3>Interactivity</h3>
                <button className="close-btn" onClick={onClose}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="interactivity-description">
                <p>Enhance audience engagement with interactive features</p>
            </div>

            <div className="interactivity-options">
                {interactivityOptions.map(option => (
                    <div key={option.id} className="interactivity-option">
                        <div className="option-icon">{option.icon}</div>
                        <div className="option-info">
                            <span className="option-name">{option.name}</span>
                            <span className="option-description">{option.description}</span>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" defaultChecked={option.enabled} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                ))}
            </div>

            <div className="interactivity-footer">
                <p className="coming-soon">More features coming soon!</p>
            </div>
        </div>
    );
};
