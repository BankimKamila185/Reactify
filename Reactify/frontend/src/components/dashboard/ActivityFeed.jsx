import React from 'react';
import './ActivityFeed.css';

export const ActivityFeed = ({ activities }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'response':
                return '💬';
            case 'created':
                return '✨';
            case 'completed':
                return '✅';
            case 'shared':
                return '📤';
            default:
                return '📌';
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'response':
                return '#3B82F6';
            case 'created':
                return '#8B5CF6';
            case 'completed':
                return '#059669';
            case 'shared':
                return '#F59E0B';
            default:
                return '#6B7280';
        }
    };

    return (
        <div className="activity-feed">
            <div className="feed-header">
                <h3 className="feed-title">Recent Activity</h3>
                <button className="view-all-btn">View All</button>
            </div>

            <div className="activity-list">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="activity-item">
                        <div
                            className="activity-icon"
                            style={{ backgroundColor: getActivityColor(activity.type) + '20', color: getActivityColor(activity.type) }}
                        >
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="activity-content">
                            <div className="activity-text">
                                <span className="activity-user">{activity.user}</span>
                                {' '}{activity.action}{' '}
                                <span className="activity-target">{activity.target}</span>
                            </div>
                            <div className="activity-time">{activity.timestamp}</div>
                        </div>
                        {index < activities.length - 1 && <div className="activity-line"></div>}
                    </div>
                ))}
            </div>

            {activities.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p className="empty-text">No recent activity</p>
                </div>
            )}
        </div>
    );
};
