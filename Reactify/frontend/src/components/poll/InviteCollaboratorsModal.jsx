import React, { useState } from 'react';
import './InviteCollaboratorsModal.css';

export const InviteCollaboratorsModal = ({
    isOpen,
    onClose,
    presentationTitle = 'New presentation'
}) => {
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [copied, setCopied] = useState('');

    if (!isOpen) return null;

    const presentationLink = `${window.location.origin}/poll/edit`;

    const copyToClipboard = async (text, type) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleInvite = () => {
        if (!collaboratorEmail.trim()) return;

        // Parse emails (space or comma separated)
        const emails = collaboratorEmail.split(/[\s,]+/).filter(e => e.includes('@'));

        if (emails.length > 0) {
            console.log('Inviting collaborators:', emails);
            // TODO: Send invitations via backend API
            alert(`Invitations sent to: ${emails.join(', ')}`);
            setCollaboratorEmail('');
        }
    };

    return (
        <div className="invite-modal-overlay" onClick={onClose}>
            <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="invite-modal-header">
                    <h2>Share {presentationTitle}</h2>
                    <button className="invite-modal-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="invite-modal-content">
                    {/* Pro Banner */}
                    <div className="pro-banner">
                        <p>You can invite others to comment. To edit together, all collaborators need to be on Pro.</p>
                        <button className="see-plans-btn">⭐ See plans</button>
                    </div>

                    {/* Email Input */}
                    <div className="invite-section">
                        <label className="invite-label">Email</label>
                        <div className="email-input-group">
                            <input
                                type="text"
                                className="invite-input"
                                placeholder="Separate emails with space"
                                value={collaboratorEmail}
                                onChange={(e) => setCollaboratorEmail(e.target.value)}
                            />
                            <button
                                className="invite-btn"
                                onClick={handleInvite}
                                disabled={!collaboratorEmail.trim()}
                            >
                                Invite
                            </button>
                        </div>
                    </div>

                    {/* Collaborators List */}
                    <div className="invite-section">
                        <p className="collaborators-heading">These people can access this Menti.</p>
                        <div className="collaborator-item">
                            <div className="collaborator-avatar">BC</div>
                            <div className="collaborator-info">
                                <span className="collaborator-name">Bankim Chandra Kamila (BTech CSE 2024-28) (me)</span>
                                <span className="collaborator-email">2024.bankimc@isu.ac.in</span>
                            </div>
                            <span className="collaborator-role">Owner</span>
                        </div>
                    </div>

                    <div className="invite-divider"></div>

                    {/* Access Level */}
                    <div className="invite-section">
                        <label className="invite-label">Access level</label>
                        <div className="access-row">
                            <div className="access-level-info">
                                <span className="access-icon">🌐</span>
                                <div>
                                    <span className="access-type"><strong>Public</strong> (open for participants) ⭐</span>
                                    <p className="access-description">Everyone with this link, including your participants, can access the Menti and its results.</p>
                                </div>
                            </div>
                            <button
                                className="action-link"
                                onClick={() => copyToClipboard(presentationLink, 'link')}
                            >
                                {copied === 'link' ? 'Copied!' : 'Copy link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
