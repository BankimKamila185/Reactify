import React, { useState } from 'react';
import './QACanvas.css';

export const QACanvas = ({
    slide,
    onQuestionChange,
    joinCode,
    backgroundColor,
    backgroundImage,
    showQRCode = false,
    onCanvasClick,
    isSelected = false,
    isEditorMode = false
}) => {
    const question = slide?.question || '';
    const questions = slide?.qaQuestions || [];
    // Generate QR code URL for the local voting page
    const baseUrl = window.location.origin;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`${baseUrl}/vote/${joinCode}`)}`;

    return (
        <div className="qa-canvas">
            <div
                className={`qa-slide-container ${isSelected ? 'selected' : ''}`}
                onClick={onCanvasClick}
                style={{
                    backgroundColor: backgroundColor || '#FF6B6B',
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                }}
            >
                {/* Header with Join Code */}
                <div className="qa-header">
                    {showQRCode && (
                        <div className="qa-qr-code">
                            <img src={qrCodeUrl} alt="QR Code" />
                        </div>
                    )}
                    <div className="qa-join-pill">
                        <span>Join at <strong>reacti.com</strong> | use code <strong>{joinCode}</strong></span>
                    </div>
                    <div className="qa-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M4 12L6 8L8 12L10 8V16H8V12L6 16L4 12V16H2V8L4 12Z" fill="#5B7FFF" />
                            <path d="M12 8h2v8h-2V8z" fill="#5B7FFF" />
                        </svg>
                        <span>Reactify</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="qa-content">
                    {/* Title */}
                    <div className="qa-title-area">
                        {isEditorMode ? (
                            <textarea
                                className="qa-title-input"
                                placeholder="Q&A Session Title..."
                                value={question}
                                onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                                rows={2}
                            />
                        ) : (
                            <h2 className="qa-title-text">{question || 'Questions & Answers'}</h2>
                        )}
                    </div>

                    {/* Q&A List Preview */}
                    <div className="qa-list-preview">
                        {questions.length > 0 ? (
                            <div className="qa-questions-list">
                                {questions.slice(0, 4).map((q, index) => (
                                    <div key={index} className="qa-question-item">
                                        <div className="qa-upvote">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 3l5 6H3l5-6z" fill="currentColor" />
                                            </svg>
                                            <span>{q.upvotes || 0}</span>
                                        </div>
                                        <div className="qa-question-text">{q.text}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="qa-placeholder">
                                <div className="qa-icon">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                        <text x="32" y="42" textAnchor="middle" fontSize="32" fill="rgba(255,255,255,0.5)" fontWeight="bold">?</text>
                                    </svg>
                                </div>
                                <p className="qa-placeholder-text">Audience questions will appear here</p>
                                <div className="qa-sample-questions">
                                    <div className="sample-question">
                                        <span className="sample-upvote">▲ 5</span>
                                        <span>Can you explain that in more detail?</span>
                                    </div>
                                    <div className="sample-question">
                                        <span className="sample-upvote">▲ 3</span>
                                        <span>What are the next steps?</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Badge */}
                <div className="qa-stats-badge">
                    <div className="stat-item">
                        <span className="stat-count">{questions.length}</span>
                        <span className="stat-label">Questions</span>
                    </div>
                </div>
            </div>

            {/* Speaker Notes */}
            <div className="qa-speaker-notes">
                <div className="speaker-notes-header">Speaker notes</div>
            </div>
        </div>
    );
};
