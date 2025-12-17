import React, { useState } from 'react';
import './WordCloudPanel.css';

// Color palette options
const colorPalettes = [
    ['#5B7FFF', '#FF8B8B', '#8B7FFF', '#7FEFBD', '#FFB366', '#FF7FB3', '#A5B4C9'],
    ['#8B9DC3', '#C9A7C7', '#D4A5A5', '#B8A9C9', '#E8C4C4', '#A5B4C9', '#D4C4B0']
];

export const WordCloudPanel = ({
    maxWordsPerParticipant = 3,
    onMaxWordsChange,
    profanityFilter = false,
    onProfanityFilterChange,
    // New props for Reactify-style settings
    numberOfResponses = 'unlimited',
    onNumberOfResponsesChange,
    showResponses = 'instant',
    onShowResponsesChange,
    visualizationTextColor = '#9CA3AF',
    onVisualizationTextColorChange,
    colorPalette = 0,
    onColorPaletteChange,
    onClose
}) => {
    const [activeColorPalette, setActiveColorPalette] = useState(colorPalette);

    const handleColorPaletteChange = (index) => {
        setActiveColorPalette(index);
        onColorPaletteChange?.(index);
    };

    return (
        <div className="word-cloud-panel">
            {/* Header */}
            <div className="panel-header">
                <button className="panel-back-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h3 className="panel-title">Word Cloud</h3>
                <button className="panel-close-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="panel-content">
                {/* Word Cloud Section */}
                <div className="wc-section">
                    <label className="wc-section-label">Word Cloud</label>

                    {/* Color Palette */}
                    <div className="color-palette-row">
                        {colorPalettes[activeColorPalette].map((color, index) => (
                            <button
                                key={index}
                                className="color-dot"
                                style={{ background: color }}
                                title={`Color ${index + 1}`}
                            />
                        ))}
                        <button className="add-color-btn" title="Add custom color">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Number of responses */}
                <div className="wc-section">
                    <div className="setting-row-inline">
                        <label>Number of responses</label>
                        <select
                            className="wc-select"
                            value={numberOfResponses}
                            onChange={(e) => onNumberOfResponsesChange?.(e.target.value)}
                        >
                            <option value="unlimited">Unlimited</option>
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Show responses */}
                <div className="wc-section">
                    <div className="show-responses-header">
                        <label className="wc-section-label">Show responses</label>
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
                <div className="wc-section">
                    <label className="wc-section-label">Text</label>
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
