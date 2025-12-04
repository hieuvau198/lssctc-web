import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { LayoutDashboard, Users, BookOpen, FileText, HelpCircle } from 'lucide-react';
import ClassTraineeChart from './partials/charts/ClassTraineeChart';
import ClassStatusChart from './partials/charts/ClassStatusChart';
import YearlyCompletionChart from './partials/charts/YearlyCompletionChart';
import GradeDistributionChart from './partials/charts/GradeDistributionChart';
import { getInstructorSummary } from '../../../apis/Instructor/InstructorDashboard';
import useAuthStore from '../../../store/authStore';

const statConfig = [
  { 
    key: 'trainees', 
    label: 'Total Trainees', 
    dataKey: 'totalTrainees', 
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: Users
  },
  { 
    key: 'classes', 
    label: 'Total Classes', 
    dataKey: 'totalClasses', 
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: BookOpen
  },
  { 
    key: 'materials', 
    label: 'Total Materials', 
    dataKey: 'totalMaterials', 
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    icon: FileText
  },
  { 
    key: 'quizzes', 
    label: 'Total Quizzes', 
    dataKey: 'totalQuizzes', 
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    icon: HelpCircle
  },
];

export default function InstructorDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { nameid: instructorId } = useAuthStore();

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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your teaching activities</p>
        </div>
      </div>

      {/* Overview Stats */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statConfig.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="relative overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm p-5 group hover:shadow-md transition-shadow">
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-40 blur-2xl pointer-events-none transition group-hover:scale-110 ${s.color}`} />
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{s.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{summary?.[s.dataKey] ?? 0}</p>
                  </div>
                  <div className={`h-11 w-11 inline-flex items-center justify-center rounded-xl border shadow-sm bg-white ${s.color}`}>
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
        {/* Trainees by Class - Bar Chart */}
        <ClassTraineeChart />

        {/* Class Status Distribution - Donut Chart */}
        <ClassStatusChart />

        {/* Yearly Completions - Area Chart */}
        <YearlyCompletionChart />

        {/* Grade Distribution - Pie Chart */}
        <GradeDistributionChart />
      </div>
    </div>
  );
}
