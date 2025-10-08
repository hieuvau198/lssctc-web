import React, { useState, useCallback } from 'react';
import { Outlet, NavLink } from 'react-router';

export default function InstructorLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((o)=>!o), []);

  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium';
  const getLinkClass = ({ isActive }) => [
    linkBase,
    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
  ].join(' ');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-4 gap-3">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-gray-50"
              onClick={toggleMobile}
              aria-label="Toggle Navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
            </button>
            <span className="font-semibold text-blue-700">Instructor</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/instructor/dashboard" className={getLinkClass}>Dashboard</NavLink>
            <NavLink to="/instructor/classes" className={getLinkClass}>Classes</NavLink>
            <NavLink to="/instructor/sections" className={getLinkClass}>Sections</NavLink>
            <NavLink to="/instructor/settings" className={getLinkClass}>Settings</NavLink>
          </nav>
        </div>
        {/* Mobile panel */}
        <div className={[
            'md:hidden border-t bg-white overflow-hidden transition-all',
            mobileOpen ? 'max-h-56' : 'max-h-0'
          ].join(' ')}>
          <div className="px-3 py-2 flex flex-col gap-1">
            <NavLink to="/instructor/dashboard" className={getLinkClass} onClick={()=>setMobileOpen(false)}>Dashboard</NavLink>
            <NavLink to="/instructor/classes" className={getLinkClass} onClick={()=>setMobileOpen(false)}>Classes</NavLink>
            <NavLink to="/instructor/sections" className={getLinkClass} onClick={()=>setMobileOpen(false)}>Sections</NavLink>
            <NavLink to="/instructor/settings" className={getLinkClass} onClick={()=>setMobileOpen(false)}>Settings</NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
