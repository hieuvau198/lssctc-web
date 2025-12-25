// src/app/pages/SimManager/Dashboard/partials/StatsOverview.jsx
import { Spin } from 'antd';
import { Users, PlayCircle, ListTodo, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StatsOverview({
  totalTrainees = 0,
  totalPractices = 0,
  totalTasks = 0,
  totalSimulationSessions = 0,
  loading = false,
}) {
  const { t } = useTranslation();
  const items = [
    {
      title: 'Tổng học viên',
      value: totalTrainees,
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: t('simManager.dashboard.totalPractices') || 'Tổng thực hành',
      value: totalPractices,
      icon: <PlayCircle className="w-5 h-5" />,
    },
    {
      title: 'Tổng nhiệm vụ',
      value: totalTasks,
      icon: <ListTodo className="w-5 h-5" />,
    },
    {
      title: 'Tổng phiên mô phỏng',
      value: totalSimulationSessions,
      icon: <Monitor className="w-5 h-5" />,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item.title}
            className="bg-white border-2 border-neutral-900 hover:border-yellow-400 p-5 transition-colors"
          >
            <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-1">{item.title}</p>
                <p className="text-3xl font-black text-neutral-900">
                  {item.value}
                </p>
              </div>
              <div className="h-10 w-10 inline-flex items-center justify-center bg-yellow-400 text-black">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Spin>
  );
}
