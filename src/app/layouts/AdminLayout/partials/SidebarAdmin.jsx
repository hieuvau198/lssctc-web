import { Tooltip, App, Avatar, Dropdown, Menu, Space, Typography, Switch } from 'antd';
import { NavLink, useNavigate } from 'react-router';
import { LayoutDashboard, Users, Layers, BookOpen, Calendar, PanelLeftClose, PanelLeft, LogOut, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logout } from '../../../apis/Auth/LogoutApi';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import { sAvatarUrl, setAvatarUrl, clearAvatarUrl } from '../../../store/userAvatar';

const getItems = (t) => [
  { to: '/admin/dashboard', label: t('sidebar.dashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/admin/users/trainees', label: t('sidebar.users'), icon: <Users className="w-5 h-5" /> },
  { to: '/admin/programs', label: t('sidebar.programs'), icon: <Layers className="w-5 h-5" /> },
  { to: '/admin/courses', label: t('sidebar.courses'), icon: <BookOpen className="w-5 h-5" /> },
  { to: '/admin/class', label: t('sidebar.class'), icon: <Calendar className="w-5 h-5" /> },
];

export default function SidebarAdmin({ collapsed, onToggle, mobileOpen, onMobileToggle, onMobileClose }) {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const ITEMS = getItems(t);

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
          collapsed ? 'w-24' : 'w-60',
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
            {!collapsed && <span className="font-semibold text-sm tracking-wide">{t('sidebar.adminPanel')}</span>}
          </div>
          {/* Desktop collapse button */}
          <button
            onClick={onToggle}
            className="hidden md:inline-flex w-8 h-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label={collapsed ? t('sidebar.expandSidebar') : t('sidebar.collapseSidebar')}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          {/* Mobile close button */}
          <button
            onClick={onMobileToggle}
            className="md:hidden inline-flex w-8 h-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label={t('sidebar.closeNavigation')}
          >
            <PanelLeftClose className="w-4 h-4" />
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
                    isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

        {/* Footer - User info + actions (Profile / Logout) */}
        <div className="mt-auto py-3">
          <div className="pt-2">
            {(() => {
              const store = useAuthStore();
              const token = getAuthToken();
              const claims = decodeToken(token) || {};
              const fullName = store.fullName || store.name || claims.fullName || claims.full_name || claims.name || claims.sub || 'User';
              const role = store.role || claims.role || '';
              const avatarUrl = store.avatarUrl || store.avatar || claims.avatarUrl || claims.picture || claims.avatar || '';

              const avatarContent = avatarUrl ? null : (fullName ? fullName.split(' ').filter(Boolean).map(n => n[0]).slice(0,2).join('') : 'U');

              const menu = (
                  <Menu
                    onClick={async ({ key }) => {
                      if (key === 'logout') {
                        try { await logout(); } catch (e) { message.error(t('common.logoutFailed')); }
                        clearAvatarUrl();
                        try { window.location.assign('/'); } catch { navigate('/'); }
                      } else if (key === 'profile') {
                        navigate('/admin/profile');
                      }
                    }}
                    items={[
                      {
                        key: 'profile',
                        label: t('common.profile')
                      },
                      {
                        key: 'language',
                        label: (
                          <div 
                            className="flex items-center justify-between gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{t('common.language')}</span>
                            <Switch
                              checked={i18n.language === 'vi'}
                              onChange={(checked) => i18n.changeLanguage(checked ? 'vi' : 'en')}
                              checkedChildren="Vi"
                              unCheckedChildren="En"
                              size="small"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )
                      },
                      {
                        key: 'logout',
                        label: t('common.logout'),
                        danger: true
                      }
                    ]}
                  />
              );

              return collapsed ? (
                <div className="w-full flex items-center justify-center">
                  <Dropdown overlay={menu} placement="topCenter" trigger={["click"]}>
                    <div className="cursor-pointer">
                      <Tooltip placement="right" title={<div className="text-sm text-left"><div className="font-semibold">{fullName}</div><div className="text-xs text-gray-400">{role}</div></div>}>
                        <div className="flex items-center justify-center">
                          {(() => {
                            const persisted = sAvatarUrl.use();
                            const resolvedAvatar = avatarUrl || persisted;
                            if (avatarUrl && avatarUrl !== persisted) setAvatarUrl(avatarUrl);
                            return resolvedAvatar ? (
                              <Avatar size={28} src={resolvedAvatar} />
                            ) : (
                              <Avatar size={28} style={{ backgroundColor: '#87d068' }}>{avatarContent}</Avatar>
                            );
                          })()}
                        </div>
                      </Tooltip>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center px-3">
                  <div className="bg-white shadow-2xl ring-1 ring-gray-200 rounded-lg w-full flex items-center justify-between px-2 py-1 transform -translate-y-1 z-10">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {(() => {
                        const persisted = sAvatarUrl.use();
                        const resolvedAvatar = avatarUrl || persisted;
                        if (avatarUrl && avatarUrl !== persisted) setAvatarUrl(avatarUrl);
                        return resolvedAvatar ? (
                          <Avatar size={36} src={resolvedAvatar} />
                        ) : (
                          <Avatar size={36} style={{ backgroundColor: '#87d068' }}>{avatarContent}</Avatar>
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{fullName}</div>
                        <div className="text-xs text-gray-500 truncate">{role}</div>
                      </div>
                    </div>
                    <Dropdown overlay={menu} placement="topRight" trigger={["click"]} arrow={{ pointAtCenter: true }}>
                      <button className="p-1 rounded hover:bg-gray-100" aria-label="user menu">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </Dropdown>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </aside>
    </>
  );
}
