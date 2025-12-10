import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PresentationCard } from '../components/dashboard/PresentationCard';
import './MyPresentations.css';

export const MyPresentations = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'modified'

    // Sample presentations data (will be replaced with API data later)
    const presentations = [
        {
            id: 1,
            question: "Customer Satisfaction Survey 2024",
            thumbnail: null,
            modified: "2024-12-10",
            created: "2024-12-01"
        },
        {
            id: 2,
            question: "Team Building Activities - Which one should we try next?",
            thumbnail: null,
            modified: "2024-12-09",
            created: "2024-11-28"
        },
        {
            id: 3,
            question: "What's your favorite feature of our product?",
            thumbnail: null,
            modified: "2024-12-08",
            created: "2024-11-25"
        },
        {
            id: 4,
            question: "Q4 2024 Company All-Hands Meeting Poll",
            thumbnail: null,
            modified: "2024-12-07",
            created: "2024-11-20"
        },
        {
            id: 5,
            question: "Employee Engagement Survey - December 2024",
            thumbnail: null,
            modified: "2024-12-06",
            created: "2024-11-15"
        },
        {
            id: 6,
            question: "Product Roadmap Priorities - Vote for your top choice",
            thumbnail: null,
            modified: "2024-12-05",
            created: "2024-11-10"
        },
        {
            id: 7,
            question: "Office Holiday Party Planning - Food preferences",
            thumbnail: null,
            modified: "2024-12-04",
            created: "2024-11-05"
        },
        {
            id: 8,
            question: "New Feature Feedback - Rating Scale",
            thumbnail: null,
            modified: "2024-12-03",
            created: "2024-11-01"
        }
    ];

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        // TODO: Implement actual sorting logic
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
                            <p className="presentations-subtitle">{presentations.length} presentations</p>
                        </div>

                        <div className="presentations-actions">
                            <button className="btn-new-presentation">
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
                                />
                            </div>

                            <div className="filter-dropdown">
                                <button className="filter-btn">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <span>Filter</span>
                                </button>
                            </div>

                            <div className="sort-dropdown">
                                <button className="sort-btn">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 6l4-4 4 4M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Sort: {sortBy === 'recent' ? 'Recently modified' : sortBy === 'name' ? 'Name' : 'Date created'}</span>
                                </button>
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
                    {presentations.length > 0 ? (
                        <div className={`presentations-grid ${viewMode}`}>
                            {presentations.map(presentation => (
                                <PresentationCard
                                    key={presentation.id}
                                    question={presentation.question}
                                    thumbnail={presentation.thumbnail}
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
                            <h3 className="empty-state-title">No presentations yet</h3>
                            <p className="empty-state-text">Create your first presentation to get started</p>
                            <button className="btn-create-first">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span>Create Presentation</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
