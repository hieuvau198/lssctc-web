import React from 'react';

/**
 * IndustrialCard - A card component with industrial theme
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.accentColor - Accent bar color (default: 'yellow-400')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.noPadding - Whether to remove inner padding
 */
export default function IndustrialCard({
    children,
    accentColor = 'yellow-400',
    className = '',
    noPadding = false
}) {
    return (
        <div className={`bg-white border-2 border-black overflow-hidden ${className}`}>
            {/* Accent bar */}
            <div className={`h-1 bg-${accentColor}`} />

            {/* Content */}
            <div className={noPadding ? '' : 'p-6'}>
                {children}
            </div>
        </div>
    );
}

/**
 * IndustrialCardHeader - Header section for IndustrialCard
 */
export function IndustrialCardHeader({ children, className = '' }) {
    return (
        <div className={`border-b-2 border-neutral-200 ${className}`}>
            {children}
        </div>
    );
}

/**
 * IndustrialCardContent - Content section for IndustrialCard
 */
export function IndustrialCardContent({ children, className = '' }) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}
