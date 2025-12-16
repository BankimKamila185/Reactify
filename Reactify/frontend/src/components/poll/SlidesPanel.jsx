import React, { useState } from 'react';
import './SlidesPanel.css';
import pollIcon from '../../assets/icons/poll.svg';
import wordcloudIcon from '../../assets/icons/wordcloud.svg';
import openendedIcon from '../../assets/icons/openended.svg';
import scalesIcon from '../../assets/icons/scales.svg';
import rankingIcon from '../../assets/icons/ranking.svg';
import pinIcon from '../../assets/icons/pin.svg';
import { NewSlidePopup } from './NewSlidePopup';

// Get icon based on slide type
const getSlideIcon = (slideType) => {
    switch (slideType) {
        case 'word-cloud':
            return wordcloudIcon;
        case 'open-ended':
            return openendedIcon;
        case 'scales':
            return scalesIcon;
        case 'ranking':
            return rankingIcon;
        case 'pin-image':
            return pinIcon;
        case 'qa':
            return openendedIcon;
        case 'multiple-choice':
        default:
            return pollIcon;
    }
};

// Get type label for display
const getTypeLabel = (slideType) => {
    switch (slideType) {
        case 'word-cloud':
            return 'Word Cloud';
        case 'open-ended':
            return 'Open Ended';
        case 'scales':
            return 'Scales';
        case 'ranking':
            return 'Ranking';
        case 'pin-image':
            return 'Pin on Image';
        case 'qa':
            return 'Q&A';
        case 'text':
            return 'Text';
        case 'image':
            return 'Image';
        case 'video':
            return 'Video';
        case 'instructions':
            return 'Instructions';
        case 'multiple-choice':
        default:
            return 'Multiple Choice';
    }
};

export const SlidesPanel = ({
    slides,
    activeSlideId,
    onSlideSelect,
    onNewSlide,
    onDeleteSlide,
    onDuplicateSlide,
    onReorderSlides,
    onSlideTypeHover
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState({ isOpen: false, slideId: null, x: 0, y: 0 });
    const [draggedSlideId, setDraggedSlideId] = useState(null);
    const [dragOverSlideId, setDragOverSlideId] = useState(null);

    const handleNewSlideClick = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    const handleSlideTypeSelect = (slideType) => {
        onNewSlide(slideType);
        setIsPopupOpen(false);
    };

    // Context menu handlers
    const handleContextMenu = (e, slideId) => {
        e.preventDefault();
        setContextMenu({
            isOpen: true,
            slideId,
            x: e.clientX,
            y: e.clientY
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ isOpen: false, slideId: null, x: 0, y: 0 });
    };

    const handleDelete = () => {
        if (contextMenu.slideId && onDeleteSlide) {
            onDeleteSlide(contextMenu.slideId);
        }
        closeContextMenu();
    };

    const handleDuplicate = () => {
        if (contextMenu.slideId && onDuplicateSlide) {
            onDuplicateSlide(contextMenu.slideId);
        }
        closeContextMenu();
    };

    // Drag and drop handlers
    const handleDragStart = (e, slideId) => {
        setDraggedSlideId(slideId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', slideId.toString());
        // Add a small delay to allow the drag image to be captured
        setTimeout(() => {
            e.target.closest('.slide-item-row')?.classList.add('dragging');
        }, 0);
    };

    const handleDragOver = (e, slideId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedSlideId !== slideId) {
            setDragOverSlideId(slideId);
        }
    };

    const handleDragLeave = () => {
        setDragOverSlideId(null);
    };

    const handleDrop = (e, targetSlideId) => {
        e.preventDefault();
        if (draggedSlideId && targetSlideId && draggedSlideId !== targetSlideId && onReorderSlides) {
            const fromIndex = slides.findIndex(s => s.id === draggedSlideId);
            const toIndex = slides.findIndex(s => s.id === targetSlideId);
            onReorderSlides(fromIndex, toIndex);
        }
        setDraggedSlideId(null);
        setDragOverSlideId(null);
    };

    const handleDragEnd = () => {
        setDraggedSlideId(null);
        setDragOverSlideId(null);
    };

    // Close context menu when clicking outside
    React.useEffect(() => {
        const handleClick = () => closeContextMenu();
        if (contextMenu.isOpen) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [contextMenu.isOpen]);

    return (
        <div className="slides-panel" onClick={contextMenu.isOpen ? closeContextMenu : undefined}>
            <button className="new-slide-btn" onClick={handleNewSlideClick}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                New slide
            </button>

            <NewSlidePopup
                isOpen={isPopupOpen}
                onClose={handlePopupClose}
                onSelectSlideType={handleSlideTypeSelect}
                onSlideTypeHover={onSlideTypeHover}
            />

            <div className="slides-list">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide-item-row ${dragOverSlideId === slide.id ? 'drag-over' : ''} ${draggedSlideId === slide.id ? 'dragging' : ''}`}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, slide.id)}
                        onDragOver={(e) => handleDragOver(e, slide.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, slide.id)}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Drag handle */}
                        <div className="slide-drag-handle" title="Drag to reorder">
                            <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                                <circle cx="2" cy="2" r="1.5" />
                                <circle cx="8" cy="2" r="1.5" />
                                <circle cx="2" cy="7" r="1.5" />
                                <circle cx="8" cy="7" r="1.5" />
                                <circle cx="2" cy="12" r="1.5" />
                                <circle cx="8" cy="12" r="1.5" />
                            </svg>
                        </div>
                        <div className={`slide-indicator ${slide.id === activeSlideId ? 'active' : ''}`}></div>
                        <div className="slide-number-outside">{index + 1}</div>
                        <div
                            className={`slide-thumbnail ${slide.id === activeSlideId ? 'active' : ''}`}
                            onClick={() => onSlideSelect(slide.id)}
                            onContextMenu={(e) => handleContextMenu(e, slide.id)}
                        >
                            <div className="slide-content">
                                <img
                                    src={getSlideIcon(slide.type)}
                                    alt={getTypeLabel(slide.type)}
                                    className="slide-chart-icon"
                                />
                                <span className="slide-type-label">{getTypeLabel(slide.type)}</span>
                            </div>
                            <div className="slide-user-badge">BC</div>

                            {/* Quick action buttons */}
                            <div className="slide-actions">
                                <button
                                    className="slide-action-btn"
                                    onClick={(e) => { e.stopPropagation(); onDuplicateSlide && onDuplicateSlide(slide.id); }}
                                    title="Duplicate"
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
                                        <path d="M9 3V2a1 1 0 00-1-1H2a1 1 0 00-1 1v6a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" />
                                    </svg>
                                </button>
                                <button
                                    className="slide-action-btn delete"
                                    onClick={(e) => { e.stopPropagation(); onDeleteSlide && onDeleteSlide(slide.id); }}
                                    title="Delete"
                                    disabled={slides.length <= 1}
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 3h8M4 3V2a1 1 0 011-1h2a1 1 0 011 1v1M9 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Context Menu */}
            {contextMenu.isOpen && (
                <div
                    className="slide-context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button onClick={handleDuplicate}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M10 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v6a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        Duplicate slide
                    </button>
                    <button onClick={handleDelete} disabled={slides.length <= 1}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        Delete slide
                    </button>
                    <div className="context-menu-divider"></div>
                    <button onClick={() => { onSlideSelect(contextMenu.slideId); closeContextMenu(); }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        Edit slide
                    </button>
                </div>
            )}
        </div>
    );
};
