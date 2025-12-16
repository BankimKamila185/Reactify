import React, { useMemo } from 'react';
import ReactWordcloud from 'react-wordcloud';
import './WordCloudCanvas.css';

// Default words for preview when no responses yet (Mentimeter style)
const defaultWords = [
    { text: 'creative', value: 80 },
    { text: 'fast', value: 65 },
    { text: 'leader', value: 55 },
    { text: 'focus', value: 50 },
    { text: 'bold', value: 45 },
    { text: 'transpiration', value: 40 },
    { text: 'inspiration', value: 35 }
];

// Mentimeter-style pastel color palette
const mentimeterColors = [
    '#8B9DC3', // Soft blue-gray
    '#C9A7C7', // Soft mauve/pink
    '#D4A5A5', // Dusty rose
    '#B8A9C9', // Lavender
    '#E8C4C4', // Light pink
    '#A5B4C9', // Pale blue
    '#D4C4B0', // Warm beige
];

const options = {
    colors: mentimeterColors,
    enableTooltip: false,
    deterministic: true,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSizes: [18, 56],
    fontStyle: 'italic',
    fontWeight: 'normal',
    padding: 3,
    rotations: 0,
    rotationAngles: [0, 0],
    scale: 'sqrt',
    spiral: 'rectangular',
    transitionDuration: 800
};

export const WordCloudCanvas = ({
    words = [],
    question = 'Ask your question here...',
    joinCode = '1234 5678',
    showPreview = true,
    onQuestionChange,
    onSelectVisualization,
    onCanvasClick,
    isSelected = false,
    isEditorMode = false
}) => {
    // Transform words to react-wordcloud format
    const cloudWords = useMemo(() => {
        if (words.length === 0 && showPreview) {
            return defaultWords;
        }
        return words.map(w => ({
            text: w.text,
            value: w.count * 10 // Scale up for better visibility
        }));
    }, [words, showPreview]);

    return (
        <div className="word-cloud-canvas">
            {/* Slide Container - Same structure as PollCanvas */}
            <div
                className={`wc-slide-container ${isSelected ? 'selected' : ''}`}
                onClick={onCanvasClick}
                style={{ cursor: 'pointer' }}
            >
                {/* Header */}
                <div className="canvas-header">
                    <div className="join-pill">
                        Join at <strong>menti.com</strong> | use code <strong>{joinCode}</strong>
                    </div>
                    <div className="logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M4 12L8 6L12 12L16 6V18H12V12L8 18L4 12V18H0V6L4 12Z" fill="#5B7FFF" />
                        </svg>
                        <span>Mentimeter</span>
                    </div>
                </div>

                {/* Content */}
                <div className="wc-canvas-content">
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

                    {/* Word Cloud */}
                    <div
                        className="word-cloud-container"
                        onClick={(e) => { e.stopPropagation(); isEditorMode && onSelectVisualization?.(); }}
                        style={{ cursor: isEditorMode ? 'pointer' : 'default' }}
                    >
                        {cloudWords.length > 0 ? (
                            <ReactWordcloud words={cloudWords} options={options} />
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">☁️</div>
                                <p>Words will appear here as participants submit them</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Response count indicator - bottom right */}
                <div className="response-indicator">
                    <span className="response-count-badge">
                        {words.length > 0 ? words.reduce((sum, w) => sum + w.count, 0) : 0}
                    </span>
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
