import { Button, Space, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  onWeekChange 
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
    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <CalendarOutlined className="text-2xl text-blue-600" />
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-gray-800">
            {t('instructor.schedule.title')}
          </span>
          <span className="text-gray-500 text-sm">
            {t('instructor.schedule.week')}: {getWeekRangeText()}
          </span>
        </div>
      </div>
      
      <Space size="small">
        <Button 
          icon={<LeftOutlined />} 
          onClick={onPreviousWeek}
          type="default"
        />
        <Button onClick={onToday} type="primary">
          {t('instructor.schedule.today')}
        </Button>
        <Button 
          icon={<RightOutlined />} 
          onClick={onNextWeek}
          type="default"
        />
        <DatePicker
          picker="week"
          value={dayjs(currentWeekStart)}
          onChange={handleDateChange}
          format="wo - YYYY"
          allowClear={false}
        />
      </Space>
    </div>
  );
}
