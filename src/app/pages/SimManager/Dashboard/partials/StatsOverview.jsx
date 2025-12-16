// src/app/pages/SimManager/Dashboard/partials/StatsOverview.jsx
import { Spin } from 'antd';
import { Activity, CheckCircle, PlayCircle, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StatsOverview({
  totalPractices = 0,
  completedPractices = 0,
  activePractices = 0,
  totalSimulators = 0,
  loading = false,
}) {
  const { t } = useTranslation();
  const items = [
    {
      title: t('simManager.dashboard.totalPractices') || 'Tổng thực hành',
      value: totalPractices,
      icon: <PlayCircle className="w-6 h-6" />,
      gradient: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      title: t('simManager.dashboard.completedPractices') || 'Đã hoàn thành',
      value: completedPractices,
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: t('simManager.dashboard.activePractices') || 'Đang thực hành',
      value: activePractices,
      icon: <Activity className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: t('simManager.dashboard.totalSimulators') || 'Tổng thiết bị',
      value: totalSimulators,
      icon: <Monitor className="w-6 h-6" />,
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{item.title}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                  {item.value}
                </p>
              </div>
              <div className={`p-3 ${item.bgColor} rounded-xl ${item.textColor}`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Spin>
  );
}
