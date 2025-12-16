import { Button, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '../InstructorSchedule.css';
import dayjs from 'dayjs';

/**
 * WeekNavigation - Component điều hướng tuần
 * Thiết kế hiện đại với glassmorphism và cyan-blue gradient
 * @param {Date} currentWeekStart - Ngày bắt đầu tuần hiện tại
 * @param {Function} onPreviousWeek - Handler chuyển tuần trước
 * @param {Function} onNextWeek - Handler chuyển tuần sau
 * @param {Function} onToday - Handler về hôm nay
 * @param {Function} onWeekChange - Handler thay đổi tuần (từ DatePicker)
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
      // Calculate Monday of selected week
      const selectedDate = date.toDate();
      const dayOfWeek = selectedDate.getDay();
      const monday = new Date(selectedDate);
      monday.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      onWeekChange(monday);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl shadow-xl p-5 mb-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl"></div>

      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        {/* Left side - Title and week info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 text-white backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
            <CalendarOutlined color="white" className="text-2xl" />
          </div>
          {!compact && (
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">
                {t('instructor.schedule.title')}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 font-medium border border-white/20">
                  {t('instructor.schedule.week')}: {getWeekRangeText()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Navigation controls */}
        <div className={`flex items-center gap-2 ${compact ? 'ml-auto' : ''}`}>
          {/* Previous week button */}
          <Button
            icon={<div className='text-white'><LeftOutlined /></div>}
            onClick={onPreviousWeek}
            type="text"
            className="w-10 h-10 flex items-center justify-center bg-white/15 backdrop-blur-md hover:bg-white/50 border border-white/20 rounded-xl transition-all duration-200 shadow-md"
          />

          {/* Today button */}
          <Button
            onClick={onToday}
            type="default"
            className="h-10 px-5 bg-white text-cyan-600 font-semibold hover:bg-cyan-50 border-none rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {t('instructor.schedule.today')}
          </Button>

          {/* Next week button */}
          <Button
            icon={<div className='text-white'><RightOutlined /></div>}
            onClick={onNextWeek}
            type="text"
            className="w-10 h-10 flex items-center justify-center bg-white/15 backdrop-blur-md hover:bg-white/50 border border-white/20 rounded-xl transition-all duration-200 shadow-md"
          />

          {/* Date picker */}
          <DatePicker
            picker="week"
            value={dayjs(currentWeekStart)}
            onChange={handleDateChange}
            format="wo - YYYY"
            allowClear={false}
            className="week-picker-modern h-10 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/50 transition-all duration-200"
            popupClassName="schedule-datepicker-popup"
          />
        </div>
      </div>
    </div>
  );
}
