import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PresentationCard } from '../components/dashboard/PresentationCard';
import { pollApi } from '../api/poll.api';
import { sessionApi } from '../api/session.api';
import './MyPresentations.css';

export const MyPresentations = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'created'
    const [searchQuery, setSearchQuery] = useState('');
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // Live data state
    const [presentations, setPresentations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load presentations from API on mount
    useEffect(() => {
        loadPresentations();
    }, []);

    const loadPresentations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await pollApi.getMyPresentations();
            if (response.success && response.data?.presentations) {
                setPresentations(response.data.presentations);
            }
        } catch (err) {
            console.error('Failed to load presentations:', err);
            setError('Failed to load presentations. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Sort and filter presentations
    const filteredPresentations = useMemo(() => {
        let result = [...presentations];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                (p.title || '').toLowerCase().includes(query) ||
                (p.question || '').toLowerCase().includes(query)
            );
        }

        // Sort based on selected option
        switch (sortBy) {
            case 'name':
                result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            case 'created':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'recent':
            default:
                result.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
                break;
        }

        return result;
    }, [presentations, sortBy, searchQuery]);

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        setShowSortDropdown(false);
    };

    const handleNewPresentation = () => {
        // Clear localStorage for a fresh session
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentSessionCode');
        localStorage.removeItem('hostToken');
        navigate('/poll/edit');
    };

    const handlePresentationClick = (presentation) => {
        // Clear localStorage so the editor loads data from the database
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('currentSessionCode');
        localStorage.removeItem('hostToken');

        if (presentation.sessionId) {
            navigate(`/poll/edit/${presentation.sessionId}`);
        } else {
            navigate('/poll/edit');
        }
    };

    const handleDeletePresentation = async (presentationId, sessionId) => {
        try {
            if (sessionId) {
                await sessionApi.deleteSession(sessionId);
            }
            setPresentations(prev => prev.filter(p => p.id !== presentationId && p.sessionId !== sessionId));
        } catch (err) {
            console.error('Failed to delete presentation:', err);
        }
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <div className="dashboard-main-new">
                <DashboardHeader />

                <div className="my-presentations-content">
                    {/* Page Header */}
                    <div className="presentations-header">
                        <div className="presentations-title-section">
                            <h1 className="presentations-title">My presentations</h1>
                            <p className="presentations-subtitle">{filteredPresentations.length} presentations</p>
                        </div>

                        <div className="presentations-actions">
                            <button className="btn-new-presentation" onClick={handleNewPresentation}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                                <span>New Presentation</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters and View Controls */}
                    <div className="presentations-controls">
                        <div className="controls-left">
                            <div className="search-box">
                                <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search presentations..."
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
                                    <span>Sort: {sortBy === 'recent' ? 'Recently modified' : sortBy === 'name' ? 'Name' : 'Date created'}</span>
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
                                            className={sortBy === 'created' ? 'active' : ''}
                                            onClick={() => handleSortChange('created')}
                                        >
                                            Date created
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

                    {/* Presentations Grid */}
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading presentations...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={loadPresentations} className="btn-retry">Retry</button>
                        </div>
                    ) : filteredPresentations.length > 0 ? (
                        <div className={`presentations-grid ${viewMode}`}>
                            {filteredPresentations.map(presentation => (
                                <PresentationCard
                                    key={presentation.id}
                                    title={presentation.title}
                                    question={presentation.question}
                                    thumbnail={presentation.thumbnail}
                                    createdAt={presentation.createdAt}
                                    slideCount={presentation.pollCount || 1}
                                    slideType={presentation.slideType}
                                    onClick={() => handlePresentationClick(presentation)}
                                    onDelete={() => handleDeletePresentation(presentation.id, presentation.sessionId)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <rect width="64" height="64" rx="12" fill="#F3F4F6" />
                                    <path d="M20 28h24M20 36h16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="empty-state-title">{searchQuery ? 'No matching presentations' : 'No presentations yet'}</h3>
                            <p className="empty-state-text">{searchQuery ? 'Try adjusting your search' : 'Create your first presentation to get started'}</p>
                            {!searchQuery && (
                                <button className="btn-create-first" onClick={handleNewPresentation}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>Create Presentation</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
