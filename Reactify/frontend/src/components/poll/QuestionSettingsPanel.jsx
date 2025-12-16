import React from 'react';
import './QuestionSettingsPanel.css';

export const QuestionSettingsPanel = ({
    label,
    onLabelChange,
    additionalDetails,
    onAdditionalDetailsChange,
    onBack,
    onClose
}) => {
    return (
        <div className="question-settings-panel">
            <div className="question-settings-container">
                {/* Header */}
                <div className="question-settings-header">
                    <div className="header-left">
                        <button className="back-btn" onClick={onBack || onClose}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <h3 className="question-settings-title">Question</h3>
                    </div>
                    <button className="question-close-btn" onClick={onClose}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="question-settings-content">
                    {/* Label Section */}
                    <div className="question-setting-section">
                        <div className="setting-header-row">
                            <label className="question-setting-label">Label</label>
                            <button className="info-icon-btn" title="Add a label to identify this question">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" fill="none" />
                                    <path d="M8 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                    <circle cx="8" cy="5" r="0.7" fill="currentColor" />
                                </svg>
                            </button>
                        </div>
                        <input
                            type="text"
                            className="question-text-input"
                            placeholder="Enter label here..."
                            value={label}
                            onChange={(e) => onLabelChange(e.target.value)}
                        />
                    </div>

                    {/* Additional Details Section */}
                    <div className="question-setting-section">
                        <div className="setting-header-row">
                            <label className="question-setting-label">Additional details</label>
                            <button className="info-icon-btn" title="Add context or instructions for participants">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1" fill="none" />
                                    <path d="M8 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                    <circle cx="8" cy="5" r="0.7" fill="currentColor" />
                                </svg>
                            </button>
                        </div>
                        <textarea
                            className="question-textarea-input"
                            placeholder="Enter additional details here..."
                            value={additionalDetails}
                            onChange={(e) => onAdditionalDetailsChange(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="section-divider"></div>
                </div>
            </div>
        </div>
    );
};
