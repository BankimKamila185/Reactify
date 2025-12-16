import React, { useState, useRef, useEffect } from 'react';
import './SlideSettingsPanel.css';

const questionTypes = {
    interactive: [
        { id: 'multiple-choice', name: 'Multiple Choice', icon: 'bar-chart' },
        { id: 'word-cloud', name: 'Word Cloud', icon: 'word-cloud' },
        { id: 'open-ended', name: 'Open Ended', icon: 'open-ended' },
        { id: 'scales', name: 'Scales', icon: 'scales' },
        { id: 'ranking', name: 'Ranking', icon: 'ranking' },
        { id: 'qa', name: 'Q&A', icon: 'qa' },
        { id: 'guess-number', name: 'Guess the Number', icon: 'guess' },
        { id: '100-points', name: '100 Points', icon: 'points' },
        { id: '2x2-grid', name: '2 x 2 Grid', icon: 'grid' },
        { id: 'pin-image', name: 'Pin on Image', icon: 'pin' },
    ],
    quiz: [
        { id: 'select-answer', name: 'Select Answer', icon: 'bar-chart' },
    ]
};

const presetColors = [
    '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#EF4444', '#F97316',
    '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#1D4ED8', '#4F46E5', '#7C3AED',
    '#FFFFFF', '#F3F4F6', '#D1D5DB', '#9CA3AF',
    '#6B7280', '#4B5563', '#374151', '#1F2937',
];

const QuestionTypeIcon = ({ type, size = 18 }) => {
    switch (type) {
        case 'bar-chart':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="9" width="3" height="7" rx="1" fill="#6366F1" />
                    <rect x="7" y="4" width="3" height="12" rx="1" fill="#6366F1" />
                    <rect x="12" y="7" width="3" height="9" rx="1" fill="#6366F1" />
                </svg>
            );
        case 'word-cloud':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <circle cx="6" cy="7" r="3" fill="#EF4444" />
                    <circle cx="12" cy="7" r="2.5" fill="#F97316" />
                    <circle cx="9" cy="12" r="2" fill="#EF4444" />
                </svg>
            );
        case 'open-ended':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <ellipse cx="9" cy="10" rx="6" ry="5" fill="#F9A8D4" />
                </svg>
            );
        case 'scales':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <rect x="6" y="3" width="6" height="12" rx="3" fill="#A78BFA" />
                </svg>
            );
        case 'ranking':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <rect x="3" y="3" width="5" height="4" rx="1" fill="#10B981" />
                    <rect x="10" y="3" width="5" height="4" rx="1" fill="#10B981" />
                    <rect x="3" y="9" width="5" height="4" rx="1" fill="#10B981" />
                    <rect x="10" y="9" width="5" height="4" rx="1" fill="#D1D5DB" />
                </svg>
            );
        case 'qa':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <circle cx="6" cy="8" r="4" fill="#FDA4AF" />
                    <circle cx="12" cy="10" r="3" fill="#FCD34D" />
                </svg>
            );
        case 'guess':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <text x="9" y="13" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6366F1">?</text>
                </svg>
            );
        case 'points':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <rect x="3" y="5" width="4" height="3" rx="1" fill="#6366F1" />
                    <rect x="3" y="10" width="4" height="3" rx="1" fill="#6366F1" />
                    <rect x="9" y="5" width="6" height="3" rx="1" fill="#93C5FD" />
                    <rect x="9" y="10" width="4" height="3" rx="1" fill="#93C5FD" />
                </svg>
            );
        case 'grid':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <rect x="3" y="3" width="5" height="5" rx="1" fill="#FECACA" />
                    <rect x="10" y="3" width="5" height="5" rx="1" fill="#FECACA" />
                    <rect x="3" y="10" width="5" height="5" rx="1" fill="#FECACA" />
                    <rect x="10" y="10" width="5" height="5" rx="1" fill="#FECACA" />
                </svg>
            );
        case 'pin':
            return (
                <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
                    <path d="M9 2C6.5 2 5 4 5 6.5C5 10 9 15 9 15C9 15 13 10 13 6.5C13 4 11.5 2 9 2Z" fill="#8B5CF6" />
                    <circle cx="9" cy="6.5" r="1.5" fill="white" />
                </svg>
            );
        default:
            return null;
    }
};

