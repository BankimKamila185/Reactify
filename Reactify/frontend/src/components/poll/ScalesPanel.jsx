import React, { useState } from 'react';
import './ScalesPanel.css';

// Colors for statements (matching Reactify)
const statementColors = [
    '#5B7FFF', // Blue
    '#FF7B7B', // Coral/Red
    '#8B7FFF', // Purple
    '#7BC8FF', // Light blue
    '#7FEFBD', // Green
    '#FFB366', // Orange
];

export const ScalesPanel = ({
    statements = [],
    onStatementsChange,
    onAddStatement,
    onRemoveStatement,
    visualizationType = 'bars',
    onVisualizationTypeChange,
    showStatementAverage = false,
    onShowStatementAverageChange,
    statementsCanBeSkipped = true,
    onStatementsCanBeSkippedChange,
    showResponses = 'instant',
    onShowResponsesChange,
    visualizationTextColor = '#9CA3AF',
    onVisualizationTextColorChange,
    onClose
}) => {
    const handleStatementTextChange = (index, newText) => {
        const newStatements = [...statements];
        newStatements[index] = { ...newStatements[index], text: newText };
        onStatementsChange?.(newStatements);
    };

    return (
        <div className="scales-panel">
            {/* Header */}
            <div className="panel-header">
                <button className="panel-back-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h3 className="panel-title">Scales</h3>
                <button className="panel-close-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="panel-content">
                {/* Visualization Type */}
                <div className="scales-section">
                    <label className="scales-section-label">Visualization type</label>
                    <div className="viz-type-options">
                        <button
                            className={`viz-type-btn ${visualizationType === 'bars' ? 'active' : ''}`}
                            onClick={() => onVisualizationTypeChange?.('bars')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="2" y="14" width="4" height="4" fill="currentColor" />
                                <rect x="8" y="8" width="4" height="10" fill="currentColor" />
                                <rect x="14" y="4" width="4" height="14" fill="currentColor" />
                            </svg>
                        </button>
                        <button
                            className={`viz-type-btn ${visualizationType === 'dots' ? 'active' : ''}`}
                            onClick={() => onVisualizationTypeChange?.('dots')}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="4" cy="4" r="2" fill="currentColor" />
                                <circle cx="10" cy="4" r="2" fill="currentColor" />
                                <circle cx="16" cy="4" r="2" fill="currentColor" />
                                <circle cx="4" cy="10" r="2" fill="currentColor" />
                                <circle cx="10" cy="10" r="2" fill="currentColor" />
                                <circle cx="16" cy="10" r="2" fill="currentColor" />
                                <circle cx="4" cy="16" r="2" fill="currentColor" />
                                <circle cx="10" cy="16" r="2" fill="currentColor" />
                                <circle cx="16" cy="16" r="2" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Statements Section */}
                <div className="scales-section">
                    <label className="scales-section-label">Statements</label>

                    <div className="statements-list">
                        {statements.map((statement, index) => (
                            <div key={statement.id || index} className="statement-item-row">
                                <div
                                    className="statement-color-dot"
                                    style={{ backgroundColor: statementColors[index % statementColors.length] }}
                                />
                                <input
                                    type="text"
                                    value={statement.text}
                                    onChange={(e) => handleStatementTextChange(index, e.target.value)}
                                    placeholder={`Statement ${index + 1}`}
                                    className="statement-input"
                                />
                                {statements.length > 1 && (
                                    <button
                                        className="remove-statement-btn"
                                        onClick={() => onRemoveStatement?.(statement.id)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {statements.length < 10 && (
                        <button className="add-statement-btn" onClick={onAddStatement}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Add statement
                        </button>
                    )}
                </div>

                {/* Toggle Options */}
                <div className="scales-section">
                    <div className="toggle-row">
                        <label>Show statement average</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showStatementAverage}
                                onChange={(e) => onShowStatementAverageChange?.(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="toggle-row">
                        <label>Statements can be skipped</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={statementsCanBeSkipped}
                                onChange={(e) => onStatementsCanBeSkippedChange?.(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Show responses */}
                <div className="scales-section">
                    <div className="show-responses-header">
                        <label className="scales-section-label">Show responses</label>
                        <button className="apply-to-all-btn">Apply to all</button>
                    </div>

                    <div className="radio-options">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="showResponses"
                                value="instant"
                                checked={showResponses === 'instant'}
                                onChange={(e) => onShowResponsesChange?.(e.target.value)}
                            />
                            <span className="radio-circle"></span>
                            <span className="radio-label">Instant responses</span>
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="showResponses"
                                value="on-click"
                                checked={showResponses === 'on-click'}
                                onChange={(e) => onShowResponsesChange?.(e.target.value)}
                            />
                            <span className="radio-circle"></span>
                            <span className="radio-label">Responses on click</span>
                            <span className="recommended-badge">Recommended</span>
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="showResponses"
                                value="private"
                                checked={showResponses === 'private'}
                                onChange={(e) => onShowResponsesChange?.(e.target.value)}
                            />
                            <span className="radio-circle"></span>
                            <span className="radio-label">Private responses</span>
                        </label>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Text / Visualization text color */}
                <div className="scales-section">
                    <label className="scales-section-label">Text</label>
                    <div className="setting-row-inline">
                        <label>Visualization text color</label>
                        <div className="color-picker-group">
                            <span className="color-indicator" style={{ color: '#34A853' }}>✦</span>
                            <input
                                type="color"
                                value={visualizationTextColor}
                                onChange={(e) => onVisualizationTextColorChange?.(e.target.value)}
                                className="color-input"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
