import React, { useState } from 'react';
import './PollCard.css';

export const PollCard = ({ title, status, responses, createdAt }) => {
    const [showActions, setShowActions] = useState(false);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'active':
                return { label: 'Active', color: '#059669' };
            case 'completed':
                return { label: 'Completed', color: '#6B7280' };
            case 'draft':
                return { label: 'Draft', color: '#F59E0B' };
            default:
                return { label: status, color: '#6B7280' };
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <div
            className="poll-card"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Card Header */}
            <div className="poll-card-header">
                <h3 className="poll-title">{title}</h3>
                <span
                    className="poll-status-badge"
                    style={{ backgroundColor: statusConfig.color }}
                >
                    {statusConfig.label}
                </span>
            </div>

            {/* Card Stats */}
            <div className="poll-stats">
                <div className="poll-stat-item">
                    <span className="stat-icon">💬</span>
                    <span className="stat-value">{responses} responses</span>
                </div>
                <div className="poll-stat-item">
                    <span className="stat-icon">🕒</span>
                    <span className="stat-value">{createdAt}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={`poll-actions ${showActions ? 'visible' : ''}`}>
                <button className="action-btn action-view" title="View Results">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
                <button className="action-btn action-edit" title="Edit Poll">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M13 2l3 3-9 9H4v-3l9-9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button className="action-btn action-share" title="Share">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="13" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="5" cy="9" r="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="13" cy="14" r="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 8l4-3M7 10l4 3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
                <button className="action-btn action-delete" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M2 4h14M6 4V2h6v2M7 8v6M11 8v6M4 4l1 11h8l1-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