export const SlideSettingsPanel = ({
    questionType = 'multiple-choice',
    onQuestionTypeChange,
    onSlideTypeHover,
    backgroundColor = '#6366F1',
    onBackgroundColorChange,
    backgroundImage,
    onBackgroundImageChange,
    showInstructionsBar,
    onShowInstructionsBarChange,
    showQRCode,
    onShowQRCodeChange,
    onResetToTheme,
    onClose
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [customColor, setCustomColor] = useState(backgroundColor);
    const [imagePreview, setImagePreview] = useState(backgroundImage || null);
    const [slideImage, setSlideImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const colorPickerRef = useRef(null);
    const questionDropdownRef = useRef(null);
    const imagePickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const slideImageInputRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setIsColorPickerOpen(false);
            }
            if (questionDropdownRef.current && !questionDropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (imagePickerRef.current && !imagePickerRef.current.contains(event.target)) {
                setIsImagePickerOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCurrentType = () => {
        const allTypes = [...questionTypes.interactive, ...questionTypes.quiz];
        return allTypes.find(t => t.id === questionType) || questionTypes.interactive[0];
    };

    const handleTypeSelect = (typeId) => {
        if (onSlideTypeHover) onSlideTypeHover(null); // Clear hover on select
        if (onQuestionTypeChange) {
            onQuestionTypeChange(typeId);
        }
        setIsDropdownOpen(false);
    };

    const handleColorSelect = (color) => {
        setCustomColor(color);
        if (onBackgroundColorChange) {
            onBackgroundColorChange(color);
        }
    };

    const handleCustomColorChange = (e) => {
        const color = e.target.value;
        setCustomColor(color);
        if (onBackgroundColorChange) {
            onBackgroundColorChange(color);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                if (onBackgroundImageChange) {
                    onBackgroundImageChange(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
        setIsImagePickerOpen(false);
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        if (onBackgroundImageChange) {
            onBackgroundImageChange(null);
        }
        setIsImagePickerOpen(false);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSlideImageUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSlideImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSlideImageInputChange = (e) => {
        const file = e.target.files[0];
        handleSlideImageUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleSlideImageUpload(file);
    };

    const removeSlideImage = () => {
        setSlideImage(null);
    };

    const currentType = getCurrentType();

    return (
        <div className="slide-settings-panel">
            <div className="slide-settings-container">
                {/* Header */}
                <div className="slide-settings-header">
                    <h3 className="slide-settings-title">Slide</h3>
                    <button className="slide-close-btn" onClick={onClose}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="slide-settings-content">
                    {/* Question Type Section */}
                    <div className="slide-setting-section">
                        <label className="slide-setting-label">Question type</label>
                        <div className="question-type-wrapper" ref={questionDropdownRef}>
                            <div
                                className={`question-type-selector ${isDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="selected-type">
                                    <QuestionTypeIcon type={currentType.icon} />
                                    <span>{currentType.name}</span>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="dropdown-arrow">
                                    <path d="M4 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {isDropdownOpen && (
                                <div className="question-type-dropdown" onMouseLeave={() => onSlideTypeHover?.(null)}>
                                    <div className="dropdown-section">
                                        <span className="dropdown-section-title">Interactive questions</span>
                                        {questionTypes.interactive.map((type) => (
                                            <div
                                                key={type.id}
                                                className={`dropdown-item ${questionType === type.id ? 'selected' : ''}`}
                                                onClick={() => handleTypeSelect(type.id)}
                                                onMouseEnter={() => onSlideTypeHover?.(type.id)}
                                            >
                                                <QuestionTypeIcon type={type.icon} />
                                                <span>{type.name}</span>
                                                {questionType === type.id && (
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="check-icon">
                                                        <path d="M3 8l3 3 7-7" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="dropdown-section">
                                        <span className="dropdown-section-title">Quiz competitions</span>
                                        {questionTypes.quiz.map((type) => (
                                            <div
                                                key={type.id}
                                                className={`dropdown-item ${questionType === type.id ? 'selected' : ''}`}
                                                onClick={() => handleTypeSelect(type.id)}
                                                onMouseEnter={() => onSlideTypeHover?.(type.id)}
                                            >
                                                <QuestionTypeIcon type={type.icon} />
                                                <span>{type.name}</span>
                                                {questionType === type.id && (
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="check-icon">
                                                        <path d="M3 8l3 3 7-7" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    {/* Image Section */}
                    <div className="slide-setting-section">
                        <label className="slide-setting-label">Image</label>
                        <p className="slide-setting-help">We support png, gif, jpg, jpeg and svg</p>

                        <input
                            type="file"
                            ref={slideImageInputRef}
                            onChange={handleSlideImageInputChange}
                            accept="image/png,image/gif,image/jpg,image/jpeg,image/svg+xml"
                            style={{ display: 'none' }}
                        />

                        {slideImage ? (
                            <div className="slide-image-preview">
                                <img src={slideImage} alt="Slide" />
                                <button
                                    className="remove-slide-image-btn"
                                    onClick={removeSlideImage}
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M10 4L4 10M4 4l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div
                                className={`image-upload-area ${isDragging ? 'dragging' : ''}`}
                                onClick={() => slideImageInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="upload-icon">
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <rect x="4" y="6" width="28" height="24" rx="3" stroke="#C4C4C4" strokeWidth="2" fill="none" />
                                        <path d="M4 22l8-8 5 5 7-7 8 8" stroke="#C4C4C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="13" r="2.5" fill="#C4C4C4" />
                                    </svg>
                                </div>
                                <div className="upload-text-wrapper">
                                    <span className="upload-text">Drag and drop or</span>
                                    <span className="upload-link">Click to add image</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="section-divider"></div>

                    {/* Background Section */}
                    <div className="slide-setting-section">
                        <label className="slide-setting-label">Background</label>

                        <div className="background-option">
                            <span className="background-option-label">Background color</span>
                            <div className="color-picker-wrapper" ref={colorPickerRef}>
                                <div
                                    className={`color-picker-trigger ${isColorPickerOpen ? 'active' : ''}`}
                                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                >
                                    <div
                                        className="color-preview-box"
                                        style={{ backgroundColor: customColor }}
                                    ></div>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="dropdown-arrow-small">
                                        <path d="M3 4.5l3 3 3-3" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {isColorPickerOpen && (
                                    <div className="color-picker-dropdown">
                                        <div className="color-picker-header">
                                            <span>Choose color</span>
                                        </div>
                                        <div className="color-grid">
                                            {presetColors.map((color) => (
                                                <button
                                                    key={color}
                                                    className={`color-swatch ${customColor === color ? 'selected' : ''}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => handleColorSelect(color)}
                                                >
                                                    {customColor === color && (
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path
                                                                d="M2 6l3 3 5-5"
                                                                stroke={['#FFFFFF', '#F3F4F6', '#D1D5DB'].includes(color) ? '#1A1A1A' : '#FFFFFF'}
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="custom-color-section">
                                            <label className="custom-color-label">Custom color</label>
                                            <div className="custom-color-input-wrapper">
                                                <input
                                                    type="color"
                                                    value={customColor}
                                                    onChange={handleCustomColorChange}
                                                    className="color-input-native"
                                                />
                                                <input
                                                    type="text"
                                                    value={customColor.toUpperCase()}
                                                    onChange={(e) => handleColorSelect(e.target.value)}
                                                    className="color-input-text"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="background-option">
                            <span className="background-option-label">Background image</span>
                            <div className="image-picker-wrapper" ref={imagePickerRef}>
                                {imagePreview ? (
                                    <div
                                        className="image-preview-thumb"
                                        onClick={() => setIsImagePickerOpen(!isImagePickerOpen)}
                                    >
                                        <img src={imagePreview} alt="Background" />
                                    </div>
                                ) : (
                                    <button
                                        className="add-btn"
                                        onClick={() => setIsImagePickerOpen(!isImagePickerOpen)}
                                    >
                                        + Add
                                    </button>
                                )}

                                {isImagePickerOpen && (
                                    <div className="image-picker-dropdown">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/png,image/gif,image/jpg,image/jpeg,image/svg+xml"
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            className="image-picker-option"
                                            onClick={triggerFileInput}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                            <span>Upload image</span>
                                        </button>
                                        {imagePreview && (
                                            <button
                                                className="image-picker-option remove"
                                                onClick={handleRemoveImage}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <span>Remove image</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button className="reset-link" onClick={onResetToTheme}>Reset to theme defaults</button>
                    </div>

                    <div className="section-divider"></div>

                    {/* Joining Instructions Section */}
                    <div className="slide-setting-section">
                        <label className="slide-setting-label">Joining instructions</label>

                        <div className="instruction-option">
                            <span className="instruction-label">Show instructions bar</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={showInstructionsBar}
                                    onChange={(e) => onShowInstructionsBarChange(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="instruction-option">
                            <div className="instruction-label-with-info">
                                <span className="instruction-label">Show QR code</span>
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
                                    checked={showQRCode}
                                    onChange={(e) => onShowQRCodeChange(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
