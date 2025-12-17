import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PresentationCard } from '../components/dashboard/PresentationCard';
import './SharedTemplates.css';

export const SharedTemplates = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'popular', 'name'
    const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'polls', 'surveys', 'quizzes', etc.

    // Sample shared templates data (will be replaced with API data later)
    const sharedTemplates = [
        {
            id: 1,
            name: "Employee Engagement Survey Template",
            thumbnail: null,
            category: "surveys",
            uses: 245,
            sharedBy: "HR Team",
            modified: "2024-12-10"
        },
        {
            id: 2,
            name: "Quick Pulse Check - Team Mood",
            thumbnail: null,
            category: "polls",
            uses: 189,
            sharedBy: "Leadership Team",
            modified: "2024-12-09"
        },
        {
            id: 3,
            name: "Product Feedback Collection",
            thumbnail: null,
            category: "surveys",
            uses: 312,
            sharedBy: "Product Team",
            modified: "2024-12-08"
        },
        {
            id: 4,
            name: "Weekly Team Retrospective",
            thumbnail: null,
            category: "polls",
            uses: 156,
            sharedBy: "Engineering Team",
            modified: "2024-12-07"
        },
        {
            id: 5,
            name: "Customer Satisfaction Score (CSAT)",
            thumbnail: null,
            category: "surveys",
            uses: 421,
            sharedBy: "Customer Success Team",
            modified: "2024-12-06"
        },
        {
            id: 6,
            name: "Training Session Quiz",
            thumbnail: null,
            category: "quizzes",
            uses: 278,
            sharedBy: "Learning & Development",
            modified: "2024-12-05"
        },
        {
            id: 7,
            name: "Event Planning Preferences",
            thumbnail: null,
            category: "polls",
            uses: 134,
            sharedBy: "Events Team",
            modified: "2024-12-04"
        },
        {
            id: 8,
            name: "Net Promoter Score (NPS) Survey",
            thumbnail: null,
            category: "surveys",
            uses: 567,
            sharedBy: "Marketing Team",
            modified: "2024-12-03"
        }
    ];

    const categories = [
        { id: 'all', label: 'All Templates' },
        { id: 'surveys', label: 'Surveys' },
        { id: 'polls', label: 'Polls' },
        { id: 'quizzes', label: 'Quizzes' },
        { id: 'wordcloud', label: 'Word Cloud' }
    ];

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
    };

    const getFilteredTemplates = () => {
        let result = [...sharedTemplates];

        // Filter by category
        if (categoryFilter !== 'all') {
            result = result.filter(template => template.category === categoryFilter);
        }

        // Sort based on selection
        switch (sortBy) {
            case 'name':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'popular':
                result.sort((a, b) => (b.uses || 0) - (a.uses || 0));
                break;
            case 'recent':
            default:
                result.sort((a, b) => new Date(b.modified) - new Date(a.modified));
                break;
        }

        return result;
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <div className="dashboard-main-new">
                <DashboardHeader />

                <div className="shared-templates-content">
                    {/* Page Header */}
                    <div className="templates-header">
                        <div className="templates-title-section">
                            <h1 className="templates-title">Shared templates</h1>
                            <p className="templates-subtitle">
                                {sharedTemplates.length} templates shared by Bankim Chandra's team
                            </p>
                        </div>

                        <div className="templates-actions">
                            <button className="btn-create-template">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                                <span>Create Template</span>
                            </button>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-chip ${categoryFilter === category.id ? 'active' : ''}`}
                                onClick={() => setCategoryFilter(category.id)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="templates-controls">
                        <div className="controls-left">
                            <div className="search-box">
                                <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search templates..."
                                />
                            </div>

                            <div className="sort-dropdown">
                                <button className="sort-btn">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 6l4-4 4 4M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>
                                        Sort: {sortBy === 'recent' ? 'Recently updated' : sortBy === 'popular' ? 'Most popular' : 'Name'}
                                    </span>
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

                    {/* Templates Grid */}
                    {getFilteredTemplates().length > 0 ? (
                        <div className={`templates-grid ${viewMode}`}>
                            {getFilteredTemplates().map(template => (
                                <div key={template.id} className="template-wrapper">
                                    <PresentationCard
                                        question={template.name}
                                        thumbnail={template.thumbnail}
                                    />
                                    <div className="template-meta">
                                        <div className="template-stats">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stats-icon">
                                                <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                                                <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                            </svg>
                                            <span className="uses-text">{template.uses} uses</span>
                                        </div>
                                        <div className="template-owner">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="owner-icon">
                                                <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                                                <path d="M2 12c0-2 2-3.5 5-3.5s5 1.5 5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                            </svg>
                                            <span className="owner-text">{template.sharedBy}</span>
                                        </div>
                                    </div>
                                    <button className="btn-use-template">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M9 7H5M7 5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span>Use template</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <rect width="64" height="64" rx="12" fill="#F3F4F6" />
                                    <rect x="16" y="20" width="32" height="24" rx="2" stroke="#9CA3AF" strokeWidth="2" />
                                    <path d="M24 28h16M24 32h12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="empty-state-title">No templates found</h3>
                            <p className="empty-state-text">Try adjusting your filters or create a new template</p>
                            <button className="btn-create-first">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span>Create Template</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
