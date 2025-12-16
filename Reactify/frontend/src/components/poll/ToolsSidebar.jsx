import React from 'react';
import './ToolsSidebar.css';

export const ToolsSidebar = ({ activeTool, onToolChange, onHelpClick }) => {
    const tools = [
        { id: 'edit', icon: 'chart', label: 'Edit' },
        { id: 'comments', icon: 'comments', label: 'Comments' },
        { id: 'interactivity', icon: 'users', label: 'Interactivity' },
        { id: 'themes', icon: 'palette', label: 'Themes' },
        { id: 'templates', icon: 'grid', label: 'Templates' },
    ];

    const renderIcon = (iconType) => {
        switch (iconType) {
            case 'chart':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="10" width="3" height="7" rx="1" fill="currentColor" />
                        <rect x="8" y="6" width="3" height="11" rx="1" fill="currentColor" />
                        <rect x="13" y="8" width="3" height="9" rx="1" fill="currentColor" />
                    </svg>
                );
            case 'comments':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 3v-3H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                );
            case 'users':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M2 17c0-2.5 2-4 5-4s5 1.5 5 4M13 7a3 3 0 100-6M18 17c0-2 1.5-3.5 4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                );
            case 'palette':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2a8 8 0 018 8c0 2-1 3-2.5 3H13a2 2 0 00-2 2c0 .5.2 1 .5 1.5.3.4.5.9.5 1.5a3 3 0 11-6 0 8 8 0 018-16z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <circle cx="7" cy="8" r="1" fill="currentColor" />
                        <circle cx="10" cy="6" r="1" fill="currentColor" />
                        <circle cx="13" cy="8" r="1" fill="currentColor" />
                    </svg>
                );
            case 'grid':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="tools-sidebar">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
                    onClick={() => onToolChange(tool.id)}
                    title={tool.label}
                >
                    {renderIcon(tool.icon)}
                    <span className="tool-label">{tool.label}</span>
                </button>
            ))}

            <button
                className="help-button"
                title="Help"
                onClick={() => onHelpClick && onHelpClick()}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M10 14v.5M10 7a2 2 0 012 2c0 1-1 1.5-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );
};
