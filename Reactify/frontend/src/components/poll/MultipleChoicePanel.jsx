import React, { useState } from 'react';
import './MultipleChoicePanel.css';

// Import visualization type icons
import BarChartIcon from '../../assets/icons/bar-chart-alt-2.svg';
import DonutChartIcon from '../../assets/icons/round-donut-large.svg';
import PieChartIcon from '../../assets/icons/pie-chart-fill.svg';
import DotsIcon from '../../assets/icons/circle-grid_11809146.svg';
import ImageIcon from '../../assets/icons/image-1.svg';

export const MultipleChoicePanel = ({
    visualizationType,
    onVisualizationChange,
    showAsPercentage,
    onShowAsPercentageChange,
    options,
    onOptionChange,
    onOptionColorChange,
    onOptionRemove,
    onOptionImageUpload,
    onOptionImageRemove,
    onAddOption,
    chooseCorrectAnswers,
    onChooseCorrectAnswersChange,
    selectMultiple,
    onSelectMultipleChange,
    showResponses,
    onShowResponsesChange,
    visualizationTextColor = '#9CA3AF',
    onVisualizationTextColorChange,
    segmentation = 'none',
    onSegmentationChange,
    onClose
}) => {
    const visualizationTypes = [
        { id: 'bar', icon: BarChartIcon },
        { id: 'donut', icon: DonutChartIcon },
        { id: 'pie', icon: PieChartIcon },
        { id: 'dots', icon: DotsIcon }
    ];

    const getVisualizationIcon = (type) => {
        const iconMap = {
            bar: BarChartIcon,
            donut: DonutChartIcon,
            pie: PieChartIcon,
            dots: DotsIcon
        };
        return <img src={iconMap[type]} alt={type} className="viz-icon-img" />;
    };

    return (
        <div className="mc-panel">
            <div className="mc-panel-container">
                {/* Header */}
                <div className="mc-panel-header">
                    <div className="mc-header-left">
                        <button className="mc-back-btn" onClick={onClose}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <h3 className="mc-panel-title">Multiple Choice</h3>
                    </div>
                    <button className="mc-close-btn" onClick={onClose}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="mc-panel-content">
                    {/* Visualization Type Section */}
                    <div className="mc-section">
                        <label className="mc-section-label">Visualization type</label>
                        <div className="visualization-options">
                            {visualizationTypes.map((type) => (
                                <button
                                    key={type.id}
                                    className={`viz-option ${visualizationType === type.id ? 'active' : ''}`}
                                    onClick={() => onVisualizationChange(type.id)}
                                >
                                    {getVisualizationIcon(type.id)}
                                </button>
                            ))}
                        </div>

                        <div className="setting-row">
                            <div className="setting-row-left">
                                <span className="setting-row-label">Show responses as percentage</span>
                            </div>
                            <div className="setting-row-right">
                                <button className="info-icon-btn">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" fill="none" />
                                        <path d="M7 6v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                        <circle cx="7" cy="4.5" r="0.6" fill="currentColor" />
                                    </svg>
                                </button>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={showAsPercentage}
                                        onChange={(e) => onShowAsPercentageChange(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    {/* Options Section */}
                    <div className="mc-section">
                        <label className="mc-section-label">Options</label>
                        <div className="options-list">
                            {options.map((option, index) => (
                                <div key={option.id} className="option-row">
                                    <div className="option-pill">
                                        <label className="option-color-picker">
                                            <input
                                                type="color"
                                                value={option.color}
                                                onChange={(e) => onOptionColorChange && onOptionColorChange(option.id, e.target.value)}
                                                className="color-input-hidden"
                                            />
                                            <div
                                                className="option-color-dot"
                                                style={{ backgroundColor: option.color }}
                                                title="Click to change color"
                                            ></div>
                                        </label>
                                        <input
                                            type="text"
                                            className="option-input"
                                            placeholder={`Option ${index + 1}`}
                                            value={option.text}
                                            onChange={(e) => onOptionChange(option.id, e.target.value)}
                                        />
                                    </div>
                                    <div className="option-actions">
                                        {visualizationType === 'bar' && (
                                            option.image ? (
                                                <div className="option-image-preview" onClick={() => onOptionImageUpload(option.id)}>
                                                    <img src={option.image} alt="Option" />
                                                    <button
                                                        className="image-remove-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onOptionImageRemove && onOptionImageRemove(option.id);
                                                        }}
                                                        title="Remove image"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="option-action-btn"
                                                    onClick={() => onOptionImageUpload(option.id)}
                                                    title="Add image"
                                                >
                                                    <img src={ImageIcon} alt="Add image" className="action-icon" />
                                                </button>
                                            )
                                        )}
                                        <button
                                            className="option-action-btn option-delete-btn"
                                            onClick={() => onOptionRemove(option.id)}
                                            title="Remove option"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {options.length < 6 && (
                            <button className="add-option-btn" onClick={onAddOption}>
                                + Add option
                            </button>
                        )}
                    </div>

                    {/* Settings Toggles */}
                    <div className="mc-section">
                        <div className="setting-row">
                            <div className="setting-row-left">
                                <span className="setting-row-label">Choose correct answers</span>
                                <button className="info-icon-btn">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" fill="none" />
                                        <path d="M7 6v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                        <circle cx="7" cy="4.5" r="0.6" fill="currentColor" />
                                    </svg>
                                </button>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={chooseCorrectAnswers}
                                    onChange={(e) => onChooseCorrectAnswersChange(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-row">
                            <span className="setting-row-label">Select multiple options</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={selectMultiple}
                                    onChange={(e) => onSelectMultipleChange(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    {/* Show Responses Section */}
                    <div className="mc-section">
                        <div className="show-responses-header">
                            <label className="mc-section-label">Show responses</label>
                            <button className="apply-all-btn">Apply to all</button>
                        </div>

                        <div className="radio-options">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="showResponses"
                                    value="instant"
                                    checked={showResponses === 'instant'}
                                    onChange={() => onShowResponsesChange('instant')}
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
                                    onChange={() => onShowResponsesChange('on-click')}
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
                                    onChange={() => onShowResponsesChange('private')}
                                />
                                <span className="radio-circle"></span>
                                <span className="radio-label">Private responses</span>
                            </label>
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    {/* Text Section */}
                    <div className="mc-section">
                        <label className="mc-section-label">Text</label>

                        <div className="setting-row">
                            <div className="setting-row-left">
                                <span className="setting-row-label">Visualization text color</span>
                                <div className="premium-star">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <circle cx="7" cy="7" r="7" fill="#C3E88D" />
                                        <path d="M7 3.5L8.1 5.8L10.5 6.1L8.8 7.8L9.2 10.2L7 9L4.8 10.2L5.2 7.8L3.5 6.1L5.9 5.8L7 3.5Z" fill="#1A1A1A" />
                                    </svg>
                                </div>
                            </div>

                            <div className="color-picker-trigger">
                                <div className="color-preview" style={{ backgroundColor: '#9CA3AF' }}></div>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    {/* Segmentation Section */}
                    <div className="mc-section">
                        <div className="segmentation-header">
                            <label className="mc-section-label">Segmentation</label>
                            <div className="premium-star">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="7" fill="#C3E88D" />
                                    <path d="M7 3.5L8.1 5.8L10.5 6.1L8.8 7.8L9.2 10.2L7 9L4.8 10.2L5.2 7.8L3.5 6.1L5.9 5.8L7 3.5Z" fill="#1A1A1A" />
                                </svg>
                            </div>
                        </div>

                        <div className="segmentation-dropdown">
                            <span>No segmentation</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
