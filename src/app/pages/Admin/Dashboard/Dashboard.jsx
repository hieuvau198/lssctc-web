import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard } from 'lucide-react';
import Overview from './partials/Overview';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header - Industrial Style */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-black" />
        </div>
        <div>
          <span className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
            {t('admin.dashboard.title')}
          </span>
          <p className="text-sm text-neutral-500 uppercase tracking-wider">
            {t('admin.dashboard.subtitle', 'System Overview')}
          </p>
        </div>
      </div>

      <Overview />
    </div>
  );
}
