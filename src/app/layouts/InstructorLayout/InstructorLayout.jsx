import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router';
import SidebarInstructor from './partials/SidebarInstructor';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function InstructorLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen flex">
      <SidebarInstructor
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileToggle={toggleMobile}
        onMobileClose={closeMobile}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b h-12 px-3 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMobile}
              aria-label="Toggle navigation"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-gray-50"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
              )}
            </button>
            <span className="font-semibold">Instructor</span>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Desktop top bar with language switcher */}
        <div className="hidden md:flex sticky top-0 z-30 items-center justify-end bg-white border-b h-12 px-4 shadow-sm">
          <LanguageSwitcher />
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
