import React, { useState } from 'react';
import './PollResults.css';

export const PollResults = ({ slides, activeSlideIndex = 0, onSlideSelect }) => {
    const [selectedSlide, setSelectedSlide] = useState(activeSlideIndex);

    // Calculate total responses across all slides
    const totalResponses = slides.reduce((total, slide) => {
        if (slide.options) {
            return total + slide.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
        }
        return total + (slide.responses?.length || 0);
    }, 0);

    const currentSlide = slides[selectedSlide] || slides[0];

    const handleSlideClick = (index) => {
        setSelectedSlide(index);
        if (onSlideSelect) onSlideSelect(index);
    };

    // Get slide type label
    const getTypeLabel = (type) => {
        switch (type) {
            case 'multiple-choice': return 'Multiple Choice';
            case 'word-cloud': return 'Word Cloud';
            case 'open-ended': return 'Open Ended';
            case 'scales': return 'Scales';
            case 'ranking': return 'Ranking';
            case 'qa': return 'Q&A';
            default: return type;
        }
    };

    // Render results based on slide type
    const renderResults = () => {
        if (!currentSlide) return null;

        const slideResponses = currentSlide.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;

        if (currentSlide.type === 'multiple-choice') {
            return (
                <div className="results-content">
                    <h2 className="results-question">{currentSlide.question || 'No question set'}</h2>
                    <div className="results-chart">
                        {currentSlide.options?.map((option, index) => {
                            const percentage = slideResponses > 0 ? Math.round((option.votes || 0) / slideResponses * 100) : 0;
                            return (
                                <div key={option.id || index} className="chart-bar-container">
                                    <div className="chart-bar-label">
                                        <span className="option-text">{option.text || `Option ${index + 1}`}</span>
                                        <span className="option-votes">{option.votes || 0} ({percentage}%)</span>
                                    </div>
                                    <div className="chart-bar-track">
                                        <div
                                            className="chart-bar-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: option.color || '#5B7FFF'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="results-total">
                        <span>{slideResponses} response{slideResponses !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            );
        }

        if (currentSlide.type === 'word-cloud') {
            return (
                <div className="results-content">
                    <h2 className="results-question">{currentSlide.question || 'No question set'}</h2>
                    <div className="wordcloud-results">
                        {currentSlide.words?.length > 0 ? (
                            <div className="word-cloud-display">
                                {currentSlide.words.map((word, i) => (
                                    <span
                                        key={i}
                                        className="word-item"
                                        style={{ fontSize: `${14 + (word.count || 1) * 4}px` }}
                                    >
                                        {word.text}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="no-responses">No responses yet</p>
                        )}
                    </div>
                </div>
            );
        }

        if (currentSlide.type === 'open-ended') {
            return (
                <div className="results-content">
                    <h2 className="results-question">{currentSlide.question || 'No question set'}</h2>
                    <div className="open-ended-results">
                        {currentSlide.responses?.length > 0 ? (
                            currentSlide.responses.map((response, i) => (
                                <div key={i} className="response-card">
                                    <p>{response.text}</p>
                                </div>
                            ))
                        ) : (
                            <p className="no-responses">No responses yet</p>
                        )}
                    </div>
                </div>
            );
        }

        if (currentSlide.type === 'scales') {
            const average = currentSlide.responses?.length > 0
                ? (currentSlide.responses.reduce((sum, r) => sum + r.value, 0) / currentSlide.responses.length).toFixed(1)
                : 0;
            return (
                <div className="results-content">
                    <h2 className="results-question">{currentSlide.question || 'No question set'}</h2>
                    <div className="scales-results">
                        <div className="scale-average">
                            <span className="average-value">{average}</span>
                            <span className="average-label">Average rating</span>
                        </div>
                        <div className="scale-bar">
                            <div className="scale-fill" style={{ width: `${(average / (currentSlide.maxValue || 5)) * 100}%` }}></div>
                        </div>
                        <div className="scale-labels">
                            <span>{currentSlide.minLabel || '1'}</span>
                            <span>{currentSlide.maxLabel || '5'}</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentSlide.type === 'ranking') {
            return (
                <div className="results-content">
                    <h2 className="results-question">{currentSlide.question || 'No question set'}</h2>
                    <div className="ranking-results">
                        {currentSlide.items?.map((item, i) => (
                            <div key={i} className="ranking-item">
                                <span className="rank-number">{i + 1}</span>
                                <span className="rank-text">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Default: show placeholder
        return (
            <div className="results-content">
                <h2 className="results-question">{currentSlide.question || 'No question set'}</h2>
                <div className="results-placeholder">
                    <p className="no-responses">No results to display for this slide type</p>
                </div>
            </div>
        );
    };

    return (
        <div className="poll-results">
            {/* Slides sidebar */}
            <div className="results-slides">
                <h3>Slides</h3>
                <div className="slides-list">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id || index}
                            className={`slide-item ${selectedSlide === index ? 'active' : ''}`}
                            onClick={() => handleSlideClick(index)}
                        >
                            <span className="slide-number">{index + 1}</span>
                            <div className="slide-info">
                                <span className="slide-type">{getTypeLabel(slide.type)}</span>
                                <span className="slide-question">{slide.question || 'No question'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main results area */}
            <div className="results-main">
                {renderResults()}
            </div>

            {/* Right Panel - Overview */}
            <div className="results-overview">
                <div className="overview-header">
                    <h3>Overview</h3>
                </div>

                <div className="overview-content">
                    {/* Stats Cards */}
                    <div className="stat-card">
                        <div className="stat-info">
                            <span className="stat-label">Total Responses</span>
                            <span className="stat-value">{totalResponses}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <span className="stat-label">Total Slides</span>
                            <span className="stat-value">{slides.length}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <span className="stat-label">Current Slide</span>
                            <span className="stat-value">{selectedSlide + 1} of {slides.length}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="overview-actions">
                    <button className="action-download">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2v8M4 7l4 4 4-4M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Download
                    </button>
                    <button className="action-clear">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Clear results
                    </button>
                </div>
            </div>
        </div>
    );
};
