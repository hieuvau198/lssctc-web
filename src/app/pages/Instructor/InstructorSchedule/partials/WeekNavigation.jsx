import { Button, Space, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '../InstructorSchedule.css';
import dayjs from 'dayjs';

/**
 * WeekNavigation - Component điều hướng tuần
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
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-3xl">📅</span>
          </div>
          {!compact && (
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-white">
                {t('instructor.schedule.title')}
              </span>
              <span className="text-orange-100 text-sm">
                {t('instructor.schedule.week')}: {getWeekRangeText()}
              </span>
            </div>
          )}
        </div>

        <Space size="small" className={compact ? 'ml-auto' : ''}>
          <div className="w-12 h-12 text-white bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Button
              icon={<LeftOutlined className="text-white" />}
              onClick={onPreviousWeek}
              type="text"
              size="small"
              className="text-white hover:bg-white/10 border border-white/20 rounded-md p-1"
            />
          </div>
          <Button
            onClick={onToday}
            type="default"
            size="small"
            className="bg-white text-orange-600 font-semibold hover:opacity-95 border border-white/20 rounded-md px-3 py-1"
          >
            {t('instructor.schedule.today')}
          </Button>
          <Button
            icon={<RightOutlined className="text-white" />}
            onClick={onNextWeek}
            type="text"
            size="small"
            className="text-white hover:bg-white/10 border border-white/20 rounded-md p-1"
          />
          <DatePicker
            picker="week"
            value={dayjs(currentWeekStart)}
            onChange={handleDateChange}
            format="wo - YYYY"
            allowClear={false}
            className="!text-white border border-white/20 rounded-md p-1"
            style={{ color: '#fff', background: 'transparent', borderColor: 'rgba(255,255,255,0.12)' }}
          />
        </Space>
      </div>
    </div>
  );
}
