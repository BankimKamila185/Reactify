import React, { useState } from 'react';
import './RankingPanel.css';

// Colors for ranking items (matching Reactify)
const itemColors = [
    '#5B7FFF', // Blue
    '#FF7B7B', // Coral/Red
    '#8B7FFF', // Purple
    '#7BC8FF', // Light blue
    '#7FEFBD', // Green
    '#FFB366', // Orange
];

export const RankingPanel = ({
    items = [],
    onItemsChange,
    onAddItem,
    onRemoveItem,
    showResponses = 'instant',
    onShowResponsesChange,
    visualizationTextColor = '#9CA3AF',
    onVisualizationTextColorChange,
    onClose
}) => {
    const handleItemTextChange = (index, newText) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], text: newText };
        onItemsChange(newItems);
    };

    return (
        <div className="ranking-panel">
            {/* Header */}
            <div className="panel-header">
                <button className="panel-back-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h3 className="panel-title">Ranking</h3>
                <button className="panel-close-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="panel-content">
                {/* Items Section */}
                <div className="ranking-section">
                    <label className="ranking-section-label">Items</label>

                    <div className="ranking-items-list">
                        {items.map((item, index) => (
                            <div key={item.id || index} className="ranking-item-row">
                                <div
                                    className="item-color-dot"
                                    style={{ backgroundColor: itemColors[index % itemColors.length] }}
                                />
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => handleItemTextChange(index, e.target.value)}
                                    placeholder={`Item ${index + 1}`}
                                    className="item-input"
                                />
                                {items.length > 2 && (
                                    <button
                                        className="remove-item-btn"
                                        onClick={() => onRemoveItem(item.id)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {items.length < 10 && (
                        <button className="add-item-btn" onClick={onAddItem}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Add item
                        </button>
                    )}
                </div>

                <div className="section-divider"></div>

                {/* Show responses */}
                <div className="ranking-section">
                    <div className="show-responses-header">
                        <label className="ranking-section-label">Show responses</label>
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
                <div className="ranking-section">
                    <label className="ranking-section-label">Text</label>
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
