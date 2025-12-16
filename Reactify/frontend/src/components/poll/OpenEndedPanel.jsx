import React from 'react';
import './OpenEndedPanel.css';

export const OpenEndedPanel = ({
    maxCharacters = 500,
    onMaxCharactersChange,
    showResponses = true,
    onShowResponsesChange,
    onClose
}) => {
    return (
        <div className="open-ended-panel">
            {/* Header */}
            <div className="panel-header">
                <button className="panel-back-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h3 className="panel-title">Open Ended</h3>
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
                    <div className="open-ended-preview">
                        <div className="response-bubble">"Great presentation!"</div>
                        <div className="response-bubble">"Very informative"</div>
                        <div className="response-bubble">"Loved it!"</div>
                    </div>
                </div>

                {/* Settings */}
                <div className="settings-section">
                    <h4 className="section-title">Settings</h4>

                    {/* Max characters */}
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Maximum characters</label>
                            <p className="setting-description">Limit response length</p>
                        </div>
                        <select
                            className="setting-select"
                            value={maxCharacters}
                            onChange={(e) => onMaxCharactersChange(Number(e.target.value))}
                        >
                            <option value={100}>100 characters</option>
                            <option value={250}>250 characters</option>
                            <option value={500}>500 characters</option>
                            <option value={1000}>1000 characters</option>
                        </select>
                    </div>

                    {/* Show responses */}
                    <div className="setting-row">
                        <div className="setting-info">
                            <label>Show responses live</label>
                            <p className="setting-description">Display responses as they come in</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showResponses}
                                onChange={(e) => onShowResponsesChange(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* Info */}
                <div className="info-section">
                    <div className="info-icon">💬</div>
                    <p>Participants can type any response. Great for feedback, ideas, or open discussions.</p>
                </div>
            </div>
        </div>
    );
};
