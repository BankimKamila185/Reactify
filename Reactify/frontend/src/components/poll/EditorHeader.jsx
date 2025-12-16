import React from 'react';
import './EditorHeader.css';

export const EditorHeader = ({
    title,
    onTitleChange,
    onBack,
    joinCode,
    activeTab = 'create',
    onTabChange,
    totalResponses = 0,
    onShare,
    onStartPresentation,
    onPreview,
    isStarting = false,
    isSaving = false,
    lastSaved = null,
    hasUnsavedChanges = false
}) => {

    // Format last saved time
    const formatLastSaved = () => {
        if (!lastSaved) return '';
        const now = new Date();
        const diff = Math.floor((now - lastSaved) / 1000);
        if (diff < 5) return 'Saved';
        if (diff < 60) return `Saved ${diff}s ago`;
        if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
        return `Saved at ${lastSaved.toLocaleTimeString()}`;
    };

    return (
        <div className="editor-header">
            <div className="header-left-section">
                <button className="header-back-btn" onClick={onBack} title="Back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="header-title-container">
                    <div className="header-title-row">
                        <input
                            type="text"
                            className="header-title-input"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="New presentation"
                        />
                        <span className={`save-status ${isSaving ? 'saving' : ''} ${hasUnsavedChanges ? 'unsaved' : ''}`}>
                            {isSaving ? (
                                <>
                                    <span className="save-spinner"></span>
                                    Saving...
                                </>
                            ) : hasUnsavedChanges ? (
                                'Unsaved'
                            ) : (
                                formatLastSaved()
                            )}
                        </span>
                    </div>
                    <div className="header-my-presentations" onClick={onBack} style={{ cursor: 'pointer' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 3h10M2 7h10M2 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>My presentations</span>
                    </div>
                </div>
            </div>

            <div className="header-center-section">
                <div className="header-tabs">
                    <button
                        className={`header-tab ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => onTabChange && onTabChange('create')}
                    >
                        Create
                    </button>
                    <button
                        className={`header-tab ${activeTab === 'results' ? 'active' : ''}`}
                        onClick={() => onTabChange && onTabChange('results')}
                    >
                        Results
                        <span className="results-count">{totalResponses}</span>
                    </button>
                </div>
            </div>

            <div className="header-right-section">
                <div className="header-user-avatar">BC</div>

                {/* Preview Button */}
                <button
                    className="header-icon-btn"
                    title="Preview"
                    onClick={() => onPreview && onPreview()}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4c-4 0-7.5 3-9 6 1.5 3 5 6 9 6s7.5-3 9-6c-1.5-3-5-6-9-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                </button>

                {/* Share Button */}
                <button className="header-share-btn" onClick={onShare}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M2 8h12M8 2c-2 1.5-3 3.5-3 6s1 4.5 3 6M8 2c2 1.5 3 3.5 3 6s-1 4.5-3 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                    Share
                </button>

                {/* Start Presentation Button */}
                <button
                    className="header-start-btn"
                    onClick={onStartPresentation}
                    disabled={isStarting}
                >
                    {isStarting ? 'Starting...' : 'Start presentation'}
                </button>
            </div>
        </div>
    );
};
