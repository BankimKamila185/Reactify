import React from 'react';
import './ColoredOptionInput.css';

export const ColoredOptionInput = ({ option, index, onChange, onRemove, onImageUpload }) => {
    return (
        <div className="colored-option-input">
            <div className="option-color-dot" style={{ backgroundColor: option.color }}></div>
            <input
                type="text"
                className="option-text-input"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => onChange(option.id, e.target.value)}
            />
            <button className="option-image-btn" onClick={() => onImageUpload(option.id)} title="Upload image">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 12l3-3 2 2 4-4 3 3V4H2v8z" fill="currentColor" opacity="0.3" />
                    <rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="5" cy="6" r="1" fill="currentColor" />
                </svg>
            </button>
            <button className="option-delete-btn" onClick={() => onRemove(option.id)} title="Delete option">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );
};
