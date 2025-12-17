/**
 * PageHeader - Industrial Theme Header
 * Reusable header with yellow/black industrial design
 */
import React from 'react';
import { BookOpen } from 'lucide-react';

export default function PageHeader({
    icon: Icon = BookOpen,
    title,
    subtitle,
    count,
    countLabel,
    action,
    className = '',
}) {
    return (
        <div className={`bg-yellow-400 border-2 border-black overflow-hidden ${className}`}>
            {/* Black accent bar */}
            <div className="h-1 bg-black" />

            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* Left side - Icon + Title */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-black border-2 border-black flex items-center justify-center">
                            <Icon className="w-7 h-7 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-black uppercase tracking-tight">
                                {title}
                            </h1>
                            {(subtitle || (count !== undefined && countLabel)) && (
                                <p className="text-black/70 text-sm font-medium mt-1">
                                    {subtitle || `${count} ${countLabel}`}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right side - Action button */}
                    {action && (
                        <div>{action}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
