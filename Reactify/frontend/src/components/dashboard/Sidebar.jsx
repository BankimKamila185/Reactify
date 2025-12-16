import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Import sidebar icons
import ReactifyLogo from '../../assets/icons/reactify-logo.svg';
import HomeIcon from '../../assets/icons/house-blank.svg';
import UserIcon from '../../assets/icons/user.svg';
import ShareIcon from '../../assets/icons/screen-share.svg';
import PeopleIcon from '../../assets/icons/people-line (1).svg';
import DocumentIcon from '../../assets/icons/document-circle-arrow-up.svg';

export const Sidebar = () => {
    const location = useLocation();

    const mainMenuItems = [
        { id: 1, label: 'Home', path: '/dashboard', iconSrc: HomeIcon },
        { id: 2, label: 'My presentations', path: '/my-presentations', iconSrc: UserIcon },
        { id: 3, label: 'Shared with me', path: '/shared-with-me', iconSrc: ShareIcon }
    ];

    const teamMenuItems = [
        { id: 4, label: 'Workspace presentations', path: '/workspace', iconSrc: PeopleIcon },
        { id: 5, label: 'Shared templates', path: '/templates', iconSrc: DocumentIcon }
    ];

    const bottomMenuItems = [
        { id: 6, label: 'Templates', path: '/all-templates' },
        { id: 7, label: 'Integrations', path: '/integrations' },
        { id: 9, label: 'Help', path: '/help' },
        { id: 10, label: 'Trash', path: '/trash' }
    ];

    return (
        <aside className="sidebar-new">
            {/* Logo */}
            <div className="sidebar-logo-section">
                <div className="sidebar-brand">
                    <img src={ReactifyLogo} alt="Reactify Logo" className="sidebar-logo" />
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav-new">
                <ul className="nav-list-new">
                    {mainMenuItems.map(item => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className={`nav-item-new ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="nav-icon-new">
                                    <img src={item.iconSrc} alt={item.label} className="sidebar-icon-svg" />
                                </span>
                                <span className="nav-label-new">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Team Section */}
                <div className="nav-section-divider">
                    <span className="section-title">Bankim Chandra's team</span>
                </div>

                <ul className="nav-list-new">
                    {teamMenuItems.map(item => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className={`nav-item-new ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="nav-icon-new">
                                    <img src={item.iconSrc} alt={item.label} className="sidebar-icon-svg" />
                                </span>
                                <span className="nav-label-new">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Navigation */}
            <div className="sidebar-bottom">
                <ul className="nav-list-new bottom-list">
                    {bottomMenuItems.map(item => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className={`nav-item-new ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="nav-label-new">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};
