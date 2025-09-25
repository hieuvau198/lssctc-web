import React, { useState } from 'react';
import { Card, Avatar, Typography, Divider, Button } from 'antd';
import PageNav from '../../../components/PageNav/PageNav';

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
  const phone = storedUser?.phone || storedUser?.mobile || '-';
  const studentId = storedUser?.studentId || storedUser?.code || storedUser?.id || '-';
  const status = storedUser?.status || '-';
  const addressLine = [storedUser?.address, storedUser?.city, storedUser?.country].filter(Boolean).join(', ') || '-';
  const dobRaw = storedUser?.dob || storedUser?.dateOfBirth;
  const createdRaw = storedUser?.createdAt;

  const fmtDate = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    return isNaN(d) ? '-' : d.toLocaleDateString();
  };

  const initial = typeof fullName === 'string' && fullName.trim()
    ? fullName.trim().charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="max-w-[980px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="max-w-[980px] mx-auto px-0">
  <PageNav nameMap={{ profile: 'Profile' }} />
      </div>
      <div className="bg-white border rounded-xl p-6 flex items-start justify-between gap-3">
        <div>
          <Title level={3} className="!mb-1">Profile</Title>
          <Text type="secondary">Your personal information</Text>
        </div>
        <Button type="primary" href="/profile/edit">Update info</Button>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Full Name</div>
                  <div className="text-slate-800 mt-1">{fullName}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Email</div>
                  <div className="text-slate-800 mt-1">{email}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Phone</div>
                  <div className="text-slate-800 mt-1">{phone}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Date of Birth</div>
                  <div className="text-slate-800 mt-1">{fmtDate(dobRaw)}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Student ID</div>
                  <div className="text-slate-800 mt-1">{studentId}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Status</div>
                  <div className="text-slate-800 mt-1">{status}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Address</div>
                  <div className="text-slate-800 mt-1">{addressLine}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Member Since</div>
                  <div className="text-slate-800 mt-1">{fmtDate(createdRaw)}</div>
                </div>
              </div>
            </div>

            <Divider className="!my-4" />
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Roles</div>
              <div className="text-slate-800 mt-1">{roles.length ? roles.join(', ') : 'Learner'}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

