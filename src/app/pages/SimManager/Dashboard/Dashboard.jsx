// src\app\pages\SimManager\Dashboard\Dashboard.jsx

import { Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getMonthlyCompletionDistribution,
  getPracticeDurationDistribution,
  getSimulationManagerSummary,
} from '../../../apis/SimulationManager/SimulationManagerDashbard';
import CompletionDistributionChart from './partials/CompletionDistributionChart';
import DurationDistributionChart from './partials/DurationDistributionChart';
import StatsOverview from './partials/StatsOverview';

const { Title } = Typography;

export default function SimDashboard() {
  const { t } = useTranslation();

  // State for summary stats
  const [stats, setStats] = useState({
    totalPractices: 0,
    completedPractices: 0,
    activePractices: 0,
    totalSimulators: 0,
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
            totalPractices: data.totalPractices ?? data.totalPracticeCount ?? 0,
            completedPractices: data.completedPractices ?? data.completedCount ?? 0,
            activePractices: data.activePractices ?? data.activeCount ?? 0,
            totalSimulators: data.totalSimulators ?? data.simulatorCount ?? 0,
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
    <div className="max-w-[1380px] mx-auto px-4 py-4 space-y-4">
      <div className="bg-white/20 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {t('simManager.dashboard.title')}
              </span>
              <p className="text-slate-500 text-sm mt-0.5">{t('simManager.dashboard.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <StatsOverview
        totalPractices={stats.totalPractices}
        completedPractices={stats.completedPractices}
        activePractices={stats.activePractices}
        totalSimulators={stats.totalSimulators}
        loading={loadingStats}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

