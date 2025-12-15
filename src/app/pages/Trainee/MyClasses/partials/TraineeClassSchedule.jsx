import React, { useEffect, useMemo, useState } from 'react';
import { App, Skeleton } from 'antd';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTraineeClassTimeslots } from '../../../../apis/TimeSlot/TimeSlot';
import { mockTimeSlots, weekDays } from '../../../../mocks/instructorSchedule';
import ScheduleGrid from '../../../Instructor/InstructorSchedule/partials/ScheduleGrid';
import WeekNavigation from '../../../Instructor/InstructorSchedule/partials/WeekNavigation';

export default function TraineeClassSchedule({ classId, className }) {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);

  // Calculate Monday of current week (ISO-style: Monday is the first day)
  const getMondayOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const isoDayIndex = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - isoDayIndex);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMondayOfWeek());

  // Fetch schedule data for this class
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!classId) return;
      setLoading(true);
      try {
        const data = await getTraineeClassTimeslots(classId);
        setScheduleData(data || []);
      } catch (err) {
        message.error(t('attendance.loadError', 'Không thể tải lịch học.'));
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [classId, message, t]);

  // Get dates for the current week
  const weekDates = useMemo(() => {
    return weekDays.map((day, index) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + index);
      return {
        ...day,
        date,
        dateStr: date.toISOString().split('T')[0],
        dayNum: date.getDate(),
        monthNum: date.getMonth() + 1,
      };
    });
  }, [currentWeekStart]);

  // Build schedule grid from API data
  const scheduleGrid = useMemo(() => {
    const grid = {};

    mockTimeSlots.forEach(slot => {
      grid[slot.id] = {};
      weekDays.forEach(day => {
        grid[slot.id][day.key] = null;
      });
    });

    const timeToMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const isoToMinutes = (iso) => {
      const d = new Date(iso);
      return d.getHours() * 60 + d.getMinutes();
    };

    scheduleData.forEach(item => {
      try {
        const itemDate = new Date(item.startTime);
        const itemDateStr = itemDate.toISOString().split('T')[0];

        const day = weekDays.find(d => {
          const date = new Date(currentWeekStart);
          const idx = weekDays.indexOf(d);
          date.setDate(currentWeekStart.getDate() + idx);
          return date.toISOString().split('T')[0] === itemDateStr;
        });

        if (!day) return;

        const dayKey = day.key;
        const itemStartMin = isoToMinutes(item.startTime);
        const itemEndMin = item.endTime ? isoToMinutes(item.endTime) : itemStartMin + 60;

        let matchedSlotId = null;
        for (const slot of mockTimeSlots) {
          const slotStartMin = timeToMinutes(slot.startTime);
          const slotEndMin = timeToMinutes(slot.endTime);
          const overlaps = itemStartMin < slotEndMin && itemEndMin > slotStartMin;
          if (overlaps) {
            matchedSlotId = slot.id;
            break;
          }
        }

        if (!matchedSlotId) {
          let best = null;
          let bestDiff = Infinity;
          for (const slot of mockTimeSlots) {
            const slotStartMin = timeToMinutes(slot.startTime);
            const diff = Math.abs(itemStartMin - slotStartMin);
            if (diff < bestDiff) {
              bestDiff = diff;
              best = slot.id;
            }
          }
          matchedSlotId = best;
        }

        if (matchedSlotId && grid[matchedSlotId]) {
          const mapped = {
            ...item,
            classCode: item.classCode ?? item.name ?? item.className,
            room: item.locationRoom ?? item.room ?? null,
            raw: item,
          };

          if (!grid[matchedSlotId][dayKey]) {
            grid[matchedSlotId][dayKey] = mapped;
          } else {
            const existing = grid[matchedSlotId][dayKey];
            if (Array.isArray(existing)) {
              existing.push(mapped);
            } else {
              grid[matchedSlotId][dayKey] = [existing, mapped];
            }
          }
        }
      } catch (e) {
        // ignore
      }
    });

    return grid;
  }, [scheduleData, currentWeekStart]);

  // Navigation handlers
  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const handleToday = () => {
    setCurrentWeekStart(getMondayOfWeek());
  };

  const handleWeekChange = (newWeekStart) => {
    setCurrentWeekStart(newWeekStart);
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
        <div className="h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">{t('common.loading', 'Đang tải...')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
      <div className="h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-teal-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t('attendance.classSchedule')}</h3>
        </div>

        <WeekNavigation
          currentWeekStart={currentWeekStart}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
          onWeekChange={handleWeekChange}
        />
        <ScheduleGrid
          timeSlots={mockTimeSlots}
          weekDates={weekDates}
          scheduleGrid={scheduleGrid}
        />
      </div>
    </div>
  );
}
