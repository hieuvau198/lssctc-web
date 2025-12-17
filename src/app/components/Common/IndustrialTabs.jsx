/**
 * IndustrialTabs - Industrial Theme Tabs
 * Tab navigation with yellow accent and bold typography
 */
import React from 'react';

export default function IndustrialTabs({
    tabs = [],
    activeKey,
    onChange,
    className = '',
}) {
    return (
        <div className={`border-b-2 border-neutral-200 ${className}`}>
            <div className="flex gap-0 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onChange?.(tab.key)}
                        className={`px-6 py-4 font-bold uppercase tracking-wider text-sm border-b-4 transition-all whitespace-nowrap flex items-center gap-2 ${activeKey === tab.key
                                ? 'border-yellow-400 text-black bg-yellow-50'
                                : 'border-transparent text-neutral-400 hover:text-black hover:border-neutral-300 hover:bg-neutral-50'
                            }`}
                    >
                        {tab.icon && <tab.icon className="w-5 h-5" />}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`ml-1 px-2 py-0.5 text-xs ${activeKey === tab.key
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-neutral-200 text-neutral-600'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
