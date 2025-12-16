import React from 'react';
import './PollTemplateCard.css';

export const PollTemplateCard = ({ template, onClick }) => {
    const renderPreview = () => {
        if (template.type === 'blank') {
            return (
                <div className="template-preview blank-preview">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20 8v24M8 20h24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            );
        }

        if (template.preview === 'favorite-subject') {
            return (
                <div className="template-preview chart-preview">
                    <div className="mini-chart">
                        <div className="chart-title">What was your favorite subject in school?</div>
                        <div className="chart-bars">
                            <div className="chart-bar" style={{ width: '60%' }}>
                                <span className="bar-label">Mathematics</span>
                            </div>
                            <div className="chart-bar" style={{ width: '40%' }}>
                                <span className="bar-label">Geography</span>
                            </div>
                            <div className="chart-bar" style={{ width: '30%' }}>
                                <span className="bar-label">Chemistry</span>
                            </div>
                            <div className="chart-bar" style={{ width: '25%' }}>
                                <span className="bar-label">Social science</span>
                            </div>
                            <div className="chart-bar" style={{ width: '20%' }}>
                                <span className="bar-label">History</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (template.preview === 'time-travel') {
            return (
                <div className="template-preview image-preview dark-preview">
                    <div className="image-question">Would you rather travel backwards or forwards in time?</div>
                    <div className="image-options">
                        <div className="image-option">
                            <div className="image-box backwards">🏛️</div>
                            <span>Backwards</span>
                        </div>
                        <div className="image-option">
                            <div className="image-box forwards">🚀</div>
                            <span>Forwards</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (template.preview === 'morning-evening') {
            return (
                <div className="template-preview scale-preview">
                    <div className="scale-question">Are you a morning person or an evening person?</div>
                    <div className="scale-line">
                        <span className="scale-label">Morning</span>
                        <div className="scale-bar"></div>
                        <span className="scale-label">Evening</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="template-card" onClick={onClick}>
            {renderPreview()}
            <div className="template-title">{template.title}</div>
        </div>
    );
};
