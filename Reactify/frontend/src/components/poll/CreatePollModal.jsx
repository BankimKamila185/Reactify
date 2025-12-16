import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PollTemplateCard } from './PollTemplateCard';
import './CreatePollModal.css';

export const CreatePollModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const pollTemplates = [
        {
            id: 'blank',
            title: 'Blank poll',
            type: 'blank',
            preview: null
        },
        {
            id: 'favorite-subject',
            title: 'Favorite school subject icebreaker',
            type: 'barchart',
            preview: 'favorite-subject'
        },
        {
            id: 'time-travel',
            title: 'Time travel icebreaker',
            type: 'image',
            preview: 'time-travel'
        },
        {
            id: 'morning-evening',
            title: 'Morning vs. evening poll',
            type: 'scale',
            preview: 'morning-evening'
        }
    ];

    const handleTemplateClick = (template) => {
        onClose();
        navigate('/poll/edit', { state: { template } });
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Start from scratch or a template</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="modal-content">
                    <div className="modal-section">
                        <h3 className="section-title">Polls</h3>
                        <p className="section-description">
                            Get votes on options you offer to gather input from participants, make decisions together, or break the ice.
                        </p>

                        <div className="templates-grid">
                            {pollTemplates.map(template => (
                                <PollTemplateCard
                                    key={template.id}
                                    template={template}
                                    onClick={() => handleTemplateClick(template)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
