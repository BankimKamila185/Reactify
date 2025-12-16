import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import './ShareModal.css';

export const ShareModal = ({
    isOpen,
    onClose,
    joinCode,
    sessionId,
    onStartPresentation,
    isStarting,
    presentationTitle = 'New presentation',
    initialTab = 'participants'
}) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [copied, setCopied] = useState('');
    const [expirationDays, setExpirationDays] = useState('2');
    const [enableParticipation, setEnableParticipation] = useState(true);
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    // Update active tab when initialTab or isOpen changes
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [initialTab, isOpen]);

    const formatJoinCode = (code) => {
        if (!code) return '---- ----';
        const cleaned = code.toString().replace(/\s/g, '');
        if (cleaned.length === 6) {
            return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
        }
        return cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
    };

    // Always generate participation link with joinCode
    const participationLink = joinCode
        ? `${window.location.origin}/join?code=${joinCode.replace(/\s/g, '')}`
        : `${window.location.origin}/join`;

    // Generate QR code when modal is open
    useEffect(() => {
        if (joinCode && isOpen) {
            QRCode.toDataURL(participationLink, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#1F2937',
                    light: '#FFFFFF'
                }
            })
                .then(url => {
                    setQrCodeUrl(url);
                })
                .catch(err => {
                    console.error('Failed to generate QR code:', err);
                });
        }
    }, [joinCode, participationLink, isOpen]);

    if (!isOpen) return null;

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

    // Download QR code as image
    const downloadQRCode = () => {
        if (!qrCodeUrl) return;

        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `${presentationTitle.replace(/\s+/g, '_')}_QR_Code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle expiration change
    const handleExpirationChange = (days) => {
        setExpirationDays(days);
        // TODO: Save to backend when API is ready
        console.log(`Session expiration set to ${days} days`);
    };

    // Handle participation toggle
    const handleParticipationToggle = (enabled) => {
        setEnableParticipation(enabled);
        // TODO: Save to backend when API is ready
        console.log(`Participation ${enabled ? 'enabled' : 'disabled'}`);
    };

    // Generate embed code
    const getEmbedCode = () => {
        return `<iframe src="${participationLink}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
    };

    return (
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal-v2" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="share-modal-header-v2">
                    <h2>Share {presentationTitle}</h2>
                    <button className="share-modal-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="share-tabs">
                    <button
                        className={`share-tab ${activeTab === 'participants' ? 'active' : ''}`}
                        onClick={() => setActiveTab('participants')}
                    >
                        Participants
                    </button>
                    <button
                        className={`share-tab ${activeTab === 'collaborators' ? 'active' : ''}`}
                        onClick={() => setActiveTab('collaborators')}
                    >
                        Collaborators
                    </button>
                </div>

                {/* Content */}
                <div className="share-modal-content-v2">
                    {activeTab === 'participants' ? (
                        <>
                            {/* Participation Link */}
                            <div className="share-section-v2">
                                <label className="share-label-v2">Participation link</label>
                                <div className="link-input-group">
                                    <input
                                        type="text"
                                        className="share-input"
                                        value={participationLink}
                                        readOnly
                                    />
                                    <button
                                        className="copy-btn-v2"
                                        onClick={() => copyToClipboard(participationLink, 'link')}
                                    >
                                        {copied === 'link' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code Access */}
                            <div className="share-section-v2">
                                <div className="share-row">
                                    <div>
                                        <label className="share-label-v2">QR code access</label>
                                        <p className="share-description">Participants can join your Menti using this QR code.</p>
                                    </div>
                                    <button className="action-link" onClick={downloadQRCode}>
                                        Download
                                    </button>
                                </div>
                                {/* QR Code Preview */}
                                {qrCodeUrl && (
                                    <div className="qr-preview">
                                        <img src={qrCodeUrl} alt="QR Code" />
                                    </div>
                                )}
                            </div>

                            {/* Access Code Expiration */}
                            <div className="share-section-v2">
                                <div className="share-row">
                                    <div>
                                        <label className="share-label-v2">Set access code expiration</label>
                                        <p className="share-description">
                                            Choose how long the code for your Menti is active. The code <strong>{formatJoinCode(joinCode)}</strong> expires <strong>in {expirationDays} days</strong>.
                                        </p>
                                    </div>
                                    <select
                                        className="expiration-select"
                                        value={expirationDays}
                                        onChange={(e) => handleExpirationChange(e.target.value)}
                                    >
                                        <option value="1">1 day</option>
                                        <option value="2">2 days</option>
                                        <option value="7">7 days</option>
                                        <option value="30">30 days</option>
                                    </select>
                                </div>
                            </div>

                            {/* Enable Participation */}
                            <div className="share-section-v2">
                                <div className="share-row">
                                    <div>
                                        <label className="share-label-v2">Enable participation</label>
                                        <p className="share-description">Anyone with the link, voting code, or QR code can join and interact with your Menti.</p>
                                    </div>
                                    <label className="toggle-switch-v2">
                                        <input
                                            type="checkbox"
                                            checked={enableParticipation}
                                            onChange={(e) => handleParticipationToggle(e.target.checked)}
                                        />
                                        <span className="toggle-slider-v2"></span>
                                    </label>
                                </div>
                            </div>

                            {/* Embed Slides */}
                            <div className="share-section-v2">
                                <div className="share-row">
                                    <div>
                                        <label className="share-label-v2">Embed slides</label>
                                        <p className="share-description">Use this code to embed your Menti online with live results</p>
                                    </div>
                                    <button className="action-link" onClick={() => copyToClipboard(getEmbedCode(), 'embed')}>
                                        {copied === 'embed' ? 'Copied!' : 'Copy code'}
                                    </button>
                                </div>
                            </div>

                            <div className="share-divider"></div>

                            {/* Access Level */}
                            <div className="share-section-v2">
                                <label className="share-label-v2">Access level</label>
                                <div className="share-row">
                                    <div className="access-level-info">
                                        <span className="access-icon">🌐</span>
                                        <div>
                                            <span className="access-type"><strong>Public</strong> (open for participants) ⭐</span>
                                            <p className="share-description">Everyone with this link, including your participants, can access the Menti and its results.</p>
                                        </div>
                                    </div>
                                    <button className="action-link" onClick={() => copyToClipboard(participationLink, 'access')}>
                                        {copied === 'access' ? 'Copied!' : 'Copy link'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Collaborators Tab */
                        <>
                            {/* Pro Banner */}
                            <div className="pro-banner">
                                <p>You can invite others to comment. To edit together, all collaborators need to be on Pro.</p>
                                <button className="see-plans-btn">⭐ See plans</button>
                            </div>

                            {/* Email Input */}
                            <div className="share-section-v2">
                                <label className="share-label-v2">Email</label>
                                <input
                                    type="text"
                                    className="share-input email-input"
                                    placeholder="Separate emails with space"
                                    value={collaboratorEmail}
                                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                                />
                            </div>

                            {/* Collaborators List */}
                            <div className="share-section-v2">
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

                            <div className="share-divider"></div>

                            {/* Access Level */}
                            <div className="share-section-v2">
                                <label className="share-label-v2">Access level</label>
                                <div className="share-row">
                                    <div className="access-level-info">
                                        <span className="access-icon">🌐</span>
                                        <div>
                                            <span className="access-type"><strong>Public</strong> (open for participants) ⭐</span>
                                            <p className="share-description">Everyone with this link, including your participants, can access the Menti and its results.</p>
                                        </div>
                                    </div>
                                    <button className="action-link" onClick={() => copyToClipboard(participationLink, 'access')}>
                                        {copied === 'access' ? 'Copied!' : 'Copy link'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
