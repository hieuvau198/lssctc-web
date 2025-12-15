// src\app\layouts\ProgramManagerLayout\ProgramManagerLayout.jsx

import React, { useState, useCallback } from "react";
import { Outlet } from "react-router";
import { Menu, X } from "lucide-react";
import SidebarProgramManager from "./partials/SidebarProgramManager";

/**
 * ProgramManagerLayout
 * - Hosts a collapsible sidebar (expanded vs icon-only)
 * - Responsive: mobile can toggle visibility; desktop toggles width
 * - Modern glassmorphism design with gradient backgrounds
 */
export default function ProgramManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Decorative Background Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      <SidebarProgramManager
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileToggle={toggleMobile}
        onMobileClose={closeMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 bg-white/90 backdrop-blur-md border-b border-slate-200/60 h-14 px-4 shadow-sm">
          <button
            onClick={toggleMobile}
            aria-label="Toggle navigation"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
          >
            {mobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Program Manager
          </span>
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
