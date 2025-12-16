import React from 'react';
import './ToggleSwitch.css';

export const ToggleSwitch = ({ checked, onChange, label, disabled = false }) => {
    return (
        <div className="toggle-switch-container">
            {label && <span className="toggle-label">{label}</span>}
            <label className="toggle-switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <span className="toggle-slider"></span>
            </label>
        </div>
    );
};
