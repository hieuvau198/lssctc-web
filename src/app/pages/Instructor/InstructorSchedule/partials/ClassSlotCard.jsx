import { Tooltip } from 'antd';
import { MapPin, Clock, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getClassStatus } from '../../../../utils/classStatus';

/**
 * ClassSlotCard - Light Wire Theme
 * Industrial design with yellow/black accents
 */
export default function ClassSlotCard({ scheduleItem, slot, onClick }) {
  const { t } = useTranslation();
  const statusInfo = getClassStatus(scheduleItem.status);

  // Status color mapping for Light Wire theme
  const statusColors = {
    Draft: { border: 'border-neutral-400', bg: 'bg-neutral-50', accent: 'bg-neutral-400', text: 'text-neutral-600' },
    Open: { border: 'border-yellow-400', bg: 'bg-yellow-50', accent: 'bg-yellow-400', text: 'text-yellow-700' },
    Inprogress: { border: 'border-yellow-500', bg: 'bg-yellow-100', accent: 'bg-yellow-500', text: 'text-yellow-800' },
    Completed: { border: 'border-black', bg: 'bg-neutral-100', accent: 'bg-black', text: 'text-black' },
    Cancelled: { border: 'border-red-500', bg: 'bg-red-50', accent: 'bg-red-500', text: 'text-red-700' },
  };

  const colors = statusColors[scheduleItem.status] || statusColors.Draft;

  const tooltipContent = (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-700">
        <BookOpen className="w-4 h-4 text-yellow-400" />
        <span className="font-bold text-white">{scheduleItem.className || scheduleItem.name}</span>
      </div>
      <div className="space-y-1.5 text-neutral-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-yellow-400" />
          <span>{t('instructor.schedule.room')}: {scheduleItem.room || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-yellow-400" />
          <span>{t('instructor.schedule.time')}: {slot.startTime} - {slot.endTime}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      color="#171717"
      overlayClassName="schedule-tooltip"
    >
      <div
        onClick={onClick}
        className={`
          relative overflow-hidden cursor-pointer
          ${colors.bg}
          border-l-4 ${colors.border}
          border-2 border-neutral-200
          transition-all duration-200
          hover:border-black hover:shadow-md hover:-translate-y-0.5
          group
        `}
      >
        <div className="p-2 flex flex-col gap-1">
          {/* Class code */}
          <div className="flex items-center justify-between">
            <span className="font-black text-xs text-black uppercase">
              {scheduleItem.classCode}
            </span>
            <span className={`w-2 h-2 ${colors.accent}`}></span>
          </div>

          {/* Class name */}
          <span className="text-xs text-neutral-700 font-medium truncate leading-tight">
            {scheduleItem.name}
          </span>

          {/* Status badge */}
          <span className={`
            inline-flex items-center gap-1 w-fit px-2 py-0.5 text-xs font-bold uppercase
            ${colors.bg} border ${colors.border} ${colors.text}
          `}>
            <span className={`w-1.5 h-1.5 ${colors.accent}`}></span>
            {scheduleItem.status}
          </span>

          {/* Room location */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
            <MapPin className="w-3 h-3 text-yellow-600" />
            <span className="truncate">{scheduleItem.room || 'N/A'}</span>
          </div>
        </div>

        {/* Hover accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Tooltip>
  );
}
