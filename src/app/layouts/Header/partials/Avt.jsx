import { App, Dropdown } from 'antd';
import { NavLink, useNavigate } from 'react-router';
import { logout } from '../../../apis/Auth/LogoutApi';
import useAuthStore from '../../../store/authStore';
import { sAvatarUrl, clearAvatarUrl } from '../../../store/userAvatar';

/**
 * Simple Avatar placeholder for authenticated user.
 * Reads optional display name/email from authStore and persisted avatar.
 */
export default function Avt({ onLogout }) {
  const { message } = App.useApp();
  const nav = useNavigate();
  
  const authState = useAuthStore();
  const persistedAvatar = sAvatarUrl.use();
  
  const userName = authState.fullName || authState.name || 'User';
  const initial = userName.charAt(0).toUpperCase();
  const avatarUrl = authState.avatarUrl || persistedAvatar || null;

  // Generate default avatar URL if no avatar provided
  const getAvatarUrl = () => {
    if (avatarUrl) return avatarUrl;
    const defaultAvatarBase = import.meta.env.VITE_API_DEFAULT_AVATAR_URL;
    return `${defaultAvatarBase}${encodeURIComponent(userName)}`;
  };

  const items = [
    { key: 'profile', label: <NavLink to="/profile" target="_top">Profile</NavLink> },
    { key: 'my-classes', label: <NavLink to="/my-classes" target="_top">My Classes</NavLink> },
    { key: 'my-enrollments', label: <NavLink to="/my-enrollments" target="_top">My Enrollments</NavLink> },
    { key: 'certificate', label: <NavLink to="/certificate" target="_top">Accomplishments</NavLink> },
    { type: 'divider' },
    { key: 'logout', label: <span className="text-red-600">Logout</span> },
  ];

  const handleClick = ({ key }) => {
    if (key === 'logout') {
      // Call centralized logout() which removes auth token and clears authStore
      // IMPORTANT: do NOT clear remembered credentials here — keep them when user chose "Remember me"
      (async () => {
        try {
          await logout();
          clearAvatarUrl(); // Clear persisted avatar on logout
        } catch (e) {
          message.error('Logout failed. Please try again.');
          console.error('Logout failed:', e);
        } finally {
          // Force a full reload to ensure UI (avatar, protected routes) updates
          try {
            window.location.assign('/');
          } catch (e) {
            // fallback to SPA navigation if assign is unavailable
            nav('/');
          }
        }
      })();
    }
  };

  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items, onClick: handleClick }}
      placement="bottomRight"
    >
      <button
        type="button"
        title="Account"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-semibold select-none shadow-sm outline-none focus:ring-2 focus:ring-blue-300 overflow-hidden"
      >
        <img 
          src={getAvatarUrl()} 
          alt={userName}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span className="hidden items-center justify-center w-full h-full">{initial}</span>
      </button>
    </Dropdown>
  );
}
