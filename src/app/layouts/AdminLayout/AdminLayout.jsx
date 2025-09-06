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
                {/* Top bar (only shows collapse control on small screens) */}
                <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 bg-white border-b h-12 px-3 shadow-sm">
                    <button
                        onClick={toggleMobile}
                        aria-label="Toggle navigation"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-gray-50"
                    >
                        {mobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    </button>
                    <span className="font-semibold">Admin</span>
                </div>

                <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
