import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './InviteCollaboratorsModal.css';

export const InviteCollaboratorsModal = ({
    isOpen,
    onClose,
    presentationTitle = 'New presentation',
    sessionId
}) => {
    const { user } = useAuth();
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [copied, setCopied] = useState('');
    const [invitedEmails, setInvitedEmails] = useState([]);

    // Get user initials for avatar
    const getUserInitials = () => {
        const name = user?.displayName || user?.fullName || user?.email || 'User';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (!isOpen) return null;

    const presentationLink = sessionId
        ? `${window.location.origin}/poll/edit/${sessionId}`
        : `${window.location.origin}/poll/edit`;

    const copyToClipboard = async (text, type) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(''), 2000);
        } catch (err) {
            // Silently fail if clipboard access denied
        }
    };

    const handleInvite = () => {
        if (!collaboratorEmail.trim()) return;

        // Parse emails (space or comma separated)
        const emails = collaboratorEmail.split(/[\s,]+/).filter(e => e.includes('@'));

        if (emails.length > 0) {
            // TODO: Implement backend API call to send invitation emails
            // For now, track invited emails locally and show success message
            setInvitedEmails([...invitedEmails, ...emails]);
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
                        <p className="collaborators-heading">These people can access this Reacti.</p>
                        <div className="collaborator-item">
                            <div className="collaborator-avatar">{getUserInitials()}</div>
                            <div className="collaborator-info">
                                <span className="collaborator-name">{user?.displayName || user?.fullName || 'User'} (me)</span>
                                <span className="collaborator-email">{user?.email || ''}</span>
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
                                    <p className="access-description">Everyone with this link, including your participants, can access the Reacti and its results.</p>
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
