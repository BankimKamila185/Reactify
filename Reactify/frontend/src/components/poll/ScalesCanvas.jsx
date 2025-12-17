import React from 'react';
import './ScalesCanvas.css';

// Colors for scale statements (matching Reactify)
const statementColors = [
    '#5B7FFF', // Blue
    '#FF7B7B', // Coral/Red
    '#8B7FFF', // Purple
    '#7BC8FF', // Light blue
    '#7FEFBD', // Green
    '#FFB366', // Orange
];

export const ScalesCanvas = ({
    statements = [],
    question = 'Ask your question here...',
    joinCode = '1234 5678',
    minLabel = 'Strongly disagree',
    maxLabel = 'Strongly agree',
    onQuestionChange,
    onSelectVisualization,
    isEditorMode = false,
    onCanvasClick,
    isSelected = false
}) => {
    // Default statements for preview when none provided
    const displayStatements = statements.length > 0 ? statements : [
        { id: '1', text: 'Statement 1' },
        { id: '2', text: 'Statement 2' },
        { id: '3', text: 'Statement 3' }
    ];

    return (
        <div className="scales-canvas">
            {/* Slide Container - Same structure as PollCanvas */}
            <div
                className={`scales-slide-container ${isSelected ? 'selected' : ''}`}
                onClick={onCanvasClick}
                style={{ cursor: 'pointer' }}
            >
                {/* Header */}
                <div className="canvas-header">
                    <div className="join-pill">
                        Join at <strong>reacti.com</strong> | use code <strong>{joinCode}</strong>
                    </div>
                    <div className="logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M4 12L8 6L12 12L16 6V18H12V12L8 18L4 12V18H0V6L4 12Z" fill="#5B7FFF" />
                        </svg>
                        <span>Reactify</span>
                    </div>
                </div>

                {/* Content */}
                <div className="scales-canvas-content">
                    {/* Question - Editable in editor mode */}
                    <div className="canvas-question">
                        {isEditorMode ? (
                            <input
                                type="text"
                                className="question-input"
                                value={question}
                                onChange={(e) => onQuestionChange?.(e.target.value)}
                                placeholder="Ask your question here..."
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <h1>{question || 'Ask your question here...'}</h1>
                        )}
                    </div>

                    {/* Scale Statements */}
                    <div
                        className="scales-statements-container"
                        onClick={(e) => { e.stopPropagation(); isEditorMode && onSelectVisualization?.(); }}
                        style={{ cursor: isEditorMode ? 'pointer' : 'default' }}
                    >
                        {displayStatements.map((statement, index) => (
                            <div key={statement.id || index} className="scale-statement">
                                <div className="statement-label">{statement.text || `Statement ${index + 1}`}</div>
                                <div className="statement-bar-track">
                                    <div
                                        className="statement-bar-indicator"
                                        style={{
                                            backgroundColor: statementColors[index % statementColors.length],
                                            width: '2px'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Scale Labels */}
                        <div className="scale-labels">
                            <span className="scale-label-left">{minLabel}</span>
                            <span className="scale-label-right">{maxLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Response count indicator - bottom right */}
                <div className="response-indicator">
                    <span className="response-count-badge">0</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" fill="white" />
                        <path d="M8 9C5.33 9 0 10.34 0 13V14H16V13C16 10.34 10.67 9 8 9Z" fill="white" />
                    </svg>
                </div>
            </div>

            {/* Speaker Notes - Same as PollCanvas */}
            <div className="canvas-speaker-notes">
                <span className="speaker-notes-header">Speaker notes</span>
            </div>
        </div>
    );
};
