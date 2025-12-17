import React from 'react';
import './RankingCanvas.css';

// Colors for ranking items (matching Reactify)
const itemColors = [
    '#5B7FFF', // Blue
    '#FF7B7B', // Coral/Red
    '#8B7FFF', // Purple
    '#7BC8FF', // Light blue
    '#7FEFBD', // Green
    '#FFB366', // Orange
];

export const RankingCanvas = ({
    items = [],
    question = 'Ask your question here...',
    joinCode = '1234 5678',
    onQuestionChange,
    onSelectVisualization,
    isEditorMode = false,
    onCanvasClick,
    isSelected = false
}) => {
    // Default items for preview when none provided
    const displayItems = items.length > 0 ? items : [
        { id: '1', text: 'Item 1' },
        { id: '2', text: 'Item 2' },
        { id: '3', text: 'Item 3' },
        { id: '4', text: 'Item 4' }
    ];

    return (
        <div className="ranking-canvas">
            {/* Slide Container - Same structure as PollCanvas */}
            <div
                className={`ranking-slide-container ${isSelected ? 'selected' : ''}`}
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
                <div className="ranking-canvas-content">
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

                    {/* Ranking Items */}
                    <div
                        className="ranking-items-container"
                        onClick={(e) => { e.stopPropagation(); isEditorMode && onSelectVisualization?.(); }}
                        style={{ cursor: isEditorMode ? 'pointer' : 'default' }}
                    >
                        {displayItems.map((item, index) => (
                            <div key={item.id || index} className="ranking-item">
                                <div className="item-label">{item.text || `Item ${index + 1}`}</div>
                                <div
                                    className="item-bar"
                                    style={{ backgroundColor: itemColors[index % itemColors.length] }}
                                />
                                <div className="item-bar-track" />
                            </div>
                        ))}
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
