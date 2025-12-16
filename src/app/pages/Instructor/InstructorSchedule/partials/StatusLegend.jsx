import { useTranslation } from 'react-i18next';
import { InfoCircleOutlined } from '@ant-design/icons';

/**
 * StatusLegend - Component hiển thị chú thích trạng thái lớp học
 * Thiết kế hiện đại với glassmorphism và gradient accents
 */
export default function StatusLegend() {
  const { t } = useTranslation();

  const statuses = [
    { key: 'Draft', bgColor: 'bg-gray-100', textColor: 'text-gray-600', dotColor: 'bg-gray-400' },
    { key: 'Open', bgColor: 'bg-blue-50', textColor: 'text-blue-600', dotColor: 'bg-blue-500' },
    { key: 'Inprogress', bgColor: 'bg-amber-50', textColor: 'text-amber-600', dotColor: 'bg-amber-500' },
    { key: 'Completed', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', dotColor: 'bg-emerald-500' },
    { key: 'Cancelled', bgColor: 'bg-red-50', textColor: 'text-red-600', dotColor: 'bg-red-500' },
  ];

  return (
    <div className="mt-6 bg-white/70 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
          <InfoCircleOutlined className="text-white text-sm" />
        </div>
        <span className="text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          {t('instructor.schedule.legend')}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {statuses.map((status) => (
          <div
            key={status.key}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor} border border-white/50 shadow-sm transition-all hover:scale-105 hover:shadow-md`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dotColor} animate-pulse`}></span>
            <span className={`text-xs font-medium ${status.textColor}`}>
              {t(`common.classStatus.${status.key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
