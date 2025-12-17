import { useMemo } from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import ClassSlotCard from './ClassSlotCard';
import { weekDays } from '../../../../mocks/instructorSchedule';

/**
 * ScheduleGrid - Light Wire Theme
 * Industrial design with yellow/black accents
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
          <div className="flex items-center justify-center py-2">
            <span className="text-sm font-black uppercase tracking-wider text-black">
              {t('instructor.schedule.slot')}
            </span>
          </div>
        ),
        dataIndex: 'slot',
        key: 'slot',
        width: '110px',
        fixed: 'left',
        render: (slot) => (
          <div className="flex flex-col items-center justify-center p-2 bg-neutral-50">
            <span className="font-black text-black text-sm uppercase">{slot.name}</span>
            <span className="text-xs text-neutral-500 font-medium mt-1">
              {slot.startTime} - {slot.endTime}
            </span>
          </div>
        ),
      },
    ];

    // Add columns for each day of week
    weekDates.forEach((day) => {
      const isTodayColumn = isToday(day.date);
      cols.push({
        title: (
          <div className={`flex flex-col items-center py-2 px-1 ${isTodayColumn
            ? 'bg-yellow-400'
            : 'bg-white'
            }`}>
            <span className={`text-xs font-bold uppercase ${isTodayColumn
              ? 'text-black'
              : 'text-neutral-500'
              }`}>
              {isVietnamese ? day.label : day.labelEn}
            </span>
            <span className={`text-lg font-black mt-0.5 ${isTodayColumn
              ? 'text-black'
              : 'text-neutral-800'
              }`}>
              {day.dayNum}/{day.monthNum}
            </span>
            {isTodayColumn && (
              <span className="mt-1 px-2 py-0.5 bg-black text-yellow-400 text-xs font-bold uppercase">
                {t('instructor.schedule.today')}
              </span>
            )}
          </div>
        ),
        dataIndex: day.key,
        key: day.key,
        ellipsis: true,
        align: 'center',
        className: isTodayColumn ? 'bg-yellow-50' : '',
        render: (scheduleItem, record) => {
          if (!scheduleItem) {
            return (
              <div className="flex items-center justify-center py-4">
                <span className="w-8 h-0.5 bg-neutral-200"></span>
              </div>
            );
          }
          return (
            <div className="p-1">
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
    <div className="bg-white border-2 border-black overflow-hidden">
      <div className="h-1 bg-yellow-400" />
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        scroll={{ x: false }}
        size="small"
        tableLayout="fixed"
        className="[&_.ant-table-thead>tr>th]:bg-neutral-100 [&_.ant-table-thead>tr>th]:border-neutral-300 [&_.ant-table-tbody>tr>td]:border-neutral-200 [&_.ant-table-thead>tr>th]:p-0"
      />
    </div>
  );
}
