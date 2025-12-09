import { useMemo } from 'react';
import { Card, Table, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ClassSlotCard from './ClassSlotCard';
import { weekDays } from '../../../../mocks/instructorSchedule';

/**
 * ScheduleGrid - Component hiển thị lưới lịch học
 * @param {Array} timeSlots - Danh sách các slot thời gian
 * @param {Array} weekDates - Danh sách các ngày trong tuần
 * @param {Object} scheduleGrid - Dữ liệu lịch học theo grid
 * @param {Function} onClassClick - Handler khi click vào lớp học
 */
export default function ScheduleGrid({ timeSlots, weekDates, scheduleGrid, onClassClick }) {
  const { t, i18n } = useTranslation();
  const isVietnamese = i18n.language?.startsWith('vi');

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Build columns for Table
  const columns = useMemo(() => {
    const cols = [
      {
        title: (
          <div className="flex items-center gap-1">
            <ClockCircleOutlined className="text-gray-500" />
            <span className="text-xs font-medium">{t('instructor.schedule.slot')}</span>
          </div>
        ),
        dataIndex: 'slot',
        key: 'slot',
        width: '100px',
        fixed: 'left',
        render: (slot) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 text-xs">{slot.name}</span>
            <span className="text-xs text-gray-500">
              {slot.startTime} - {slot.endTime}
            </span>
          </div>
        ),
      },
    ];

    // Add columns for each day of week
    weekDates.forEach((day) => {
      cols.push({
        title: (
          <div className="flex flex-col items-center">
            <span className={`text-xs font-medium ${
              isToday(day.date) ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {isVietnamese ? day.label : day.labelEn}
            </span>
            <span className={`text-sm font-bold ${
              isToday(day.date) ? 'text-blue-600' : 'text-gray-800'
            }`}>
              {day.dayNum}/{day.monthNum}
            </span>
            {isToday(day.date) && (
              <Tag color="blue" className="text-xs">
                {t('instructor.schedule.today')}
              </Tag>
            )}
          </div>
        ),
        dataIndex: day.key,
        key: day.key,
        ellipsis: true,
        align: 'center',
        className: isToday(day.date) ? 'bg-blue-50' : '',
        render: (scheduleItem, record) => {
          if (!scheduleItem) {
            return (
              <div className="slot-empty flex items-center justify-center">
                <span className="text-gray-300">-</span>
              </div>
            );
          }
          return (
            <div className="slot-occupied">
              <ClassSlotCard
                scheduleItem={scheduleItem}
                slot={record.slot}
                onClick={() => onClassClick(scheduleItem.classId)}
              />
            </div>
          );
        },
      });
    });

    return cols;
  }, [weekDates, isVietnamese, t, onClassClick]);

  // Build data source for Table
  const dataSource = useMemo(() => {
    return timeSlots.map((slot) => {
      const row = {
        key: slot.id,
        slot,
      };
      
      weekDays.forEach((day) => {
        row[day.key] = scheduleGrid[slot.id]?.[day.key] || null;
      });
      
      return row;
    });
  }, [timeSlots, scheduleGrid]);

  return (

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        scroll={{ x: false }}
        size="small"
        className="schedule-table"
        tableLayout="fixed"
      />
  );
}
