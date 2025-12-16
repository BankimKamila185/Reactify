import React, { useState, useRef } from 'react';
import './ImageUploadModal.css';

export const ImageUploadModal = ({ isOpen, onClose, onImageSelect }) => {
    const [activeTab, setActiveTab] = useState('upload');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        // Check file size (15MB limit)
        if (file.size > 15 * 1024 * 1024) {
            alert('File size exceeds 15MB limit');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            onImageSelect(event.target.result);
            onClose();
        };
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="image-modal-header">
                    <h2 className="image-modal-title">Upload image</h2>
                    <button className="image-modal-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="image-modal-tabs">
                    <button
                        className={`image-modal-tab ${activeTab === 'library' ? 'active' : ''}`}
                        onClick={() => setActiveTab('library')}
                    >
                        Image library
                    </button>
                    <button
                        className={`image-modal-tab ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload
                    </button>
                    <button
                        className={`image-modal-tab ${activeTab === 'gifs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gifs')}
                    >
                        Gifs
                    </button>
                </div>

                {/* Content */}
                <div className="image-modal-content">
                    {activeTab === 'upload' && (
                        <div
                            className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleUploadClick}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".png,.jpg,.jpeg,.gif,.svg"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                            <div className="upload-icon">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <path d="M8 42l14-14 10 10 16-16 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="22" cy="26" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                            <p className="upload-text">Drag and drop or click to upload image.</p>
                            <p className="upload-info">Maximum file size is 15 MB.</p>
                            <p className="upload-formats">.png .jpg .jpeg .gif .svg</p>
                        </div>
                    )}

                    {activeTab === 'library' && (
                        <div className="library-placeholder">
                            <p>Image library coming soon...</p>
                        </div>
                    )}

                    {activeTab === 'gifs' && (
                        <div className="gifs-placeholder">
                            <p>GIF search coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
