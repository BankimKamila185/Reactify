import React from 'react';
import './HelpModal.css';

export const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const shortcuts = [
        { keys: ['⌘', 'S'], action: 'Save presentation' },
        { keys: ['⌘', 'D'], action: 'Duplicate slide' },
        { keys: ['⌘', '⌫'], action: 'Delete slide' },
        { keys: ['⌘', 'Enter'], action: 'Start presentation' },
        { keys: ['Esc'], action: 'Exit presentation' },
        { keys: ['←', '→'], action: 'Navigate slides' },
    ];

    const tips = [
        'Click on a slide to select and edit it',
        'Drag slides to reorder them',
        'Right-click on a slide for more options',
        'Use themes to quickly style your presentation',
        'Add comments to collaborate with your team',
    ];

    return (
        <div className="help-modal-overlay" onClick={onClose}>
            <div className="help-modal" onClick={e => e.stopPropagation()}>
                <div className="help-header">
                    <h2>Help & Shortcuts</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="help-content">
                    <section className="help-section">
                        <h3>Keyboard Shortcuts</h3>
                        <div className="shortcuts-list">
                            {shortcuts.map((shortcut, index) => (
                                <div key={index} className="shortcut-item">
                                    <div className="keys">
                                        {shortcut.keys.map((key, i) => (
                                            <span key={i} className="key">{key}</span>
                                        ))}
                                    </div>
                                    <span className="action">{shortcut.action}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="help-section">
                        <h3>Quick Tips</h3>
                        <ul className="tips-list">
                            {tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="help-section">
                        <h3>Need more help?</h3>
                        <div className="help-links">
                            <a href="#" className="help-link">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 1L10 5.5H15L11 8.5L12.5 13L8 10.5L3.5 13L5 8.5L1 5.5H6L8 1Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                                </svg>
                                Watch tutorials
                            </a>
                            <a href="#" className="help-link">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                                    <path d="M5 6h6M5 8h6M5 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                Documentation
                            </a>
                            <a href="#" className="help-link">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 4l6 4 6-4M2 4v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                                </svg>
                                Contact support
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
