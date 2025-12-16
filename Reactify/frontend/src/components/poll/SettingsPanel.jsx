import React from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { ColoredOptionInput } from './ColoredOptionInput';
import { QuestionSettingsPanel } from './QuestionSettingsPanel';
import './SettingsPanel.css';

export const SettingsPanel = ({
    selectedElement = 'visualization',
    pollType = 'Multiple Choice',
    label,
    onLabelChange,
    additionalDetails,
    onAdditionalDetailsChange,
    visualizationType,
    onVisualizationChange,
    showAsPercentage,
    onShowAsPercentageChange,
    options,
    onOptionChange,
    onOptionRemove,
    onOptionImageUpload,
    onAddOption,
    chooseCorrectAnswers,
    onChooseCorrectAnswersChange,
    selectMultiple,
    onSelectMultipleChange,
    showResponses,
    onShowResponsesChange,
    onClose
}) => {
    const visualizationTypes = [
        { id: 'bar', label: 'Bar chart', icon: 'bar' },
        { id: 'donut', label: 'Donut chart', icon: 'donut' },
        { id: 'pie', label: 'Pie chart', icon: 'pie' },
        { id: 'grid', label: 'Grid', icon: 'grid' }
    ];

    const renderVizIcon = (iconType) => {
        switch (iconType) {
            case 'bar':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="14" width="3" height="6" rx="1" fill="currentColor" />
                        <rect x="10" y="8" width="3" height="12" rx="1" fill="currentColor" />
                        <rect x="16" y="11" width="3" height="9" rx="1" fill="currentColor" />
                    </svg>
                );
            case 'donut':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="12" cy="12" r="4" fill="white" />
                        <path d="M12 4a8 8 0 018 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'pie':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.3" />
                        <path d="M12 12V4a8 8 0 018 8z" fill="currentColor" />
                    </svg>
                );
            case 'grid':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="4" y="13" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-panel">
            {/* Show Question Settings when question is selected */}
            {selectedElement === 'question' && (
                <QuestionSettingsPanel
                    label={label}
                    onLabelChange={onLabelChange}
                    additionalDetails={additionalDetails}
                    onAdditionalDetailsChange={onAdditionalDetailsChange}
                />
            )}

            {/* Show Poll Settings when visualization is selected */}
            {selectedElement === 'visualization' && (
                <div className="settings-container">
                    <div className="settings-header">
                        <button className="settings-back-btn" onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12 16L6 10l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <h3 className="settings-title">{pollType}</h3>
                        <button className="settings-close-btn" onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="settings-content">
                        {/* Visualization Type */}
                        <div className="settings-section">
                            <label className="settings-label">Visualization type</label>
                            <div className="viz-type-grid">
                                {visualizationTypes.map(type => (
                                    <button
                                        key={type.id}
                                        className={`viz-type-btn ${visualizationType === type.id ? 'active' : ''}`}
                                        onClick={() => onVisualizationChange(type.id)}
                                        title={type.label}
                                    >
                                        {renderVizIcon(type.icon)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Show as Percentage */}
                        <div className="settings-section">
                            <ToggleSwitch
                                label="Show responses as percentage"
                                checked={showAsPercentage}
                                onChange={onShowAsPercentageChange}
                            />
                        </div>

                        {/* Options */}
                        <div className="settings-section">
                            <label className="settings-label">Options</label>
                            <div className="options-list-settings">
                                {options.map((option, index) => (
                                    <ColoredOptionInput
                                        key={option.id}
                                        option={option}
                                        index={index}
                                        onChange={onOptionChange}
                                        onRemove={onOptionRemove}
                                        onImageUpload={onOptionImageUpload}
                                    />
                                ))}
                            </div>
                            {options.length < 6 && (
                                <button className="add-option-btn-settings" onClick={onAddOption}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Add option
                                </button>
                            )}
                        </div>

                        {/* Advanced Settings */}
                        <div className="settings-section">
                            <ToggleSwitch
                                label={
                                    <span>
                                        Choose correct answers
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 4, opacity: 0.5 }}>
                                            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" fill="none" />
                                            <path d="M7 4v3M7 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                }
                                checked={chooseCorrectAnswers}
                                onChange={onChooseCorrectAnswersChange}
                            />
                        </div>

                        <div className="settings-section">
                            <ToggleSwitch
                                label="Select multiple options"
                                checked={selectMultiple}
                                onChange={onSelectMultipleChange}
                            />
                        </div>

                        {/* Show Responses */}
                        <div className="settings-section">
                            <div className="section-header">
                                <label className="settings-label">Show responses</label>
                                <button className="apply-all-btn">Apply to all</button>
                            </div>

                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="showResponses"
                                        value="instant"
                                        checked={showResponses === 'instant'}
                                        onChange={(e) => onShowResponsesChange(e.target.value)}
                                    />
                                    <div className="radio-content">
                                        <div className="radio-label">Instant responses</div>
                                    </div>
                                </label>

                                <label className="radio-option recommended">
                                    <input
                                        type="radio"
                                        name="showResponses"
                                        value="on-click"
                                        checked={showResponses === 'on-click'}
                                        onChange={(e) => onShowResponsesChange(e.target.value)}
                                    />
                                    <div className="radio-content">
                                        <div className="radio-label">Responses on click</div>
                                        <span className="recommended-badge">Recommended</span>
                                    </div>
                                </label>

                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="showResponses"
                                        value="private"
                                        checked={showResponses === 'private'}
                                        onChange={(e) => onShowResponsesChange(e.target.value)}
                                    />
                                    <div className="radio-content">
                                        <div className="radio-label">Private responses</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
