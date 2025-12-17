import React from 'react';

/**
 * IndustrialPageHeader - A reusable header component with industrial theme
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component (from lucide-react)
 * @param {string} props.title - Main title text
 * @param {string} props.subtitle - Subtitle/count text
 * @param {React.ReactNode} props.actions - Action buttons/elements
 * @param {string} props.className - Additional CSS classes
 */
export default function IndustrialPageHeader({
    icon: Icon,
    title,
    subtitle,
    actions,
    className = ''
}) {
    return (
        <div className={`bg-black border-2 border-black p-5 mb-6 ${className}`}>
            {/* Yellow accent bar */}
            <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />

            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Left side - Icon and Title */}
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
                            <Icon className="w-6 h-6 text-black" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-yellow-400 text-sm mt-1 font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right side - Actions */}
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * IndustrialButton - A button with industrial theme styling
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.children - Button text
 * @param {string} props.variant - 'primary' (yellow) | 'secondary' (white)
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export function IndustrialButton({
    icon: Icon,
    children,
    variant = 'primary',
    onClick,
    className = '',
    ...props
}) {
    const baseClasses = "inline-flex items-center gap-2 px-4 py-2.5 font-bold uppercase tracking-wider text-sm border-2 border-black hover:scale-[1.02] transition-all";
    const variantClasses = variant === 'primary'
        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
        : 'bg-white text-black hover:bg-neutral-100';

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
}
