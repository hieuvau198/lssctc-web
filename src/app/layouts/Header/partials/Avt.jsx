import React from 'react';
import { Dropdown } from 'antd';
import { NavLink } from 'react-router';
import Cookies from 'js-cookie';
import { clearRememberedCredentials } from '../../../lib/crypto';

/**
 * Simple Avatar placeholder for authenticated user.
 * Reads optional display name/email from localStorage for initial fallback.
 */
export default function Avt({ onLogout }) {
  let initial = 'U';
  try {
    const rawUser = localStorage.getItem('user');
    const parsed = rawUser ? JSON.parse(rawUser) : null;
    const name = parsed?.fullName || parsed?.name || parsed?.email;
    if (typeof name === 'string' && name.trim()) {
      initial = name.trim().charAt(0).toUpperCase();
    }
  } catch {}

  const items = [
    { key: 'profile', label: <NavLink to="/profile" target="_top">Profile</NavLink> },
    { key: 'my-classes', label: <NavLink to="/my-classes" target="_top">My Classes</NavLink> },
    { key: 'certificate', label: <NavLink to="/certificate" target="_top">Accomplishments</NavLink> },
    { type: 'divider' },
    { key: 'logout', label: <span className="text-red-600">Logout</span> },
  ];

  const handleClick = ({ key }) => {
    if (key === 'logout') {
      // Remove auth cookies and any remembered credentials
      try {
        Cookies.remove('token', { path: '/' });
      } catch {}
      try { clearRememberedCredentials(); } catch {}
      // Optionally clear any local user cache
      try { localStorage.removeItem('user'); } catch {}
      if (typeof onLogout === 'function') onLogout();
      // Navigate to login; fallback to hard redirect to ensure clean state
      try { window.location.assign('/auth/login'); } catch { window.location.href = '/auth/login'; }
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
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-semibold select-none shadow-sm outline-none focus:ring-2 focus:ring-blue-300"
      >
        {initial}
      </button>
    </Dropdown>
  );
}
