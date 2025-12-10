import React from 'react';
import './FeatureCard.css';

// Import SVG icons
import WordCloudIcon from '../../assets/icons/wordcloud.svg';
import PollIcon from '../../assets/icons/poll.svg';
import OpenEndedIcon from '../../assets/icons/openended.svg';
import ScalesIcon from '../../assets/icons/scales.svg';
import RankingIcon from '../../assets/icons/ranking.svg';
import PinIcon from '../../assets/icons/pin.svg';

const FeatureIcon = ({ iconType }) => {
    const icons = {
        wordcloud: WordCloudIcon,
        poll: PollIcon,
        openended: OpenEndedIcon,
        scales: ScalesIcon,
        ranking: RankingIcon,
        pin: PinIcon
    };

    const IconComponent = icons[iconType];

    if (!IconComponent) return null;

    return <img src={IconComponent} alt={iconType} className="feature-icon-svg" />;
};

export const FeatureCard = ({ iconType, name, color }) => {
    return (
        <div className="feature-card">
            <div className="feature-icon-container" style={{ color: color }}>
                <FeatureIcon iconType={iconType} />
            </div>
            <div className="feature-name">{name}</div>
        </div>
    );
};
