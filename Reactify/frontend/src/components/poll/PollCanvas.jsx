import React from 'react';
import './PollCanvas.css';

// Helper function to determine if a color is dark
const isColorDark = (color) => {
    if (!color) return false;
    // Handle hex colors
    let hex = color.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
};

export const PollCanvas = ({
    question,
    onQuestionChange,
    options,
    selectedElement,
    onSelectQuestion,
    onSelectVisualization,
    joinCode,
    visualizationType = 'bar',
    backgroundColor,
    backgroundImage,
    showQRCode = false,
    participantCount = 0,
    onCanvasClick
}) => {
    // Calculate vote statistics
    const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
    const maxVotes = Math.max(...options.map(o => o.votes || 0), 1);

    // Determine if background is dark for text contrast
    const isDarkBackground = isColorDark(backgroundColor);

    // Generate QR code URL for the local voting page
    const baseUrl = window.location.origin;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`${baseUrl}/vote/${joinCode}`)}`;

    const textColor = isDarkBackground ? '#FFFFFF' : '#1A1A1A';
    const subtleTextColor = isDarkBackground ? 'rgba(255,255,255,0.7)' : '#666';

    // Render Bar Chart visualization - Mentimeter style
    const renderBarChart = () => (
        <div className="canvas-options-row">
            {options.map((option, index) => {
                const voteCount = option.votes || 0;
                // Calculate bar height as percentage of max votes (min 4px for visibility)
                const barHeight = maxVotes > 0 ? Math.max(4, (voteCount / maxVotes) * 100) : 4;
                return (
                    <div key={option.id} className={`canvas-option-item ${option.image ? 'has-image' : ''}`}>
                        <div className="option-vote-count" style={{ color: subtleTextColor }}>{voteCount}</div>
                        {option.image ? (
                            <div className="viz-card">
                                <img
                                    src={option.image}
                                    alt=""
                                    className="viz-card-image"
                                />
                                <div
                                    className="option-bar"
                                    style={{
                                        backgroundColor: option.color || '#5B7FFF',
                                        height: `${barHeight}px`
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                className="option-bar"
                                style={{
                                    backgroundColor: option.color || '#5B7FFF',
                                    height: `${barHeight}px`
                                }}
                            />
                        )}
                        <div className="option-label" style={{ color: textColor }}>{option.text || `Option ${index + 1}`}</div>
                    </div>
                );
            })}
        </div>
    );

    // Render Donut Chart visualization
    const renderDonutChart = () => {
        const size = 180;
        const strokeWidth = 35;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        let cumulativePercent = 0;

        return (
            <div className="canvas-visualization viz-donut-chart">
                <div className="donut-container">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth={strokeWidth}
                        />
                        {options.map((option, index) => {
                            const voteCount = option.votes || 0;
                            const percent = totalVotes > 0 ? voteCount / totalVotes : 1 / options.length;
                            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
                            const rotation = cumulativePercent * 360 - 90;
                            cumulativePercent += percent;

                            return (
                                <circle
                                    key={option.id}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={option.color || '#5B7FFF'}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                                />
                            );
                        })}
                    </svg>
                    <div className="donut-center">
                        <span className="donut-total">{totalVotes}</span>
                        <span className="donut-label">votes</span>
                    </div>
                </div>
                <div className="chart-legend">
                    {options.map((option, index) => (
                        <div key={option.id} className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: option.color || '#5B7FFF' }}></span>
                            <span className="legend-text">{option.text || `Option ${index + 1}`}</span>
                            <span className="legend-count">{option.votes || 0}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render Pie Chart visualization
    const renderPieChart = () => {
        const size = 180;
        let cumulativePercent = 0;

        const getCoordinatesForPercent = (percent) => {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        };

        return (
            <div className="canvas-visualization viz-pie-chart">
                <div className="pie-container">
                    <svg width={size} height={size} viewBox="-1 -1 2 2">
                        {options.map((option, index) => {
                            const voteCount = option.votes || 0;
                            const percent = totalVotes > 0 ? voteCount / totalVotes : 1 / options.length;

                            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                            cumulativePercent += percent;
                            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

                            const largeArcFlag = percent > 0.5 ? 1 : 0;
                            const pathData = [
                                `M ${startX} ${startY}`,
                                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                `L 0 0`,
                            ].join(' ');

                            return (
                                <path
                                    key={option.id}
                                    d={pathData}
                                    fill={option.color || '#5B7FFF'}
                                />
                            );
                        })}
                    </svg>
                </div>
                <div className="chart-legend">
                    {options.map((option, index) => (
                        <div key={option.id} className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: option.color || '#5B7FFF' }}></span>
                            <span className="legend-text">{option.text || `Option ${index + 1}`}</span>
                            <span className="legend-count">{option.votes || 0}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render Dots visualization
    const renderDotsChart = () => (
        <div className="canvas-visualization viz-dots-chart">
            {options.map((option, index) => {
                const voteCount = option.votes || 0;
                const dots = Array(Math.min(voteCount, 20)).fill(0);

                return (
                    <div key={option.id} className="dots-option-item">
                        <div className="dots-label">{option.text || `Option ${index + 1}`}</div>
                        <div className="dots-row">
                            {dots.length > 0 ? (
                                dots.map((_, dotIndex) => (
                                    <div
                                        key={dotIndex}
                                        className="dot"
                                        style={{ backgroundColor: option.color || '#5B7FFF' }}
                                    />
                                ))
                            ) : (
                                <div className="dots-empty">No votes yet</div>
                            )}
                            {voteCount > 20 && <span className="dots-overflow">+{voteCount - 20}</span>}
                        </div>
                        <div className="dots-count">{voteCount}</div>
                    </div>
                );
            })}
        </div>
    );

    // Render visualization based on type
    const renderVisualization = () => {
        switch (visualizationType) {
            case 'donut':
                return renderDonutChart();
            case 'pie':
                return renderPieChart();
            case 'dots':
                return renderDotsChart();
            case 'bar':
            default:
                return renderBarChart();
        }
    };

    return (
        <div className="poll-canvas" >
            <div
                className={`canvas-slide-container ${selectedElement === null ? 'selected' : ''}`}
                onClick={onCanvasClick}
                style={{
                    backgroundColor: backgroundColor || '#4CAF50',
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer' // Add cursor to indicate clickable
                }}
            >
                {/* Header with Join Code and Logo */}
                <div className="canvas-header">
                    <div className="join-code-pill">
                        <span>Join at <strong>menti.com</strong> | use code <strong>{joinCode || '...'}</strong></span>
                    </div>
                    {showQRCode && (
                        <div className="qr-code-container">
                            <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
                        </div>
                    )}
                    <div className="mentimeter-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M4 12L6 8L8 12L10 8V16H8V12L6 16L4 12V16H2V8L4 12Z" fill="#5B7FFF" />
                            <path d="M12 8h2v8h-2V8z" fill="#5B7FFF" />
                        </svg>
                        <span>Mentimeter</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="canvas-content">
                    {/* Question Area */}
                    <div
                        className={`editor-section ${selectedElement === 'question' ? 'selected' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onSelectQuestion(); }}
                    >
                        <textarea
                            className="canvas-question-input"
                            placeholder="Your Poll question here"
                            value={question}
                            onChange={(e) => onQuestionChange(e.target.value)}
                            rows={2}
                            style={{
                                color: textColor,
                                '::placeholder': { color: subtleTextColor }
                            }}
                        />
                    </div>

                    {/* Spacer */}
                    <div className="canvas-spacer" />

                    {/* Options/Visualization at Bottom */}
                    <div
                        className={`visualization-section ${selectedElement === 'visualization' ? 'selected' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onSelectVisualization(); }}
                    >
                        {renderVisualization()}
                    </div>
                </div>

                {/* Participant Badge - Bottom Right */}
                <div className="participant-badge">
                    <span className="badge-count">{participantCount}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="5" r="2.5" fill="#1A1A1A" />
                        <path d="M3 14c0-2.5 2-4 5-4s5 1.5 5 4" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Speaker Notes */}
            <div className="canvas-speaker-notes" >
                <div className="speaker-notes-header">Speaker notes</div>
            </div >
        </div >
    );
};
