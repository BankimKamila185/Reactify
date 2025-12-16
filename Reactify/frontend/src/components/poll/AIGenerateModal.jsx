import React, { useState } from 'react';
import './AIGenerateModal.css';

export const AIGenerateModal = ({ isOpen, onClose, onGenerate }) => {
    const [prompt, setPrompt] = useState('');
    const [slideType, setSlideType] = useState('multiple-choice');
    const [slideCount, setSlideCount] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedSlides, setGeneratedSlides] = useState([]);
    const [error, setError] = useState('');

    const slideTypes = [
        { id: 'multiple-choice', name: 'Multiple Choice', icon: '📊' },
        { id: 'word-cloud', name: 'Word Cloud', icon: '☁️' },
        { id: 'open-ended', name: 'Open Ended', icon: '💬' },
        { id: 'scales', name: 'Scales', icon: '📏' },
        { id: 'ranking', name: 'Ranking', icon: '🏆' },
    ];

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a topic or description');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedSlides([]);

        try {
            const result = await onGenerate({
                prompt: prompt.trim(),
                slideType,
                count: slideCount
            });

            if (result.slides && result.slides.length > 0) {
                setGeneratedSlides(result.slides);
            } else {
                setError('No slides were generated. Please try a different prompt.');
            }
        } catch (err) {
            setError(err.message || 'Failed to generate slides. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSlides = () => {
        if (generatedSlides.length > 0) {
            onClose(generatedSlides);
        }
    };

    const handleClose = () => {
        setPrompt('');
        setGeneratedSlides([]);
        setError('');
        onClose(null);
    };

    if (!isOpen) return null;

    return (
        <div className="ai-modal-overlay" onClick={handleClose}>
            <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="ai-modal-header">
                    <div className="ai-modal-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>Generate with AI</span>
                    </div>
                    <button className="ai-modal-close" onClick={handleClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="ai-modal-content">
                    {/* Prompt Input */}
                    <div className="ai-form-group">
                        <label>Describe your topic</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="E.g., Create a quiz about climate change with questions about causes, effects, and solutions..."
                            rows={4}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Slide Type Selection */}
                    <div className="ai-form-group">
                        <label>Slide type</label>
                        <div className="ai-slide-types">
                            {slideTypes.map((type) => (
                                <button
                                    key={type.id}
                                    className={`ai-slide-type-btn ${slideType === type.id ? 'active' : ''}`}
                                    onClick={() => setSlideType(type.id)}
                                    disabled={isLoading}
                                >
                                    <span className="icon">{type.icon}</span>
                                    <span className="name">{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Slide Count */}
                    <div className="ai-form-group">
                        <label>Number of slides</label>
                        <div className="ai-slide-count">
                            <button
                                onClick={() => setSlideCount(Math.max(1, slideCount - 1))}
                                disabled={slideCount <= 1 || isLoading}
                            >
                                -
                            </button>
                            <span>{slideCount}</span>
                            <button
                                onClick={() => setSlideCount(Math.min(10, slideCount + 1))}
                                disabled={slideCount >= 10 || isLoading}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="ai-error-message">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 4.5V8.5M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Generated Slides Preview */}
                    {generatedSlides.length > 0 && (
                        <div className="ai-preview-section">
                            <label>Generated Slides Preview</label>
                            <div className="ai-preview-list">
                                {generatedSlides.map((slide, index) => (
                                    <div key={index} className="ai-preview-card">
                                        <div className="preview-number">{index + 1}</div>
                                        <div className="preview-content">
                                            <div className="preview-question">{slide.question}</div>
                                            {slide.options && (
                                                <div className="preview-options">
                                                    {slide.options.slice(0, 3).map((opt, i) => (
                                                        <span key={i} className="preview-option">{opt.text}</span>
                                                    ))}
                                                    {slide.options.length > 3 && (
                                                        <span className="preview-more">+{slide.options.length - 3} more</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="ai-modal-footer">
                    <button className="ai-btn-secondary" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </button>
                    {generatedSlides.length > 0 ? (
                        <button className="ai-btn-primary" onClick={handleAddSlides}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Add {generatedSlides.length} Slides
                        </button>
                    ) : (
                        <button className="ai-btn-primary" onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                            {isLoading ? (
                                <>
                                    <span className="ai-spinner"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    Generate
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
