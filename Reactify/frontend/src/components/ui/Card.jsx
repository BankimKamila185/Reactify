import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
    const hoverClass = hover ? 'card-hover cursor-pointer' : '';

    return (
        <div className={`bg-white rounded-xl shadow-md p-6 ${hoverClass} ${className}`}>
            {children}
        </div>
    );
};
