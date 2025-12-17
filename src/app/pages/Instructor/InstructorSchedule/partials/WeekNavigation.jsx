import { DatePicker } from 'antd';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

/**
 * WeekNavigation - Light Wire Theme
 * Industrial design with yellow/black accents
 */
export default function WeekNavigation({
  currentWeekStart,
  onPreviousWeek,
  onNextWeek,
  onToday,
  onWeekChange,
  compact = false,
}) {
  const { t } = useTranslation();

  // Format week range for display
  const getWeekRangeText = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);

    const startStr = `${currentWeekStart.getDate()}/${currentWeekStart.getMonth() + 1}`;
    const endStr = `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;

    return `${startStr} - ${endStr}`;
  };

  const handleDateChange = (date) => {
    if (date && onWeekChange) {
      const selectedDate = date.toDate();
      const dayOfWeek = selectedDate.getDay();
      const monday = new Date(selectedDate);
      monday.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      onWeekChange(monday);
    }
  };

  return (
    <div className="bg-black border-2 border-black p-5 mb-6">
      {/* Yellow accent bar */}
      <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left side - Title and week info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center">
            <Calendar className="w-7 h-7 text-black" />
          </div>
          {!compact && (
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white uppercase tracking-tight">
                {t('instructor.schedule.title')}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-yellow-400 text-black text-sm font-bold uppercase">
                  {t('instructor.schedule.week')}: {getWeekRangeText()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Navigation controls */}
        <div className={`flex items-center gap-2 ${compact ? 'ml-auto' : ''}`}>
          {/* Previous week button */}
          <button
            onClick={onPreviousWeek}
            className="w-10 h-10 flex items-center justify-center bg-neutral-800 border-2 border-neutral-700 hover:bg-yellow-400 hover:border-black hover:text-black text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Today button */}
          <button
            onClick={onToday}
            className="h-10 px-5 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-all"
          >
            {t('instructor.schedule.today')}
          </button>

          {/* Next week button */}
          <button
            onClick={onNextWeek}
            className="w-10 h-10 flex items-center justify-center bg-neutral-800 border-2 border-neutral-700 hover:bg-yellow-400 hover:border-black hover:text-black text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Date picker */}
          <DatePicker
            picker="week"
            value={dayjs(currentWeekStart)}
            onChange={handleDateChange}
            format="wo - YYYY"
            allowClear={false}
            className="h-10 bg-neutral-800 border-2 border-neutral-700 hover:border-yellow-400 transition-all [&_.ant-picker-input>input]:text-white [&_.ant-picker-suffix]:text-yellow-400"
          />
        </div>
      </div>
    </div>
  );
}
