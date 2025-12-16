import React, { useState } from 'react';
import './CommentsPanel.css';

export const CommentsPanel = ({ slides, activeSlideId, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            slideId: activeSlideId,
            text: newComment.trim(),
            author: 'BC',
            timestamp: new Date(),
            resolved: false
        };

        setComments([...comments, comment]);
        setNewComment('');
    };

    const handleResolve = (commentId) => {
        setComments(comments.map(c =>
            c.id === commentId ? { ...c, resolved: !c.resolved } : c
        ));
    };

    const handleDelete = (commentId) => {
        setComments(comments.filter(c => c.id !== commentId));
    };

    const activeSlide = slides.find(s => s.id === activeSlideId);
    const slideComments = comments.filter(c => c.slideId === activeSlideId);

    return (
        <div className="comments-panel">
            <div className="comments-header">
                <h3>Comments</h3>
                <button className="close-btn" onClick={onClose}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="comments-slide-info">
                <span className="slide-label">Slide {slides.findIndex(s => s.id === activeSlideId) + 1}</span>
                <span className="slide-type">{activeSlide?.type || 'Multiple Choice'}</span>
            </div>

            <div className="comments-list">
                {slideComments.length === 0 ? (
                    <div className="no-comments">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M8 12a4 4 0 014-4h16a4 4 0 014 4v12a4 4 0 01-4 4h-8l-6 5v-5H12a4 4 0 01-4-4V12z" stroke="#9CA3AF" strokeWidth="2" fill="none" />
                        </svg>
                        <p>No comments yet</p>
                        <span>Add a comment to discuss this slide</span>
                    </div>
                ) : (
                    slideComments.map(comment => (
                        <div key={comment.id} className={`comment-item ${comment.resolved ? 'resolved' : ''}`}>
                            <div className="comment-header">
                                <div className="comment-author">
                                    <span className="author-avatar">{comment.author}</span>
                                    <span className="author-name">You</span>
                                </div>
                                <div className="comment-actions">
                                    <button
                                        className="resolve-btn"
                                        onClick={() => handleResolve(comment.id)}
                                        title={comment.resolved ? 'Unresolve' : 'Resolve'}
                                    >
                                        {comment.resolved ? '↩' : '✓'}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(comment.id)}
                                        title="Delete"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                            <span className="comment-time">
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <div className="comment-input-container">
                <input
                    type="text"
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                    className="send-btn"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 2L7 9M14 2l-5 12-2-5-5-2 12-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
