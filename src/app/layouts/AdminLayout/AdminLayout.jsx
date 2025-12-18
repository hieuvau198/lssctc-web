import React, { useState, useCallback } from 'react';
import SidebarAdmin from './partials/SidebarAdmin';
import { Outlet } from 'react-router';

/**
 * AdminLayout - Industrial Theme
 * - Black sidebar with yellow accents
 * - Clean white/neutral background
 */
export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => setCollapsed(c => !c), []);
    const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <SidebarAdmin
                collapsed={collapsed}
                onToggle={toggleCollapsed}
                mobileOpen={mobileOpen}
                onMobileToggle={toggleMobile}
                onMobileClose={closeMobile}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
