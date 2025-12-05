import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import { getSystemSummary } from '../../../../../apis/Admin/AdminDashboard';

// Simple inline icon components (no external deps)
const icons = {
  programs: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  ),
  courses: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  trainees: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  instructors: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M10 7h4"/></svg>
  ),
  classes: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
  ),
  practices: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"/></svg>
  )
};

const statConfig = [
  { key: 'programs', labelKey: 'admin.dashboard.stats.totalPrograms', dataKey: 'totalPrograms', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', accent: 'text-indigo-600' },
  { key: 'courses', labelKey: 'admin.dashboard.stats.totalCourses', dataKey: 'totalCourses', color: 'bg-blue-50 text-blue-600 border-blue-100', accent: 'text-blue-600' },
  { key: 'trainees', labelKey: 'admin.dashboard.stats.totalTrainees', dataKey: 'totalTrainees', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', accent: 'text-emerald-600' },
  { key: 'instructors', labelKey: 'admin.dashboard.stats.totalInstructors', dataKey: 'totalInstructors', color: 'bg-amber-50 text-amber-600 border-amber-100', accent: 'text-amber-600' },
  { key: 'classes', labelKey: 'admin.dashboard.stats.totalClasses', dataKey: 'totalClasses', color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100', accent: 'text-fuchsia-600' },
  { key: 'practices', labelKey: 'admin.dashboard.stats.totalPractices', dataKey: 'totalPractices', color: 'bg-slate-50 text-slate-600 border-slate-100', accent: 'text-slate-600' },
];

export default function SystemStats() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getSystemSummary();
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch system summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statConfig.map(s => (
        <div key={s.key} className="relative overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm p-4 group">
          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-40 blur-2xl pointer-events-none transition group-hover:scale-110 ${s.color}`} />
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">{t(s.labelKey)}</p>
              <p className="text-2xl font-semibold text-gray-800">{summary?.[s.dataKey] ?? 0}</p>
            </div>
            <div className={`h-9 w-9 inline-flex items-center justify-center rounded-md border text-sm shadow-sm bg-white ${s.color}`}>{icons[s.key]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
