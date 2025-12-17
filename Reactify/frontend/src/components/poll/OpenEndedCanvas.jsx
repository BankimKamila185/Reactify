import React from 'react';
import './OpenEndedCanvas.css';

export const OpenEndedCanvas = ({
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
    const responses = slide?.responses || [];
    // Generate QR code URL for the local voting page
    const baseUrl = window.location.origin;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`${baseUrl}/vote/${joinCode}`)}`;

    return (
        <div className="open-ended-canvas">
            <div
                className={`oe-slide-container ${isSelected ? 'selected' : ''}`}
                onClick={onCanvasClick}
                style={{
                    backgroundColor: backgroundColor || '#4CAF50',
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                }}
            >
                {/* Header with Join Code */}
                <div className="oe-header">
                    {showQRCode && (
                        <div className="oe-qr-code">
                            <img src={qrCodeUrl} alt="QR Code" />
                        </div>
                    )}
                    <div className="oe-join-pill">
                        <span>Join at <strong>reacti.com</strong> | use code <strong>{joinCode}</strong></span>
                    </div>
                    <div className="oe-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M4 12L6 8L8 12L10 8V16H8V12L6 16L4 12V16H2V8L4 12Z" fill="#5B7FFF" />
                            <path d="M12 8h2v8h-2V8z" fill="#5B7FFF" />
                        </svg>
                        <span>Reactify</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="oe-content">
                    {/* Question */}
                    <div className="oe-question-area">
                        {isEditorMode ? (
                            <textarea
                                className="oe-question-input"
                                placeholder="Ask an open-ended question..."
                                value={question}
                                onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                                rows={2}
                            />
                        ) : (
                            <h2 className="oe-question-text">{question || 'Your question here'}</h2>
                        )}
                    </div>

                    {/* Response Preview Area */}
                    <div className="oe-responses-preview">
                        {responses.length > 0 ? (
                            <div className="oe-responses-grid">
                                {responses.slice(0, 6).map((response, index) => (
                                    <div key={index} className="oe-response-card">
                                        <p>{response.text}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="oe-placeholder">
                                <div className="oe-input-preview">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="18" height="18" rx="4" stroke="#9CA3AF" strokeWidth="2" />
                                        <path d="M8 12h8M8 8h5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>Waiting for responses...</span>
                                </div>
                                <div className="oe-sample-responses">
                                    <div className="sample-card">Sample answer 1</div>
                                    <div className="sample-card">Sample answer 2</div>
                                    <div className="sample-card">Sample answer 3</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Participant Badge */}
                <div className="oe-participant-badge">
                    <span className="badge-count">{responses.length}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="5" r="2.5" fill="#1A1A1A" />
                        <path d="M3 14c0-2.5 2-4 5-4s5 1.5 5 4" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Speaker Notes */}
            <div className="oe-speaker-notes">
                <div className="speaker-notes-header">Speaker notes</div>
            </div>
        </div>
    );
};
