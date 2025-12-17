import React from 'react';
import './ContentSlideCanvas.css';

export const TextCanvas = ({
    slide,
    onQuestionChange,
    onContentChange,
    joinCode,
    isEditorMode = false
}) => {
    const content = slide?.content || '';
    const title = slide?.question || '';

    return (
        <div className="content-canvas text-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="text-content-area">
                    {isEditorMode ? (
                        <>
                            <input
                                type="text"
                                className="title-input"
                                placeholder="Add a title..."
                                value={title}
                                onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                            />
                            <textarea
                                className="content-textarea"
                                placeholder="Add your text content here..."
                                value={content}
                                onChange={(e) => onContentChange && onContentChange(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <h1 className="text-title">{title || 'Title'}</h1>
                            <p className="text-content">{content || 'Your content here...'}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ImageCanvas = ({
    slide,
    onQuestionChange,
    onImageChange,
    joinCode,
    isEditorMode = false
}) => {
    const imageUrl = slide?.imageUrl || null;
    const caption = slide?.question || '';

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file && onImageChange) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageChange(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="content-canvas image-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="image-content-area">
                    {imageUrl ? (
                        <div className="image-preview">
                            <img src={imageUrl} alt="Slide" />
                            {isEditorMode && (
                                <button
                                    className="change-image-btn"
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    Change Image
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            className="image-placeholder"
                            onClick={() => isEditorMode && document.getElementById('image-upload').click()}
                        >
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="6" y="10" width="36" height="28" rx="4" stroke="#9CA3AF" strokeWidth="2" />
                                <path d="M6 30l10-10 8 8 12-12 6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="16" cy="18" r="3" fill="#9CA3AF" />
                            </svg>
                            <p>{isEditorMode ? 'Click to upload an image' : 'No image'}</p>
                        </div>
                    )}
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    {isEditorMode && (
                        <input
                            type="text"
                            className="caption-input"
                            placeholder="Add a caption..."
                            value={caption}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    )}
                    {!isEditorMode && caption && (
                        <p className="image-caption">{caption}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const VideoCanvas = ({
    slide,
    onQuestionChange,
    onVideoUrlChange,
    joinCode,
    isEditorMode = false
}) => {
    const videoUrl = slide?.videoUrl || '';
    const caption = slide?.question || '';

    const getEmbedUrl = (url) => {
        if (!url) return null;

        // YouTube
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        if (ytMatch) {
            return `https://www.youtube.com/embed/${ytMatch[1]}`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return url;
    };

    const embedUrl = getEmbedUrl(videoUrl);

    return (
        <div className="content-canvas video-canvas">
            <div className="canvas-header">
                <div className="join-info">
                    <span>Go to <strong>reacti.com</strong></span>
                    <span className="join-code">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body">
                <div className="video-content-area">
                    {embedUrl ? (
                        <div className="video-wrapper">
                            <iframe
                                src={embedUrl}
                                title="Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="video-placeholder">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="6" y="10" width="36" height="28" rx="4" stroke="#9CA3AF" strokeWidth="2" />
                                <path d="M20 18v12l10-6-10-6z" fill="#9CA3AF" />
                            </svg>
                            <p>Add a YouTube or Vimeo link</p>
                        </div>
                    )}
                    {isEditorMode && (
                        <>
                            <input
                                type="text"
                                className="video-url-input"
                                placeholder="Paste YouTube or Vimeo URL..."
                                value={videoUrl}
                                onChange={(e) => onVideoUrlChange && onVideoUrlChange(e.target.value)}
                            />
                            <input
                                type="text"
                                className="caption-input"
                                placeholder="Add a caption..."
                                value={caption}
                                onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                            />
                        </>
                    )}
                    {!isEditorMode && caption && (
                        <p className="video-caption">{caption}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const InstructionsCanvas = ({
    slide,
    onQuestionChange,
    joinCode,
    isEditorMode = false
}) => {
    const title = slide?.question || 'Welcome!';
    const subtitle = slide?.content || 'Join the presentation using the code above';

    return (
        <div className="content-canvas instructions-canvas">
            <div className="canvas-header large">
                <div className="join-info-large">
                    <span className="join-label">Go to</span>
                    <span className="join-url">reacti.com</span>
                    <span className="join-label">and use code</span>
                    <span className="join-code-large">{joinCode}</span>
                </div>
            </div>

            <div className="canvas-body instructions-body">
                {isEditorMode ? (
                    <>
                        <input
                            type="text"
                            className="instructions-title-input"
                            placeholder="Welcome message..."
                            value={title}
                            onChange={(e) => onQuestionChange && onQuestionChange(e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <h1 className="instructions-title">{title}</h1>
                        <p className="instructions-subtitle">{subtitle}</p>
                    </>
                )}
            </div>
        </div>
    );
};
