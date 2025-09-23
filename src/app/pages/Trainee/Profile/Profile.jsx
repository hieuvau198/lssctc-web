import React, { useState } from 'react';
import { Card, Avatar, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

export default function Profile() {
  // Read user from localStorage (fallback to anonymous)
  let storedUser = null;
  try {
    const raw = localStorage.getItem('user');
    storedUser = raw ? JSON.parse(raw) : null;
  } catch {}

  const [imgErr, setImgErr] = useState(false);

  const fullName = storedUser?.fullName || storedUser?.name || 'Learner';
  const email = storedUser?.email || '-';
  const roles = Array.isArray(storedUser?.roles) ? storedUser.roles : (storedUser?.role ? [storedUser.role] : []);
  const avatarUrl = !imgErr ? storedUser?.avatarUrl || storedUser?.avatar || null : null;

  const initial = typeof fullName === 'string' && fullName.trim()
    ? fullName.trim().charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="max-w-[980px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-xl p-6">
        <Title level={3} className="!mb-1">Profile</Title>
        <Text type="secondary">Your personal information</Text>
      </div>

      {/* Profile Card */}
      <Card className="border-slate-200">
        <div className="flex items-start gap-6">
          <Avatar
            size={96}
            src={avatarUrl || undefined}
            onError={() => { setImgErr(true); return false; }}
            className="bg-blue-600 select-none"
          >
            {initial}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="text-xl font-semibold text-slate-800">{fullName}</div>
                <div className="text-slate-600">{email}</div>
              </div>
            </div>

            <Divider className="!my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Roles</div>
                <div className="text-slate-800 mt-1">{roles.length ? roles.join(', ') : 'Learner'}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Member Since</div>
                <div className="text-slate-800 mt-1">{storedUser?.createdAt ? new Date(storedUser.createdAt).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

