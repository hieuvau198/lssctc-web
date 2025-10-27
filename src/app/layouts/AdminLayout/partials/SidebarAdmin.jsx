import {
  BookOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { NavLink } from 'react-router';
import { Layers } from 'lucide-react';

const ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { to: '/admin/users', label: 'Users', icon: <UserOutlined /> },
  { to: '/admin/programs', label: 'Programs', icon: <Layers className="w-5 h-5" /> },
  { to: '/admin/courses', label: 'Courses', icon: <BookOutlined /> },
  { to: '/admin/class', label: 'Class', icon: <ScheduleOutlined /> },
];

export default function SidebarAdmin({ collapsed, onToggle, mobileOpen, onMobileToggle, onMobileClose }) {

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-hidden
        />
      )}
      <aside
        className={[
          'flex flex-col bg-white border-r border-r-gray-300 shadow-md z-50',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-24' : 'w-56',
          'h-screen fixed md:sticky top-0 left-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ].join(' ')}
        aria-label="Sidebar navigation"
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-b-slate-300">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center justify-center bg-blue-600 text-white font-bold rounded size-8 shrink-0 text-lg">
              A
            </div>
            {!collapsed && <span className="font-semibold text-sm tracking-wide">Admin Panel</span>}
          </div>
          {/* Desktop collapse button */}
          <button
            onClick={onToggle}
            className="hidden md:inline-flex w-8 h-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          {/* Mobile close button */}
          <button
            onClick={onMobileToggle}
            className="md:hidden inline-flex w-8 h-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label="Close navigation"
          >
            <MenuFoldOutlined />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-1 px-2">
            {ITEMS.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onMobileClose}
                  className={({ isActive }) => [
                    'group flex items-center rounded-md py-2 text-sm font-medium transition-colors',
                    collapsed ? 'justify-center mx-2.5' : 'gap-3 px-3',
                    isActive ? 'bg-blue-200/85 text-blue-600' : 'text-gray-600 hover:bg-blue-100 hover:text-gray-900'
                  ].join(' ')}
                  aria-label={collapsed ? item.label : undefined}
                >
                  {collapsed ? (
                    <Tooltip placement="right" title={item.label} >
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

        {/* Footer / Mini info */}
        {/* <div className="border-t p-3 text-xs text-gray-500 flex items-center justify-between">
          {!collapsed && <span>v1.0.0</span>}
          <span className="font-semibold text-gray-400">©</span>
        </div> */}
      </aside>
    </>
  );
}
