// src\app\layouts\SimManagerLayout\SimManagerLayout.jsx

import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router';
import SidebarSimManager from './partials/SidebarSimManager';

/**
 * SimManagerLayout - Industrial Theme
 * - Black sidebar with yellow accents
 * - Clean white/neutral background
 */
export default function SimManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed(c => !c), []);
  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen flex">
      <SidebarSimManager
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileToggle={toggleMobile}
        onMobileClose={closeMobile}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
