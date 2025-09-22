import React from 'react';
import { NavLink } from 'react-router';
import { Tooltip } from 'antd';
import {
  DashboardOutlined,
  ExperimentOutlined,
  ControlOutlined,
  ScheduleOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const ITEMS = [
  { to: '/simulationManager/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { to: '/simulationManager/scenarios', label: 'Scenarios', icon: <ExperimentOutlined /> },
  { to: '/simulationManager/configs', label: 'Simulator Configs', icon: <ControlOutlined /> },
  { to: '/simulationManager/sessions', label: 'Sessions', icon: <ScheduleOutlined /> },
  { to: '/simulationManager/settings', label: 'Settings', icon: <SettingOutlined /> },
];

export default function SidebarSimManager({ collapsed, onToggle, mobileOpen, onMobileToggle, onMobileClose }) {
  return (
    <>
      {mobileOpen && (
        <div onClick={onMobileClose} className="fixed inset-0 bg-black/40 z-40 md:hidden" aria-hidden />
      )}
      <aside
        className={[
          'flex flex-col bg-white border-r border-r-gray-300 shadow-md z-50',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-24' : 'w-56',
          'h-screen fixed md:sticky top-0 left-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between h-14 px-3 border-b border-b-slate-300">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center justify-center bg-blue-600 text-white font-bold rounded size-8 shrink-0 text-lg">
              S
            </div>
            {!collapsed && <span className="font-semibold text-sm tracking-wide">Simulator Manager</span>}
          </div>
          <button
            onClick={onToggle}
            className="hidden md:inline-flex w-8 h-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <button
            onClick={onMobileToggle}
            className="md:hidden inline-flex w-8 h-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label="Close navigation"
          >
            <MenuFoldOutlined />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-1 px-2">
            {ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onMobileClose}
                  className={({ isActive }) => [
                    'group flex items-center rounded-md py-2 text-sm font-medium transition-colors',
                    collapsed ? 'justify-center mx-2.5' : 'gap-3 px-3',
                    isActive ? 'bg-blue-200/85 text-blue-600' : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900',
                  ].join(' ')}
                  aria-label={collapsed ? item.label : undefined}
                >
                  {collapsed ? (
                    <Tooltip placement="right" title={item.label}>
                      <span className="text-lg flex-shrink-0 mx-auto">{item.icon}</span>
                    </Tooltip>
                  ) : (
                    <>
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
