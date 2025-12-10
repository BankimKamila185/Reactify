import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { FeatureCard } from '../components/dashboard/FeatureCard';
import { PresentationCard } from '../components/dashboard/PresentationCard';
import './Dashboard.css';

export const Dashboard = () => {
    // Popular features data
    const features = [
        {
            id: 1,
            name: 'Word cloud',
            iconType: 'wordcloud',
            color: '#FF9B9B'
        },
        {
            id: 2,
            name: 'Poll',
            iconType: 'poll',
            color: '#8B9FFF'
        },
        {
            id: 3,
            name: 'Open Ended',
            iconType: 'openended',
            color: '#FFB3C1'
        },
        {
            id: 4,
            name: 'Scales',
            iconType: 'scales',
            color: '#A8B3FF'
        },
        {
            id: 5,
            name: 'Ranking',
            iconType: 'ranking',
            color: '#7CECB0'
        },
        {
            id: 6,
            name: 'Pin on image',
            iconType: 'pin',
            color: '#9B8BFF'
        }
    ];

    // Recently viewed presentations
    const recentPresentations = [
        { id: 1, question: "What's the most important trait for a great leader?" },
        { id: 2, question: "What was your favorite subject in school?" },
        { id: 3, question: "How would you rate your experience with our product?" }
    ];

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <div className="dashboard-main-new">
                <DashboardHeader />

                <div className="dashboard-content-new">
                    {/* Welcome Section */}
                    <section className="welcome-section">
                        <h1 className="welcome-title">Welcome Bankim Chandra Kamila!</h1>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="btn-action btn-primary-action">
                                <span>New Menti</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="btn-action btn-secondary-action">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 1l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                </svg>
                                <span>Start with AI</span>
                            </button>
                            <button className="btn-action btn-secondary-action">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M14 4l-5 5M4 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span>Import presentation</span>
                            </button>
                        </div>
                    </section>

                    {/* Popular Features */}
                    <section className="features-section">
                        <h2 className="section-heading">Popular features</h2>
                        <div className="features-grid">
                            {features.map(feature => (
                                <FeatureCard
                                    key={feature.id}
                                    iconType={feature.iconType}
                                    name={feature.name}
                                    color={feature.color}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Recently Viewed */}
                    <section className="recent-section">
                        <h2 className="section-heading">Recently viewed</h2>
                        <div className="recent-grid">
                            {recentPresentations.map(presentation => (
                                <PresentationCard
                                    key={presentation.id}
                                    question={presentation.question}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
