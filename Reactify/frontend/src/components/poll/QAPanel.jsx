import React from 'react';
import './QAPanel.css';

export const QAPanel = ({
    allowAnonymous = true,
    onAllowAnonymousChange,
    isModerated = false,
    onIsMderatedChange,
    allowUpvoting = true,
    onAllowUpvotingChange,
    onClose
}) => {
    return (
        <div className="qa-panel">
            {/* Header */}
            <div className="panel-header">
                <button className="panel-back-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h3 className="panel-title">Q&A</h3>
                <button className="panel-close-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="panel-content">
                {/* Preview */}
                <div className="visualization-preview">
                    <div className="qa-preview">
                        <div className="qa-question-preview">
                            <div className="qa-upvote">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3L3 8H6V13H10V8H13L8 3Z" fill="#4285F4" />
                                </svg>
                                <span>12</span>
                            </div>
                            <span className="qa-text">How does this feature work?</span>
                        </div>
                        <div className="qa-question-preview">
                            <div className="qa-upvote">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3L3 8H6V13H10V8H13L8 3Z" fill="#4285F4" />
                                </svg>
                                <span>8</span>
                            </div>
                            <span className="qa-text">Can we get more examples?</span>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="settings-section">
                    <h4 className="section-title">Settings</h4>

                    {/* Anonymous questions */}
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Allow anonymous questions</label>
                            <p className="setting-description">Participants can ask without showing their name</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={allowAnonymous}
                                onChange={(e) => onAllowAnonymousChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* Moderation */}
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Moderation</label>
                            <p className="setting-description">Review questions before showing them</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={isModerated}
                                onChange={(e) => onIsMderatedChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* Upvoting */}
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Allow upvoting</label>
                            <p className="setting-description">Participants can upvote questions they like</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={allowUpvoting}
                                onChange={(e) => onAllowUpvotingChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* Info */}
                <div className="info-section">
                    <div className="info-icon">❓</div>
                    <p>Collect questions from your audience. Questions with more upvotes appear at the top.</p>
                </div>
            </div>
        </div>
    );
};
