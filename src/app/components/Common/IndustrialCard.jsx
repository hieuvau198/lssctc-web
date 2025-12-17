/**
 * IndustrialCard - Industrial Theme Card
 * Card with border-2, optional accent bar and sharp corners
 */
import React from 'react';

export default function IndustrialCard({
    children,
    title,
    subtitle,
    icon: Icon,
    accent = 'yellow', // 'yellow', 'black', 'none'
    headerAction,
    className = '',
    bodyClassName = '',
    noPadding = false,
}) {
    const accentColors = {
        yellow: 'bg-yellow-400',
        black: 'bg-black',
        red: 'bg-red-500',
        none: '',
    };

    return (
        <div className={`bg-white border-2 border-black overflow-hidden ${className}`}>
            {/* Accent bar */}
            {accent !== 'none' && (
                <div className={`h-1 ${accentColors[accent]}`} />
            )}

            {/* Header (optional) */}
            {(title || Icon) && (
                <div className="px-6 py-4 border-b-2 border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                                <Icon className="w-5 h-5 text-black" />
                            </div>
                        )}
                        <div>
                            {title && (
                                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}

            {/* Body */}
            <div className={noPadding ? '' : `p-6 ${bodyClassName}`}>
                {children}
            </div>
        </div>
    );
}
