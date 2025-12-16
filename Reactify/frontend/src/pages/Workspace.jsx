import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PresentationCard } from '../components/dashboard/PresentationCard';
import './Workspace.css';

export const Workspace = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'creator'
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'created', 'shared'

    // Sample workspace presentations data (will be replaced with API data later)
    const workspacePresentations = [
        {
            id: 1,
            question: "Q4 2024 Company All-Hands - Strategic Priorities",
            thumbnail: null,
            modified: "2024-12-11",
            creator: "Sarah Johnson",
            collaborators: 5,
            sharedWithTeam: true
        },
        {
            id: 2,
            question: "Employee Onboarding Survey - New Hire Experience",
            thumbnail: null,
            modified: "2024-12-10",
            creator: "Michael Chen",
            collaborators: 3,
            sharedWithTeam: true
        },
        {
            id: 3,
            question: "Product Roadmap Feedback - Feature Prioritization",
            thumbnail: null,
            modified: "2024-12-09",
            creator: "Emily Davis",
            collaborators: 8,
            sharedWithTeam: true
        },
        {
            id: 4,
            question: "Team Building Event Planning - Activity Preferences",
            thumbnail: null,
            modified: "2024-12-08",
            creator: "David Miller",
            collaborators: 4,
            sharedWithTeam: true
        },
        {
            id: 5,
            question: "Quarterly OKR Review - Progress Check-in",
            thumbnail: null,
            modified: "2024-12-07",
            creator: "Jennifer Wilson",
            collaborators: 6,
            sharedWithTeam: true
        },
        {
            id: 6,
            question: "Customer Feedback Analysis - Pain Points Survey",
            thumbnail: null,
            modified: "2024-12-06",
            creator: "Robert Brown",
            collaborators: 7,
            sharedWithTeam: true
        },
        {
            id: 7,
            question: "Tech Stack Evaluation - Developer Tools Assessment",
            thumbnail: null,
            modified: "2024-12-05",
            creator: "Lisa Anderson",
            collaborators: 5,
            sharedWithTeam: true
        },
        {
            id: 8,
            question: "Office Space Redesign - Workspace Preferences",
            thumbnail: null,
            modified: "2024-12-04",
            creator: "James Taylor",
            collaborators: 9,
            sharedWithTeam: true
        }
    ];

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        // TODO: Implement actual sorting logic
    };

    const getFilteredPresentations = () => {
        // TODO: Filter based on activeTab
        return workspacePresentations;
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <div className="dashboard-main-new">
                <DashboardHeader />

                <div className="workspace-content">
                    {/* Page Header */}
                    <div className="workspace-header">
                        <div className="workspace-title-section">
                            <h1 className="workspace-title">Workspace presentations</h1>
                            <p className="workspace-subtitle">
                                {workspacePresentations.length} {workspacePresentations.length === 1 ? 'presentation' : 'presentations'} in Bankim Chandra's team
                            </p>
                        </div>

                        <div className="workspace-actions">
                            <button className="btn-new-workspace-presentation">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                                <span>New Presentation</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="workspace-tabs">
                        <button
                            className={`workspace-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All presentations
                        </button>
                        <button
                            className={`workspace-tab ${activeTab === 'created' ? 'active' : ''}`}
                            onClick={() => setActiveTab('created')}
                        >
                            Created by me
                        </button>
                        <button
                            className={`workspace-tab ${activeTab === 'shared' ? 'active' : ''}`}
                            onClick={() => setActiveTab('shared')}
                        >
                            Shared with team
                        </button>
                    </div>

                    {/* Filters and View Controls */}
                    <div className="workspace-controls">
                        <div className="controls-left">
                            <div className="search-box">
                                <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search workspace presentations..."
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
                                    <span>Sort: {sortBy === 'recent' ? 'Recently modified' : sortBy === 'name' ? 'Name' : 'Creator'}</span>
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

                    {/* Workspace Presentations Grid */}
                    {getFilteredPresentations().length > 0 ? (
                        <div className={`workspace-grid ${viewMode}`}>
                            {getFilteredPresentations().map(presentation => (
                                <div key={presentation.id} className="workspace-presentation-wrapper">
                                    <PresentationCard
                                        question={presentation.question}
                                        thumbnail={presentation.thumbnail}
                                    />
                                    <div className="workspace-meta">
                                        <div className="workspace-creator">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="creator-icon">
                                                <circle cx="7" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                                                <path d="M2 12c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                            </svg>
                                            <span className="creator-text">{presentation.creator}</span>
                                        </div>
                                        <div className="workspace-collaborators">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="collaborators-icon">
                                                <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
                                                <circle cx="10" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                                                <path d="M1 11c0-2 1.5-3 4-3s4 1 4 3M9 11c0-1.5 1-2.5 3-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                            </svg>
                                            <span className="collaborators-text">{presentation.collaborators} collaborators</span>
                                        </div>
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
                                    <path d="M40 20h8M44 16v8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="empty-state-title">No workspace presentations yet</h3>
                            <p className="empty-state-text">Create a new presentation to collaborate with your team</p>
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
