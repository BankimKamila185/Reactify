import React, { useState } from 'react';
import './ThemesPicker.css';

const themes = [
    { id: 'default', name: 'Default', primary: '#5B7FFF', secondary: '#F3F4F6', background: '#FFFFFF' },
    { id: 'ocean', name: 'Ocean', primary: '#0EA5E9', secondary: '#E0F2FE', background: '#F0F9FF' },
    { id: 'forest', name: 'Forest', primary: '#22C55E', secondary: '#DCFCE7', background: '#F0FDF4' },
    { id: 'sunset', name: 'Sunset', primary: '#F97316', secondary: '#FFEDD5', background: '#FFF7ED' },
    { id: 'lavender', name: 'Lavender', primary: '#A855F7', secondary: '#F3E8FF', background: '#FAF5FF' },
    { id: 'rose', name: 'Rose', primary: '#EC4899', secondary: '#FCE7F3', background: '#FDF2F8' },
    { id: 'dark', name: 'Dark', primary: '#8B5CF6', secondary: '#1F2937', background: '#111827' },
    { id: 'midnight', name: 'Midnight', primary: '#3B82F6', secondary: '#1E3A5F', background: '#0F172A' },
    { id: 'coral', name: 'Coral', primary: '#F43F5E', secondary: '#FFE4E6', background: '#FFF1F2' },
    { id: 'mint', name: 'Mint', primary: '#14B8A6', secondary: '#CCFBF1', background: '#F0FDFA' },
    { id: 'amber', name: 'Amber', primary: '#F59E0B', secondary: '#FEF3C7', background: '#FFFBEB' },
    { id: 'slate', name: 'Slate', primary: '#64748B', secondary: '#E2E8F0', background: '#F8FAFC' },
];

export const ThemesPicker = ({ currentTheme = 'default', onThemeChange, onClose }) => {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme);
    const [previewTheme, setPreviewTheme] = useState(null);

    const handleThemeSelect = (themeId) => {
        setSelectedTheme(themeId);
        if (onThemeChange) {
            const theme = themes.find(t => t.id === themeId);
            onThemeChange(theme);
        }
    };

    const displayTheme = previewTheme || themes.find(t => t.id === selectedTheme);

    return (
        <div className="themes-picker">
            <div className="themes-header">
                <h3>Themes</h3>
                <button className="close-btn" onClick={onClose}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="themes-preview" style={{
                background: displayTheme?.background,
                borderColor: displayTheme?.primary
            }}>
                <div className="preview-header" style={{ background: displayTheme?.secondary }}>
                    <span style={{ color: displayTheme?.primary }}>reacti.com | 123 456</span>
                </div>
                <div className="preview-content">
                    <h4 style={{ color: displayTheme?.id?.includes('dark') || displayTheme?.id === 'midnight' ? '#FFF' : '#1A1A1A' }}>
                        Preview Question
                    </h4>
                    <div className="preview-options">
                        <div className="preview-option" style={{ background: displayTheme?.primary }}></div>
                        <div className="preview-option" style={{ background: displayTheme?.primary, opacity: 0.7 }}></div>
                        <div className="preview-option" style={{ background: displayTheme?.primary, opacity: 0.4 }}></div>
                    </div>
                </div>
            </div>

            <div className="themes-grid">
                {themes.map(theme => (
                    <button
                        key={theme.id}
                        className={`theme-item ${selectedTheme === theme.id ? 'selected' : ''}`}
                        onClick={() => handleThemeSelect(theme.id)}
                        onMouseEnter={() => setPreviewTheme(theme)}
                        onMouseLeave={() => setPreviewTheme(null)}
                    >
                        <div className="theme-preview-mini" style={{ background: theme.background }}>
                            <div className="theme-bar" style={{ background: theme.primary }}></div>
                            <div className="theme-bar" style={{ background: theme.primary, opacity: 0.6 }}></div>
                        </div>
                        <span className="theme-name">{theme.name}</span>
                        {selectedTheme === theme.id && (
                            <svg className="check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" fill="#5B7FFF" />
                                <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>

            <div className="themes-footer">
                <button className="customize-btn">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Create custom theme
                </button>
            </div>
        </div>
    );
};
