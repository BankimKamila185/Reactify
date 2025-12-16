import React, { useState } from 'react';
import { getAllCategories } from '../../data/slideTemplates';
import './SlideTemplatesPicker.css';

export const SlideTemplatesPicker = ({ onSelectTemplate, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = getAllCategories();

    // Filter templates based on search query
    const getFilteredTemplates = () => {
        if (!searchQuery.trim()) {
            if (selectedCategory) {
                const category = categories.find(c => c.id === selectedCategory);
                return category ? category.templates : [];
            }
            return categories.flatMap(c => c.templates);
        }

        const query = searchQuery.toLowerCase();
        return categories
            .flatMap(c => c.templates)
            .filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query)
            );
    };

    const handleTemplateSelect = (template) => {
        onSelectTemplate(template);
        onClose();
    };

    // Get background color based on template type
    const getCardBackground = (template) => {
        const type = template.slideData?.type;
        const colorMap = {
            'multiple-choice': 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            'word-cloud': 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            'open-ended': 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            'scales': 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)',
            'ranking': 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)',
            'qa': 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
            'select-answer': 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
            'type-answer': 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
            'text': 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
            'instructions': 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)'
        };
        return colorMap[type] || 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)';
    };

    // Render visual preview based on template type
    const renderTemplatePreview = (template) => {
        const slideType = template.slideData?.type;

        // Multiple Choice / Select Answer - Bar Chart Preview
        if (slideType === 'multiple-choice' || slideType === 'select-answer') {
            const options = template.slideData.options || [];
            return (
                <div className="preview-visual">
                    <p className="preview-question">{template.slideData.question}</p>
                    <div className="preview-chart-bars">
                        {options.slice(0, 4).map((opt, idx) => (
                            <div key={idx} className="chart-bar-row">
                                <span className="bar-number">{idx + 1}.</span>
                                <div
                                    className="chart-bar-fill"
                                    style={{
                                        width: `${80 - idx * 15}%`,
                                        backgroundColor: opt.color || '#5B7FFF'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Word Cloud Preview
        if (slideType === 'word-cloud') {
            return (
                <div className="preview-visual">
                    <p className="preview-question">{template.slideData.question}</p>
                    <div className="preview-wordcloud">
                        <span className="wc-word wc-large" style={{ color: '#EA4335' }}>leadership</span>
                        <span className="wc-word wc-medium" style={{ color: '#4285F4' }}>creative</span>
                        <span className="wc-word wc-small" style={{ color: '#34A853' }}>focus</span>
                        <span className="wc-word wc-medium" style={{ color: '#FBBC04' }}>innovation</span>
                        <span className="wc-word wc-small" style={{ color: '#EA4335' }}>growth</span>
                    </div>
                </div>
            );
        }

        // Open Ended Preview
        if (slideType === 'open-ended') {
            return (
                <div className="preview-visual">
                    <p className="preview-question">{template.slideData.question}</p>
                    <div className="preview-open-ended">
                        <div className="open-ended-card">Share your thoughts here...</div>
                        <div className="open-ended-card">Great ideas welcome!</div>
                    </div>
                </div>
            );
        }

        // Scales Preview - Donut/Pie Chart
        if (slideType === 'scales') {
            return (
                <div className="preview-visual">
                    <p className="preview-question">{template.slideData.question}</p>
                    <div className="preview-donut">
                        <svg viewBox="0 0 100 100" className="donut-chart">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#E8F5E9" strokeWidth="20" />
                            <circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke="#4CAF50"
                                strokeWidth="20"
                                strokeDasharray="150 251.2"
                                transform="rotate(-90 50 50)"
                            />
                            <circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke="#81C784"
                                strokeWidth="20"
                                strokeDasharray="100 251.2"
                                strokeDashoffset="-150"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="donut-label">60</div>
                    </div>
                </div>
            );
        }

        // Ranking Preview
        if (slideType === 'ranking') {
            const items = template.slideData.rankingItems || [];
            return (
                <div className="preview-visual">
                    <p className="preview-question">{template.slideData.question}</p>
                    <div className="preview-ranking">
                        {items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="ranking-row">
                                <span className="ranking-num">{idx + 1}.</span>
                                <div
                                    className="ranking-bar"
                                    style={{
                                        width: `${90 - idx * 20}%`,
                                        backgroundColor: idx === 0 ? '#5B7FFF' : idx === 1 ? '#FF7B7B' : '#7B8FFF'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Q&A Preview
        if (slideType === 'qa') {
            return (
                <div className="preview-visual">
                    <p className="preview-question">{template.slideData.question}</p>
                    <div className="preview-qa">
                        <div className="qa-bubble">
                            <span className="qa-icon">❓</span>
                            <span>Ask your questions...</span>
                        </div>
                    </div>
                </div>
            );
        }

        // Type Answer Quiz Preview
        if (slideType === 'type-answer') {
            return (
                <div className="preview-visual">
                    <p className="preview-question">{template.slideData.question}</p>
                    <div className="preview-type-answer">
                        <div className="type-input-box">Type your answer...</div>
                    </div>
                </div>
            );
        }

        // Text/Content Preview
        if (slideType === 'text' || slideType === 'instructions') {
            return (
                <div className="preview-visual text-slide">
                    <h3 className="text-title">{template.slideData.question}</h3>
                    {template.slideData.label && (
                        <p className="text-subtitle">{template.slideData.label}</p>
                    )}
                </div>
            );
        }

        // Default Preview
        return (
            <div className="preview-visual">
                <p className="preview-question">{template.name}</p>
            </div>
        );
    };

    const filteredTemplates = getFilteredTemplates();

    return (
        <div className="templates-picker-overlay" onClick={onClose}>
            <div className="templates-picker-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="picker-header">
                    <div className="header-tabs">
                        <button className="header-tab active">Mentimeter templates</button>
                        <button className="header-tab">
                            Workspace templates
                            <span className="pro-badge">Pro</span>
                        </button>
                    </div>
                    <button className="picker-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Category Pills */}
                <div className="category-pills">
                    <button
                        className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        All templates
                    </button>
                    {categories.slice(0, 4).map(category => (
                        <button
                            key={category.id}
                            className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                    <button className="category-pill more-btn">
                        More categories
                    </button>
                </div>

                {/* Templates Grid */}
                <div className="templates-grid-container">
                    {/* Blank Template Card */}
                    <div
                        className="template-card blank-template"
                        onClick={() => handleTemplateSelect({
                            id: 'blank',
                            name: 'Blank',
                            slideData: null
                        })}
                    >
                        <div className="blank-content">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M24 12v24M12 24h24" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <span>Start from scratch</span>
                        </div>
                        <div className="template-footer">
                            <span className="template-title">Blank template</span>
                            <span className="template-slides">1 slide</span>
                        </div>
                    </div>

                    {/* Template Cards */}
                    {filteredTemplates.map(template => (
                        <div
                            key={template.id}
                            className="template-card"
                            style={{ background: getCardBackground(template) }}
                            onClick={() => handleTemplateSelect(template)}
                        >
                            <div className="template-preview-area">
                                {renderTemplatePreview(template)}
                            </div>
                            <div className="template-footer">
                                <span className="template-title">{template.name}</span>
                                <span className="template-slides">1 slide</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && searchQuery && (
                    <div className="picker-empty-state">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="2" fill="none" />
                            <path d="M24 24l16 16M40 24L24 40" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p>No templates found for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};
