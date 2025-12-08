import React from 'react';

export const Input = ({
    label,
    error,
    fullWidth = false,
    className = '',
    ...props
}) => {
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <div className={`${widthStyle}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`block ${widthStyle} px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
