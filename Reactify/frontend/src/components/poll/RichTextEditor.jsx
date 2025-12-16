import React, { useState, useRef } from 'react';
import './RichTextEditor.css';

export const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [showLinkInput, setShowLinkInput] = useState(false);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleInput = (e) => {
        onChange(e.target.innerHTML);
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    return (
        <div className="rich-text-editor">
            <div className="editor-toolbar">
                <button className="toolbar-btn suggest-btn" title="Suggest">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-1.5L7 1z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                    Suggest
                </button>

                <select className="toolbar-select" defaultValue="default">
                    <option value="default">Default</option>
                    <option value="heading1">Heading 1</option>
                    <option value="heading2">Heading 2</option>
                </select>

                <div className="toolbar-divider"></div>

                <button
                    className="toolbar-btn icon-btn"
                    onClick={() => execCommand('bold')}
                    title="Bold"
                >
                    <strong>B</strong>
                </button>

                <button
                    className="toolbar-btn icon-btn"
                    onClick={() => execCommand('italic')}
                    title="Italic"
                >
                    <em>I</em>
                </button>

                <button
                    className="toolbar-btn icon-btn"
                    onClick={() => execCommand('underline')}
                    title="Underline"
                >
                    <u>U</u>
                </button>

                <button
                    className="toolbar-btn icon-btn"
                    onClick={() => execCommand('strikeThrough')}
                    title="Strikethrough"
                >
                    <s>S</s>
                </button>

                <button
                    className="toolbar-btn icon-btn"
                    onClick={insertLink}
                    title="Insert Link"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6.5 8.5l3-3M7 11l1.5-1.5M4 9l-1.5 1.5a2.5 2.5 0 003.5 3.5L7.5 12.5M9 4l1.5-1.5a2.5 2.5 0 013.5 3.5L12.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <button className="toolbar-btn icon-btn" title="More options">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                        <circle cx="13" cy="8" r="1.5" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: value }}
                data-placeholder={placeholder}
            />
        </div>
    );
};
