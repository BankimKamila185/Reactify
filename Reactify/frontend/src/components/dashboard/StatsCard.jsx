import React from 'react';
import './StatsCard.css';

export const StatsCard = ({ label, value, trend, trendUp, icon }) => {
    return (
        <div className="stats-card">
            <div className="stats-icon">{icon}</div>
            <div className="stats-content">
                <div className="stats-label">{label}</div>
                <div className="stats-value">{value}</div>
                {trend && (
                    <div className={`stats-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
                        <span className="trend-arrow">{trendUp ? '↑' : '↓'}</span>
                        <span className="trend-value">{trend}</span>
                        <span className="trend-period">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};
