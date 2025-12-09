// src\app\pages\SimManager\Dashboard\Dashboard.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatsOverview from './partials/StatsOverview';
import LiveUsersChart from './partials/LiveUsersChart';
import ActiveSimulationsTable from './partials/ActiveSimulationsTable';
import QuickActions from './partials/QuickActions';
import { Typography } from 'antd';

const { Title } = Typography;

export default function SimDashboard() {
  const { t } = useTranslation();
  const [liveUsers, setLiveUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeRows, setActiveRows] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [stats, setStats] = useState({ activeUsers: 0, activeSimulations: 0, totalSimulations: 0, avgSessionMins: 0 });
  const timerRef = useRef(null);

  // Mock polling for live users; replace with real-time source or API as needed.
  useEffect(() => {
    const maxPoints = 20;
    const tick = () => {
      setLiveUsers(prev => {
        const nextVal = Math.max(0, (prev.at(-1) ?? 12) + Math.round((Math.random() - 0.5) * 6));
        const next = [...prev, nextVal];
        return next.slice(-maxPoints);
      });
      setCategories(prev => {
        const next = [...prev, new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })];
        return next.slice(-maxPoints);
      });
      setStats(s => ({ ...s, activeUsers: liveUsers.at(-1) ?? s.activeUsers }));
    };
    timerRef.current = setInterval(tick, 2000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mock load active simulations table
  useEffect(() => {
    setLoadingActive(true);
    const t = setTimeout(() => {
      const now = new Date();
      setActiveRows([
        { id: 'sim-1', name: 'Seaport Crane Basic', learners: 8, instructor: 'A. Nguyen', startedAt: now.toLocaleTimeString(), status: 'running' },
        { id: 'sim-2', name: 'Container Yard Advanced', learners: 5, instructor: 'B. Tran', startedAt: now.toLocaleTimeString(), status: 'running' },
        { id: 'sim-3', name: 'Tower Crane Safety', learners: 0, instructor: 'C. Le', startedAt: '-', status: 'idle' },
      ]);
      setStats(s => ({ ...s, activeSimulations: 2, totalSimulations: 3, avgSessionMins: 42 }));
      setLoadingActive(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const handleCreate = () => {
    // TODO: navigate to create simulation page
    console.log('navigate to create simulation');
  };
  const handleManageComponents = () => {
    // TODO: navigate to components settings
    console.log('navigate to components');
  };
  const handleSettings = () => {
    // TODO: navigate to settings
    console.log('navigate to settings');
  };

  return (
    <div className="max-w-[1380px] mx-auto px-4 py-6 space-y-6">
      <div className="bg-white border rounded-xl p-6">
        <Title level={3} className="!mb-0">{t('simManager.dashboard.title')}</Title>
        <div className="text-slate-600">{t('simManager.dashboard.subtitle')}</div>
      </div>

      <StatsOverview
        activeUsers={stats.activeUsers}
        activeSimulations={stats.activeSimulations}
        totalSimulations={stats.totalSimulations}
        avgSessionMins={stats.avgSessionMins}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LiveUsersChart data={liveUsers} categories={categories} title={t('simManager.dashboard.liveUsers')} />
        </div>
        <div>
          <QuickActions
            onCreate={handleCreate}
            onManageComponents={handleManageComponents}
            onSettings={handleSettings}
          />
        </div>
      </div>

      <ActiveSimulationsTable rows={activeRows} loading={loadingActive} />
    </div>
  );
}
