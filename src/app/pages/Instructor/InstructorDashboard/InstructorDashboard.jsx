import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import { LayoutDashboard, Users, BookOpen, FileText, HelpCircle } from 'lucide-react';
import ClassTraineeChart from './partials/charts/ClassTraineeChart';
import ClassStatusChart from './partials/charts/ClassStatusChart';
import YearlyCompletionChart from './partials/charts/YearlyCompletionChart';
import GradeDistributionChart from './partials/charts/GradeDistributionChart';
import { getInstructorSummary } from '../../../apis/Instructor/InstructorDashboard';
import useAuthStore from '../../../store/authStore';

const getStatConfig = (t) => [
  {
    key: 'trainees',
    label: t('instructor.dashboard.totalTrainees'),
    dataKey: 'totalTrainees',
    icon: Users
  },
  {
    key: 'classes',
    label: t('instructor.dashboard.totalClasses'),
    dataKey: 'totalClasses',
    icon: BookOpen
  },
  {
    key: 'materials',
    label: t('instructor.dashboard.totalMaterials'),
    dataKey: 'totalMaterials',
    icon: FileText
  },
  {
    key: 'quizzes',
    label: t('instructor.dashboard.totalQuizzes'),
    dataKey: 'totalQuizzes',
    icon: HelpCircle
  },
];

export default function InstructorDashboard() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { nameid: instructorId } = useAuthStore();
  const statConfig = getStatConfig(t);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!instructorId) return;

      try {
        setLoading(true);
        const data = await getInstructorSummary(instructorId);
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch instructor summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [instructorId]);

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header - Industrial Style */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-black" />
        </div>
        <div>
          <span className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
            {t('instructor.dashboard.title')}
          </span>
          <p className="text-sm text-neutral-500 uppercase tracking-wider">
            {t('instructor.dashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Overview Stats - Industrial Style */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border-2 border-neutral-900 p-5">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statConfig.map((s, index) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="bg-white border-2 border-neutral-900 hover:border-yellow-400 p-5 transition-colors group">
                <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold">{s.label}</p>
                    <p className="text-3xl font-black text-neutral-900">{summary?.[s.dataKey] ?? 0}</p>
                  </div>
                  <div className="h-10 w-10 inline-flex items-center justify-center bg-yellow-400 text-black">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ClassTraineeChart />
        <ClassStatusChart />
        <YearlyCompletionChart />
        <GradeDistributionChart />
      </div>
    </div>
  );
}
