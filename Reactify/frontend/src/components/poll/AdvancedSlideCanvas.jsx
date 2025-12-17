import React, { useState } from 'react';
import './AdvancedSlideCanvas.css';

// Guess the Number Canvas
export const GuessNumberCanvas = ({
    slide,
    onQuestionChange,
    onAnswerChange,
    joinCode,
    isEditorMode = false
}) => {
    const correctAnswer = slide?.correctAnswer || '';
    const question = slide?.question || '';

    return (
        <div className="advanced-canvas guess-number-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="guess-content">
                    {isEditorMode ? (
                        <input
                            type="text"
                            className="question-input"
                            placeholder="What number should they guess?"
                            value={question}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    ) : (
                        <h2 className="question-text">{question || 'What number should they guess?'}</h2>
                    )}

                    <div className="guess-input-preview">
                        <div className="number-display">
                            <span className="question-mark">?</span>
                        </div>
                        {isEditorMode && (
                            <div className="correct-answer-input">
                                <label>Correct Answer:</label>
                                <input
                                    type="number"
                                    value={correctAnswer}
                                    onChange={(e) => onAnswerChange && onAnswerChange(e.target.value)}
                                    placeholder="Enter the correct number"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 100 Points Canvas
export const HundredPointsCanvas = ({
    slide,
    onQuestionChange,
    onItemsChange,
    joinCode,
    isEditorMode = false
}) => {
    const items = slide?.pointItems || [
        { id: 1, text: 'Option 1', points: 0 },
        { id: 2, text: 'Option 2', points: 0 },
        { id: 3, text: 'Option 3', points: 0 }
    ];

    return (
        <div className="advanced-canvas hundred-points-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="points-content">
                    {isEditorMode ? (
                        <input
                            type="text"
                            className="question-input"
                            placeholder="Distribute 100 points across..."
                            value={slide?.question || ''}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    ) : (
                        <h2 className="question-text">{slide?.question || 'Distribute 100 points'}</h2>
                    )}

                    <div className="points-items">
                        {items.map((item, index) => (
                            <div key={item.id} className="point-item">
                                <div className="point-bar" style={{ width: `${item.points}%` }}></div>
                                <span className="point-label">{item.text}</span>
                                <span className="point-value">{item.points} pts</span>
                            </div>
                        ))}
                    </div>

                    <div className="points-total">
                        <span>Total: 100 points to distribute</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2x2 Grid Canvas
export const TwoByTwoGridCanvas = ({
    slide,
    onQuestionChange,
    onLabelsChange,
    joinCode,
    isEditorMode = false
}) => {
    const labels = slide?.gridLabels || {
        top: 'High',
        bottom: 'Low',
        left: 'Low',
        right: 'High'
    };

    return (
        <div className="advanced-canvas grid-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="grid-content">
                    {isEditorMode ? (
                        <input
                            type="text"
                            className="question-input"
                            placeholder="Place your answer on the grid..."
                            value={slide?.question || ''}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    ) : (
                        <h2 className="question-text">{slide?.question || 'Place your answer on the grid'}</h2>
                    )}

                    <div className="grid-container">
                        <span className="grid-label top">{labels.top}</span>
                        <span className="grid-label bottom">{labels.bottom}</span>
                        <span className="grid-label left">{labels.left}</span>
                        <span className="grid-label right">{labels.right}</span>
                        <div className="grid-area">
                            <div className="grid-quadrant q1"></div>
                            <div className="grid-quadrant q2"></div>
                            <div className="grid-quadrant q3"></div>
                            <div className="grid-quadrant q4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Pin on Image Canvas
export const PinOnImageCanvas = ({
    slide,
    onQuestionChange,
    onImageChange,
    joinCode,
    isEditorMode = false
}) => {
    const imageUrl = slide?.pinImage || null;

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file && onImageChange) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageChange(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="advanced-canvas pin-image-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="pin-content">
                    {isEditorMode ? (
                        <input
                            type="text"
                            className="question-input"
                            placeholder="Where would you place...?"
                            value={slide?.question || ''}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    ) : (
                        <h2 className="question-text">{slide?.question || 'Pin your answer on the image'}</h2>
                    )}

                    <div className="pin-image-area">
                        {imageUrl ? (
                            <div className="image-with-pin">
                                <img src={imageUrl} alt="Pin area" />
                                <div className="pin-marker">📍</div>
                            </div>
                        ) : (
                            <div
                                className="image-upload-placeholder"
                                onClick={() => isEditorMode && document.getElementById('pin-image-upload').click()}
                            >
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <rect x="6" y="10" width="36" height="28" rx="4" stroke="#9CA3AF" strokeWidth="2" />
                                    <path d="M24 18v12M18 24h12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <p>{isEditorMode ? 'Click to upload an image' : 'No image set'}</p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="pin-image-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quick Form Canvas (Premium Placeholder)
export const QuickFormCanvas = ({
    slide,
    onQuestionChange,
    joinCode,
    isEditorMode = false
}) => {
    return (
        <div className="advanced-canvas quick-form-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="premium-content">
                    <div className="premium-badge">✨ Premium Feature</div>
                    <h2>Quick Form</h2>
                    <p>Create forms with multiple input types: text, email, phone, dropdown, and more.</p>
                    <button className="upgrade-btn">Upgrade to unlock</button>
                </div>
            </div>
        </div>
    );
};

// Select Answer Quiz Canvas
export const SelectAnswerCanvas = ({
    slide,
    onQuestionChange,
    onOptionsChange,
    joinCode,
    isEditorMode = false
}) => {
    const options = slide?.options || [
        { id: 1, text: 'Option A', isCorrect: false },
        { id: 2, text: 'Option B', isCorrect: true },
        { id: 3, text: 'Option C', isCorrect: false },
        { id: 4, text: 'Option D', isCorrect: false }
    ];

    return (
        <div className="advanced-canvas quiz-canvas select-answer-canvas">
            <div className="canvas-header quiz-header">
                <div className="quiz-badge">🏆 QUIZ</div>
                <div className="join-info">
                    <span>reacti.com</span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="quiz-content">
                    {isEditorMode ? (
                        <input
                            type="text"
                            className="question-input quiz-question"
                            placeholder="Enter your quiz question..."
                            value={slide?.question || ''}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    ) : (
                        <h2 className="question-text">{slide?.question || 'Quiz Question'}</h2>
                    )}

                    <div className="quiz-options">
                        {options.map((option, index) => (
                            <div
                                key={option.id}
                                className={`quiz-option ${option.isCorrect ? 'correct' : ''}`}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                <span className="option-text">{option.text}</span>
                                {option.isCorrect && <span className="correct-badge">✓</span>}
                            </div>
                        ))}
                    </div>

                    <div className="quiz-timer">
                        <span>⏱️ Time limit: 30 seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Type Answer Quiz Canvas
export const TypeAnswerCanvas = ({
    slide,
    onQuestionChange,
    onCorrectAnswerChange,
    joinCode,
    isEditorMode = false
}) => {
    return (
        <div className="advanced-canvas quiz-canvas type-answer-canvas">
            <div className="canvas-header quiz-header">
                <div className="quiz-badge">🏆 QUIZ</div>
                <div className="join-info">
                    <span>reacti.com</span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="quiz-content">
                    {isEditorMode ? (
                        <input
                            type="text"
                            className="question-input quiz-question"
                            placeholder="Enter your quiz question..."
                            value={slide?.question || ''}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    ) : (
                        <h2 className="question-text">{slide?.question || 'Type your answer'}</h2>
                    )}

                    <div className="type-answer-area">
                        <div className="answer-input-preview">
                            <input
                                type="text"
                                placeholder="Type your answer here..."
                                disabled={!isEditorMode}
                            />
                        </div>

                        {isEditorMode && (
                            <div className="correct-answers">
                                <label>Accepted answers (comma separated):</label>
                                <input
                                    type="text"
                                    placeholder="answer1, answer2, ..."
                                    value={slide?.correctAnswers?.join(', ') || ''}
                                    onChange={(e) => onCorrectAnswerChange && onCorrectAnswerChange(e.target.value.split(',').map(s => s.trim()))}
                                />
                            </div>
                        )}
                    </div>

                    <div className="quiz-timer">
                        <span>⏱️ Time limit: 30 seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Import Slides Canvas (Google Slides, PowerPoint, PDF)
export const ImportSlidesCanvas = ({
    importType = 'google-slides',
    onFileSelect,
    joinCode,
    isEditorMode = true
}) => {
    const getImportInfo = () => {
        switch (importType) {
            case 'google-slides':
                return { name: 'Google Slides', icon: '📊', color: '#FBBC04', accept: '' };
            case 'powerpoint':
                return { name: 'PowerPoint', icon: '📑', color: '#D24726', accept: '.pptx,.ppt' };
            case 'pdf':
                return { name: 'PDF', icon: '📄', color: '#FF0000', accept: '.pdf' };
            default:
                return { name: 'File', icon: '📁', color: '#6B7280', accept: '' };
        }
    };

    const info = getImportInfo();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && onFileSelect) {
            onFileSelect(file);
        }
    };

    return (
        <div className="advanced-canvas import-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Import from <strong>{info.name}</strong></span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="import-content">
                    <div className="import-icon" style={{ background: info.color }}>
                        {info.icon}
                    </div>
                    <h2>Import from {info.name}</h2>

                    {importType === 'google-slides' ? (
                        <div className="google-import">
                            <input
                                type="text"
                                placeholder="Paste Google Slides URL..."
                                className="url-input"
                            />
                            <button className="import-btn">Import</button>
                        </div>
                    ) : (
                        <div className="file-import">
                            <input
                                type="file"
                                id={`import-${importType}`}
                                accept={info.accept}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                className="upload-btn"
                                onClick={() => document.getElementById(`import-${importType}`).click()}
                            >
                                Choose {info.name} file
                            </button>
                            <p className="upload-hint">or drag and drop your file here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
