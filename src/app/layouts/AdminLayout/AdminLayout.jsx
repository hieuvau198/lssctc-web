import React, { useState, useCallback } from 'react';
import SidebarAdmin from './partials/SidebarAdmin';
import { Outlet } from 'react-router';

/**
 * AdminLayout
 * - Hosts a collapsible sidebar (expanded vs icon-only)
 * - Responsive: mobile can toggle visibility; desktop toggles width
 * - Content area adapts automatically via flex layout
 * - Modern glassmorphism design with gradient backgrounds
 */
export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false); // width toggle (desktop)
    const [mobileOpen, setMobileOpen] = useState(false); // visibility (mobile)

    const toggleCollapsed = useCallback(() => setCollapsed(c => !c), []);
    const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
            {/* Decorative Background Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
            </div>

            {/* Sidebar */}
            <SidebarAdmin
                collapsed={collapsed}
                onToggle={toggleCollapsed}
                mobileOpen={mobileOpen}
                onMobileToggle={toggleMobile}
                onMobileClose={closeMobile}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
