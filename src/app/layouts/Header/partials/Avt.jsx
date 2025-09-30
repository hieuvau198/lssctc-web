import React from 'react';
import { Dropdown } from 'antd';
import { NavLink } from 'react-router';

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
    { key: 'profile', label: <NavLink to="/profile">Profile</NavLink> },
    { key: 'my-program', label: <NavLink to="/my-program">My Program</NavLink> },
    { key: 'certificate', label: <NavLink to="/certificate">Accomplishments</NavLink> },
    { type: 'divider' },
    { key: 'logout', label: <span className="text-red-600">Logout</span> },
  ];

  const handleClick = ({ key }) => {
    if (key === 'logout') {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch {}
      if (typeof onLogout === 'function') onLogout();
      // Navigate to login; fallback to hard redirect to ensure clean state
      try { window.location.assign('/login'); } catch { window.location.href = '/login'; }
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
