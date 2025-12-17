/**
 * IndustrialButton - Industrial Theme Button
 * Yellow/black button with sharp corners and bold typography
 * Variants: primary (yellow), secondary (black), outline, danger
 */
import React from 'react';

export default function IndustrialButton({
    children,
    icon: Icon,
    variant = 'primary',
    size = 'default',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    type = 'button',
}) {
    const baseClasses = 'inline-flex items-center gap-2 font-bold uppercase tracking-wider border-2 border-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-[1.02] hover:shadow-lg',
        secondary: 'bg-black text-yellow-400 hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-lg',
        outline: 'bg-white text-black hover:bg-neutral-100 hover:scale-[1.02]',
        danger: 'bg-red-500 text-white border-red-600 hover:bg-red-600 hover:scale-[1.02]',
        ghost: 'bg-transparent text-black border-transparent hover:bg-neutral-100',
    };

    const sizeClasses = {
        small: 'px-3 py-1.5 text-xs',
        default: 'px-5 py-2.5 text-sm',
        large: 'px-6 py-3 text-sm',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : Icon ? (
                <Icon className="w-4 h-4" />
            ) : null}
            {children}
        </button>
    );
}
