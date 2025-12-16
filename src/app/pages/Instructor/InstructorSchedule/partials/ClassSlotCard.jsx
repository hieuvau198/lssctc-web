import { Tooltip } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getClassStatus } from '../../../../utils/classStatus';

/**
 * ClassSlotCard - Component hiển thị thông tin một slot lớp học
 * Thiết kế hiện đại với glassmorphism và gradient accents
 * @param {Object} scheduleItem - Thông tin lớp học
 * @param {Object} slot - Thông tin slot thời gian
 * @param {Function} onClick - Handler khi click vào card
 */
export default function ClassSlotCard({ scheduleItem, slot, onClick }) {
  const { t } = useTranslation();
  const statusInfo = getClassStatus(scheduleItem.status);

  // Status color mapping for gradient borders
  const statusColors = {
    Draft: { border: 'border-gray-300', bg: 'from-gray-50 to-gray-100', accent: 'bg-gray-400' },
    Open: { border: 'border-blue-300', bg: 'from-blue-50 to-cyan-50', accent: 'bg-blue-500' },
    Inprogress: { border: 'border-amber-300', bg: 'from-amber-50 to-orange-50', accent: 'bg-amber-500' },
    Completed: { border: 'border-emerald-300', bg: 'from-emerald-50 to-green-50', accent: 'bg-emerald-500' },
    Cancelled: { border: 'border-red-300', bg: 'from-red-50 to-rose-50', accent: 'bg-red-500' },
  };

  const colors = statusColors[scheduleItem.status] || statusColors.Draft;

  const tooltipContent = (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
        <BookOutlined className="text-cyan-400" />
        <span className="font-semibold text-white">{scheduleItem.className || scheduleItem.name}</span>
      </div>
      <div className="space-y-1.5 text-gray-200">
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-cyan-300" />
          <span>{t('instructor.schedule.room')}: {scheduleItem.room || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-cyan-300" />
          <span>{t('instructor.schedule.time')}: {slot.startTime} - {slot.endTime}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      color="#1e293b"
      overlayClassName="schedule-tooltip"
    >
      <div
        onClick={onClick}
        className={`
          relative overflow-hidden cursor-pointer h-full
          bg-gradient-to-br ${colors.bg}
          border-l-4 ${colors.border}
          backdrop-blur-sm rounded-xl
          shadow-sm hover:shadow-lg
          transition-all duration-300 ease-out
          hover:scale-[1.02] hover:-translate-y-0.5
          group
        `}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none"></div>

        <div className="relative p-2.5 flex flex-col gap-1">
          {/* Class code with gradient text */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {scheduleItem.classCode}
            </span>
            <span className={`w-2 h-2 rounded-full ${colors.accent} animate-pulse shadow-sm`}></span>
          </div>

          {/* Class name */}
          <span className="text-xs text-gray-700 font-medium truncate leading-tight">
            {scheduleItem.name}
          </span>

          {/* Status badge */}
          <div className={`
            inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-xs font-medium
            ${colors.bg} border border-white/50
          `}
            style={{ color: statusInfo?.color === 'default' ? '#6b7280' : statusInfo?.color }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colors.accent}`}></span>
            {scheduleItem.status}
          </div>

          {/* Room location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
            <EnvironmentOutlined className="text-cyan-500" style={{ fontSize: '11px' }} />
            <span className="truncate">{scheduleItem.room || 'N/A'}</span>
          </div>
        </div>

        {/* Hover accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Tooltip>
  );
}
