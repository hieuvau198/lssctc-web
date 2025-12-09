import React, { useState, useCallback } from 'react';
import SidebarAdmin from './partials/SidebarAdmin';
import { Outlet } from 'react-router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

/**
 * AdminLayout
 * - Hosts a collapsible sidebar (expanded vs icon-only)
 * - Responsive: mobile can toggle visibility; desktop toggles width
 * - Content area adapts automatically via flex layout
 */
export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false); // width toggle (desktop)
    const [mobileOpen, setMobileOpen] = useState(false); // visibility (mobile)

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
