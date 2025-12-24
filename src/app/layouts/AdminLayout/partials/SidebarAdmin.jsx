import { Tooltip, App, Avatar, Dropdown, Menu, Switch } from 'antd';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Users, Layers, BookOpen, Calendar, PanelLeftClose, MoreVertical, FileText, FileQuestion } from 'lucide-react'; // Added FileQuestion
import { useTranslation } from 'react-i18next';
import { logout } from '../../../apis/Auth/LogoutApi';
import useAuthStore from '../../../store/authStore';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import { sAvatarUrl, setAvatarUrl, clearAvatarUrl } from '../../../store/userAvatar';

const getItems = (t) => [
  { to: '/admin/dashboard', label: t('sidebar.dashboard'), icon: <LayoutDashboard className="w-5 h-5" />, matchPath: '/admin/dashboard' },
  { to: '/admin/users/trainees', label: t('sidebar.users'), icon: <Users className="w-5 h-5" />, matchPath: '/admin/users' },
  { to: '/admin/programs', label: t('sidebar.programs'), icon: <Layers className="w-5 h-5" />, matchPath: '/admin/programs' },
  { to: '/admin/courses', label: t('sidebar.courses'), icon: <BookOpen className="w-5 h-5" />, matchPath: '/admin/courses' },
  { to: '/admin/class', label: t('sidebar.class'), icon: <Calendar className="w-5 h-5" />, matchPath: '/admin/class' },
  { to: '/admin/materials', label: t('sidebar.materials'), icon: <FileText className="w-5 h-5" />, matchPath: '/admin/materials' },
  { to: '/admin/quizzes', label: t('sidebar.quizzes', 'Quizzes'), icon: <FileQuestion className="w-5 h-5" />, matchPath: '/admin/quizzes' }, // Added Quizzes Item
];

export default function SidebarAdmin({ collapsed, onToggle, mobileOpen, onMobileToggle, onMobileClose }) {
  // ... rest of the component remains the same
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const ITEMS = getItems(t);

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-neutral-700 z-40 md:hidden"
          aria-hidden
        />
      )}
      <aside
        className={[
          'flex flex-col bg-neutral-700 text-white z-50',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-64',
          'h-screen fixed md:sticky top-0 left-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ].join(' ')}
        aria-label="Sidebar navigation"
      >
        <div className="h-1 bg-yellow-400" />
        <div className={`flex items-center h-16 border-b border-neutral-700 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
          {collapsed ? (
            <Tooltip placement="right" title={t('sidebar.adminPanel')}>
              <div
                onClick={onToggle}
                className="flex items-center cursor-pointer justify-center bg-yellow-400 text-black font-black w-10 h-10 text-lg hover:scale-105 transition-transform"
              >
                A
              </div>
            </Tooltip>
          ) : (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex items-center justify-center bg-yellow-400 text-black font-black w-10 h-10 shrink-0 text-lg">
                  A
                </div>
                <span className="font-black text-white uppercase tracking-wider text-sm">
                  {t('sidebar.adminPanel')}
                </span>
              </div>
              <button
                onClick={onToggle}
                className="hidden md:inline-flex w-9 h-9 items-center justify-center border border-neutral-700 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-200"
                aria-label={t('sidebar.collapseSidebar')}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              <button
                onClick={onMobileToggle}
                className="md:hidden inline-flex w-9 h-9 items-center justify-center border border-neutral-700 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-200"
                aria-label={t('sidebar.closeNavigation')}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {ITEMS.map(item => {
              const isActiveByPath = location.pathname.startsWith(item.matchPath);
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onMobileClose}
                    className={() => [
                      'group flex items-center py-2.5 text-sm font-semibold transition-all duration-200',
                      collapsed ? 'justify-center mx-1' : 'gap-3 px-3',
                      isActiveByPath
                        ? 'bg-yellow-400 text-black'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-yellow-400'
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
                        <span className="truncate uppercase tracking-wider">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - User info + actions */}
        <div className="mt-auto py-4 px-3">
          <div className="pt-3 border-t border-neutral-700">
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
                        <div className="flex items-center justify-center p-2 hover:bg-neutral-800 transition-colors">
                          {(() => {
                            const persisted = sAvatarUrl.use();
                            const resolvedAvatar = avatarUrl || persisted;
                            if (avatarUrl && avatarUrl !== persisted) setAvatarUrl(avatarUrl);
                            return resolvedAvatar ? (
                              <Avatar size={32} src={resolvedAvatar} className="border-2 border-yellow-400" />
                            ) : (
                              <Avatar size={32} className="bg-yellow-400 text-black font-bold">{avatarContent}</Avatar>
                            );
                          })()}
                        </div>
                      </Tooltip>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div className="w-full">
                  <div className="bg-neutral-800 border border-neutral-700 w-full flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {(() => {
                        const persisted = sAvatarUrl.use();
                        const resolvedAvatar = avatarUrl || persisted;
                        if (avatarUrl && avatarUrl !== persisted) setAvatarUrl(avatarUrl);
                        return resolvedAvatar ? (
                          <Avatar size={40} src={resolvedAvatar} className="border-2 border-yellow-400" />
                        ) : (
                          <Avatar size={40} className="bg-yellow-400 text-black font-bold">{avatarContent}</Avatar>
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate text-sm uppercase">{fullName}</div>
                        <div className="text-xs text-neutral-400 truncate uppercase">{role}</div>
                      </div>
                    </div>
                    <Dropdown overlay={menu} placement="topRight" trigger={["click"]} arrow={{ pointAtCenter: true }}>
                      <button className="p-2 hover:bg-yellow-400 hover:text-black transition-colors" aria-label="user menu">
                        <MoreVertical className="w-5 h-5" />
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