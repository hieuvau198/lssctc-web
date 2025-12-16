import { useMemo } from 'react';
import { Table, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ClassSlotCard from './ClassSlotCard';
import { weekDays } from '../../../../mocks/instructorSchedule';

/**
 * ScheduleGrid - Component hiển thị lưới lịch học
 * Thiết kế hiện đại với glassmorphism và gradient accents
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
          <div className="flex items-center justify-center gap-2 py-1">
            <span className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {t('instructor.schedule.slot')}
            </span>
          </div>
        ),
        dataIndex: 'slot',
        key: 'slot',
        width: '110px',
        fixed: 'left',
        render: (slot) => (
          <div className="flex flex-col items-center justify-center p-1">
            <span className="font-bold text-gray-800 text-sm">{slot.name}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
          </div>
        ),
      },
    ];

    // Add columns for each day of week
    weekDates.forEach((day) => {
      const isTodayColumn = isToday(day.date);
      cols.push({
        title: (
          <div className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${isTodayColumn
              ? 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/50'
              : ''
            }`}>
            <span className={`text-xs font-semibold ${isTodayColumn
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'
                : 'text-gray-500'
              }`}>
              {isVietnamese ? day.label : day.labelEn}
            </span>
            <span className={`text-lg font-bold mt-0.5 ${isTodayColumn
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'
                : 'text-gray-800'
              }`}>
              {day.dayNum}/{day.monthNum}
            </span>
            {isTodayColumn && (
              <span className="mt-1 px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-medium rounded-full shadow-sm">
                {t('instructor.schedule.today')}
              </span>
            )}
          </div>
        ),
        dataIndex: day.key,
        key: day.key,
        ellipsis: true,
        align: 'center',
        className: isTodayColumn ? 'today-column' : '',
        render: (scheduleItem, record) => {
          if (!scheduleItem) {
            return (
              <div className="slot-empty flex items-center justify-center">
                <span className="w-8 h-0.5 bg-gray-200 rounded-full"></span>
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
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl overflow-hidden">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        scroll={{ x: false }}
        size="small"
        className="schedule-table-modern"
        tableLayout="fixed"
      />
    </div>
  );
}
