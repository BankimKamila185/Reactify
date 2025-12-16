import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PresentationCard } from '../components/dashboard/PresentationCard';
import { pollApi } from '../api/poll.api';
import './SharedWithMe.css';

export const SharedWithMe = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'owner'
    const [searchQuery, setSearchQuery] = useState('');
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // Live data state
    const [sharedPresentations, setSharedPresentations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load shared presentations from API on mount
    useEffect(() => {
        loadSharedPresentations();
    }, []);

    const loadSharedPresentations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Get user email from Firebase Auth or localStorage
            // For now, we'll use a placeholder - in production this comes from auth
            const userEmail = localStorage.getItem('userEmail') || '';

            const response = await pollApi.getSharedPresentations(userEmail);
            if (response.success && response.data?.presentations) {
                setSharedPresentations(response.data.presentations);
            }
        } catch (err) {
            console.error('Failed to load shared presentations:', err);
            setError('Failed to load shared presentations. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Sort and filter presentations
    const filteredPresentations = useMemo(() => {
        let result = [...sharedPresentations];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                (p.title || '').toLowerCase().includes(query) ||
                (p.question || '').toLowerCase().includes(query) ||
                (p.sharedByName || '').toLowerCase().includes(query)
            );
        }

        // Sort based on selected option
        switch (sortBy) {
            case 'name':
                result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'owner':
                result.sort((a, b) => (a.sharedByName || '').localeCompare(b.sharedByName || ''));
                break;
            case 'recent':
            default:
                result.sort((a, b) => new Date(b.sharedAt || b.createdAt) - new Date(a.sharedAt || a.createdAt));
                break;
        }

        return result;
    }, [sharedPresentations, sortBy, searchQuery]);

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        setShowSortDropdown(false);
    };

    const handlePresentationClick = (presentation) => {
        // Clear localStorage so the editor loads data from the database
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentSessionCode');
        localStorage.removeItem('hostToken');

        // Navigate based on permission - edit if allowed, otherwise view-only
        if (presentation.sessionId) {
            if (presentation.permission === 'edit') {
                navigate(`/poll/edit/${presentation.sessionId}`);
            } else {
                // For view-only, go to live results page
                navigate(`/live/${presentation.sessionId}`);
            }
        }
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <div className="dashboard-main-new">
                <DashboardHeader />

                <div className="shared-with-me-content">
                    {/* Page Header */}
                    <div className="shared-header">
                        <div className="shared-title-section">
                            <h1 className="shared-title">Shared with me</h1>
                            <p className="shared-subtitle">
                                {filteredPresentations.length} {filteredPresentations.length === 1 ? 'presentation' : 'presentations'} shared with you
                            </p>
                        </div>
                    </div>

                    {/* Filters and View Controls */}
                    <div className="shared-controls">
                        <div className="controls-left">
                            <div className="search-box">
                                <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search shared presentations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="sort-dropdown">
                                <button
                                    className="sort-btn"
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 6l4-4 4 4M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Sort: {sortBy === 'recent' ? 'Recently modified' : sortBy === 'name' ? 'Name' : 'Owner'}</span>
                                </button>
                                {showSortDropdown && (
                                    <div className="sort-dropdown-menu">
                                        <button
                                            className={sortBy === 'recent' ? 'active' : ''}
                                            onClick={() => handleSortChange('recent')}
                                        >
                                            Recently modified
                                        </button>
                                        <button
                                            className={sortBy === 'name' ? 'active' : ''}
                                            onClick={() => handleSortChange('name')}
                                        >
                                            Name
                                        </button>
                                        <button
                                            className={sortBy === 'owner' ? 'active' : ''}
                                            onClick={() => handleSortChange('owner')}
                                        >
                                            Owner
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="controls-right">
                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                        <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                        <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                        <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Shared Presentations Grid */}
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading shared presentations...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={loadSharedPresentations} className="btn-retry">Retry</button>
                        </div>
                    ) : filteredPresentations.length > 0 ? (
                        <div className={`shared-grid ${viewMode}`}>
                            {filteredPresentations.map(presentation => (
                                <div
                                    key={presentation.id}
                                    className="shared-presentation-wrapper"
                                    onClick={() => handlePresentationClick(presentation)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <PresentationCard
                                        title={presentation.title}
                                        question={presentation.question}
                                        thumbnail={presentation.thumbnail}
                                        createdAt={presentation.sharedAt || presentation.createdAt}
                                        slideCount={presentation.pollCount || 1}
                                        slideType={presentation.slideType}
                                    />
                                    <div className="shared-meta">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shared-icon">
                                            <path d="M5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM1 7c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM7 11c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="shared-by-text">Shared by <strong>{presentation.sharedByName || 'Unknown'}</strong></span>
                                        {presentation.permission === 'edit' && (
                                            <span className="permission-badge edit">Can edit</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <rect width="64" height="64" rx="12" fill="#F3F4F6" />
                                    <path d="M20 28h24M20 36h16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="44" cy="20" r="8" fill="#E5E7EB" />
                                    <path d="M41 20h6M44 17v6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="empty-state-title">{searchQuery ? 'No matching presentations' : 'No shared presentations yet'}</h3>
                            <p className="empty-state-text">{searchQuery ? 'Try adjusting your search' : 'When someone shares a presentation with you, it will appear here'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
