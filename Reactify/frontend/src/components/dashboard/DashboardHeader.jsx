import React from 'react';
import './DashboardHeader.css';

export const DashboardHeader = () => {
    return (
        <header className="dashboard-header-new">
            {/* Search Bar */}
            <div className="header-search-container">
                <svg className="search-icon-new" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM16 16l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                    type="text"
                    className="search-input-new"
                    placeholder="Search presentations, folders, and pages"
                />
            </div>

            {/* Right Section */}
            <div className="header-actions-new">
                {/* Notifications */}
                <button className="header-icon-btn-new">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4a5 5 0 0 1 5 5v2.59l1.71 1.71A1 1 0 0 1 16.12 15H3.88a1 1 0 0 1-.71-1.71L5 11.59V9a5 5 0 0 1 5-5zM7.5 16h5a2.5 2.5 0 0 1-5 0z" fill="currentColor" />
                    </svg>
                </button>

                {/* User Avatar */}
                <button className="user-avatar-new">
                    BC
                </button>
            </div>
        </header>
    );
};
