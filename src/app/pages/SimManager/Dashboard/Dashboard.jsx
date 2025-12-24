// src\app\pages\SimManager\Dashboard\Dashboard.jsx

import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard } from 'lucide-react';
import {
  getMonthlyCompletionDistribution,
  getPracticeDurationDistribution,
  getSimulationManagerSummary,
} from '../../../apis/SimulationManager/SimulationManagerDashbard';
import CompletionDistributionChart from './partials/CompletionDistributionChart';
import DurationDistributionChart from './partials/DurationDistributionChart';
import StatsOverview from './partials/StatsOverview';

export default function SimDashboard() {
  const { t } = useTranslation();

  // State for summary stats
  const [stats, setStats] = useState({
    totalTrainees: 0,
    totalPractices: 0,
    totalTasks: 0,
    totalSimulationSessions: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // State for completion distribution
  const [completionData, setCompletionData] = useState([]);
  const [loadingCompletion, setLoadingCompletion] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State for duration distribution
  const [durationData, setDurationData] = useState([]);
  const [loadingDuration, setLoadingDuration] = useState(true);

  // Fetch summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingStats(true);
        const data = await getSimulationManagerSummary();
        if (data) {
          setStats({
            totalTrainees: data.totalTrainees ?? 0,
            totalPractices: data.totalPractices ?? 0,
            totalTasks: data.totalTasks ?? 0,
            totalSimulationSessions: data.totalSimulationSessions ?? 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch summary:', error);
        message.error(t('common.fetchError'));
      } finally {
        setLoadingStats(false);
      }
    };

    fetchSummary();
  }, [t]);

  // Fetch completion distribution
  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        setLoadingCompletion(true);
        const data = await getMonthlyCompletionDistribution(selectedYear);
        setCompletionData(data || []);
      } catch (error) {
        console.error('Failed to fetch completion distribution:', error);
        message.error(t('common.fetchError'));
      } finally {
        setLoadingCompletion(false);
      }
    };

    fetchCompletion();
  }, [selectedYear, t]);

  // Fetch duration distribution
  useEffect(() => {
    const fetchDuration = async () => {
      try {
        setLoadingDuration(true);
        const data = await getPracticeDurationDistribution();
        setDurationData(data || []);
      } catch (error) {
        console.error('Failed to fetch duration distribution:', error);
        message.error(t('common.fetchError'));
      } finally {
        setLoadingDuration(false);
      }
    };

    fetchDuration();
  }, [t]);

  return (
    <div className="space-y-6">
      {/* Header - Industrial Style */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-black" />
        </div>
        <div>
          <span className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
            {t('simManager.dashboard.title')}
          </span>
          <p className="text-sm text-neutral-500 uppercase tracking-wider">
            {t('simManager.dashboard.subtitle')}
          </p>
        </div>
      </div>

      <StatsOverview
        totalTrainees={stats.totalTrainees}
        totalPractices={stats.totalPractices}
        totalTasks={stats.totalTasks}
        totalSimulationSessions={stats.totalSimulationSessions}
        loading={loadingStats}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompletionDistributionChart
            data={completionData}
            loading={loadingCompletion}
            year={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        <div>
          <DurationDistributionChart
            data={durationData}
            loading={loadingDuration}
          />
        </div>
      </div>
    </div>
  );
}
