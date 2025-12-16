import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Tooltip, App, Avatar, Dropdown, Menu, Switch } from 'antd';
import { BookOpen, FileText, HelpCircle, Dumbbell, PanelLeftClose, PanelLeft, LayoutDashboard, MoreVertical, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logout } from '../../../apis/Auth/LogoutApi';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import { sAvatarUrl, setAvatarUrl, clearAvatarUrl } from '../../../store/userAvatar';

const getItems = (t) => [
  { to: '/instructor/dashboard', label: t('sidebar.dashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/instructor/schedule', label: t('sidebar.schedule'), icon: <Calendar className="w-5 h-5" /> },
  { to: '/instructor/classes', label: t('sidebar.class'), icon: <BookOpen className="w-5 h-5" /> },
  { to: '/instructor/materials', label: t('sidebar.material'), icon: <FileText className="w-5 h-5" /> },
  { to: '/instructor/quizzes', label: t('sidebar.quiz'), icon: <HelpCircle className="w-5 h-5" /> },
  { to: '/instructor/practices', label: t('sidebar.practice'), icon: <Dumbbell className="w-5 h-5" /> },
];

export default function SidebarInstructor({ collapsed, onToggle, mobileOpen, onMobileToggle, onMobileClose }) {
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          aria-hidden
        />
      )}

      <aside
        className={[
          'flex flex-col bg-white/90 backdrop-blur-md border-r border-slate-200/60 shadow-xl shadow-slate-200/50 z-50',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-64',
          'h-screen fixed md:sticky top-0 left-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        aria-label="Instructor navigation"
      >
        {/* Header / Brand */}
        <div className={`flex items-center h-16 border-b border-slate-200/60 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          {collapsed ? (
            <Tooltip placement="right" title={t('sidebar.instructorPanel')}>
              <div
                onClick={onToggle}
                className="flex items-center cursor-pointer justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-xl size-10 text-lg shadow-lg shadow-blue-200/50 hover:scale-105 transition-transform"
              >
                I
              </div>
            </Tooltip>
          ) : (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-xl size-10 shrink-0 text-lg shadow-lg shadow-blue-200/50">
                  I
                </div>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-wide">
                  {t('sidebar.instructorPanel')}
                </span>
              </div>
              {/* Desktop collapse button */}
              <button
                onClick={onToggle}
                className="hidden md:inline-flex w-9 h-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                aria-label={t('sidebar.collapseSidebar')}
              >
                <PanelLeftClose className="w-4 h-4 text-slate-600" />
              </button>
              {/* Mobile close button */}
              <button
                onClick={onMobileToggle}
                className="md:hidden inline-flex w-9 h-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                aria-label={t('sidebar.closeNavigation')}
              >
                <PanelLeftClose className="w-4 h-4 text-slate-600" />
              </button>
            </>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1.5 px-3">
            {ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onMobileClose}
                  className={({ isActive }) => [
                    'group flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
                    collapsed ? 'justify-center mx-1' : 'gap-3 px-3',
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-transparent',
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

        {/* Footer - User info + actions */}
        <div className="mt-auto py-4 px-3">
          <div className="pt-3 border-t border-slate-200/60">
            {(() => {
              const store = useAuthStore();
              const token = getAuthToken();
              const claims = decodeToken(token) || {};
              const fullName = store.fullName || store.name || claims.fullName || claims.full_name || claims.name || claims.sub || 'User';
              const role = store.role || claims.role || '';
              const avatarUrl = store.avatarUrl || store.avatar || claims.avatarUrl || claims.picture || claims.avatar || '';
              const avatarContent = avatarUrl ? null : (fullName ? fullName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('') : 'U');

              const menu = (
                <Menu
                  onClick={async ({ key }) => {
                    if (key === 'logout') {
                      try { await logout(); } catch (e) { message.error(t('common.logoutFailed')); }
                      clearAvatarUrl();
                      try { window.location.assign('/'); } catch { navigate('/'); }
                    } else if (key === 'profile') {
                      navigate('/instructor/profile');
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
                        <div className="flex items-center justify-center p-2 rounded-xl hover:bg-blue-50 transition-colors">
                          {(() => {
                            const persisted = sAvatarUrl.use();
                            const resolvedAvatar = avatarUrl || persisted;
                            if (avatarUrl && avatarUrl !== persisted) setAvatarUrl(avatarUrl);
                            return resolvedAvatar ? (
                              <Avatar size={32} src={resolvedAvatar} className="ring-2 ring-blue-200" />
                            ) : (
                              <Avatar size={32} className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">{avatarContent}</Avatar>
                            );
                          })()}
                        </div>
                      </Tooltip>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="w-full">
                  <div className="bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 rounded-2xl w-full flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {(() => {
                        const persisted = sAvatarUrl.use();
                        const resolvedAvatar = avatarUrl || persisted;
                        if (avatarUrl && avatarUrl !== persisted) setAvatarUrl(avatarUrl);
                        return resolvedAvatar ? (
                          <Avatar size={40} src={resolvedAvatar} className="ring-2 ring-blue-200" />
                        ) : (
                          <Avatar size={40} className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">{avatarContent}</Avatar>
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 truncate">{fullName}</div>
                        <div className="text-xs text-slate-500 truncate">{role}</div>
                      </div>
                    </div>
                    <Dropdown overlay={menu} placement="topRight" trigger={["click"]} arrow={{ pointAtCenter: true }}>
                      <button className="p-2 rounded-xl hover:bg-blue-50 transition-colors" aria-label="user menu">
                        <MoreVertical className="w-5 h-5 text-slate-500" />
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
