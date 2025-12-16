import React, { useEffect, useMemo, useState } from 'react';
import { App, Skeleton } from 'antd';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTraineeClassTimeslots } from '../../../../apis/TimeSlot/TimeSlot';
import { mockTimeSlots, weekDays } from '../../../../mocks/instructorSchedule';

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

  // Get current day info
  const today = new Date();

  // Check if today is in current week
  const isToday = (dayIndex) => {
    const checkDate = new Date(currentWeekStart);
    checkDate.setDate(checkDate.getDate() + dayIndex);
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  // Get date for specific day in current week
  const getDateForDay = (dayIndex) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + dayIndex);
    return date;
  };

  // Format date as DD/MM
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Get week range string
  const getWeekRange = () => {
    const start = new Date(currentWeekStart);
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);
    return `Week: ${formatDate(start)} - ${formatDate(end)}/${end.getFullYear()}`;
  };

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

        const dayIndex = weekDays.findIndex(d => {
          const date = new Date(currentWeekStart);
          const idx = weekDays.indexOf(d);
          date.setDate(currentWeekStart.getDate() + idx);
          return date.toISOString().split('T')[0] === itemDateStr;
        });

        if (dayIndex === -1) return;

        const dayKey = weekDays[dayIndex].key;
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
            instructorName: item.instructorName ?? item.instructor ?? null,
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

  // Get schedule item for specific day and slot
  const getScheduleItem = (dayIndex, slotId) => {
    const dayKey = weekDays[dayIndex]?.key;
    if (!dayKey || !scheduleGrid[slotId]) return null;
    return scheduleGrid[slotId][dayKey];
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-neutral-900 overflow-hidden">
        <div className="h-[2px] bg-yellow-400" />
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-500">{t('common.loading', 'Đang tải...')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-neutral-900" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
            {t('attendance.classSchedule', 'Class Schedule')}
          </h2>
        </div>
        <div className="h-1 w-24 bg-yellow-400"></div>
      </div>

      {/* Week Navigation */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 border-2 border-neutral-900 bg-white hover:border-yellow-400 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 border-2 border-neutral-900 bg-white hover:border-yellow-400 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleToday}
          className="px-4 py-2 bg-yellow-400 border-2 border-neutral-900 text-neutral-900 font-bold text-sm uppercase tracking-wider hover:bg-yellow-500 transition-colors"
        >
          {t('common.today', 'Today')}
        </button>

        <div className="text-sm font-medium text-neutral-900">{getWeekRange()}</div>
      </div>

      {/* Schedule Grid - Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Column Headers */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-bold text-xs uppercase tracking-wider text-neutral-500">Slot</div>
            {weekDays.map((day, index) => {
              const dayDate = getDateForDay(index);
              const isTodayColumn = isToday(index);
              return (
                <div key={day.key} className="text-center">
                  <div
                    className={`font-bold text-xs uppercase tracking-wider ${isTodayColumn ? "text-yellow-600" : "text-neutral-500"
                      }`}
                  >
                    {day.label}
                  </div>
                  <div className={`text-lg font-black ${isTodayColumn ? "text-yellow-600" : "text-neutral-900"}`}>
                    {formatDate(dayDate)}
                  </div>
                  {isTodayColumn && <div className="mt-1 mx-auto w-12 h-1 bg-yellow-400"></div>}
                </div>
              );
            })}
          </div>

          {/* Schedule Grid Rows */}
          {mockTimeSlots.map((slot) => (
            <div key={slot.id} className="grid grid-cols-8 gap-2 mb-2">
              {/* Time Slot Label */}
              <div className="flex flex-col justify-center py-4">
                <div className="font-bold text-sm text-neutral-900">{slot.name}</div>
                <div className="text-xs text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {slot.startTime} - {slot.endTime}
                </div>
              </div>

              {/* Day Cells */}
              {weekDays.map((day, dayIndex) => {
                const scheduleItem = getScheduleItem(dayIndex, slot.id);
                const isTodayColumn = isToday(dayIndex);

                if (scheduleItem) {
                  const item = Array.isArray(scheduleItem) ? scheduleItem[0] : scheduleItem;
                  return (
                    <div
                      key={`${day.key}-${slot.id}`}
                      className="relative border-2 border-neutral-900 bg-white hover:border-yellow-400 hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                    >
                      {/* Yellow top bar */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-400"></div>

                      <div className="p-3">
                        <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                          {item.classCode}
                        </div>
                        <div className="text-xs text-neutral-700 font-medium leading-relaxed mb-2 line-clamp-2">
                          {item.className || item.name}
                        </div>
                        {item.room && (
                          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.room}</span>
                          </div>
                        )}
                        {item.instructorName && (
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <User className="w-3 h-3" />
                            <span>{item.instructorName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${day.key}-${slot.id}`}
                    className={`border border-dashed bg-neutral-50 flex items-center justify-center min-h-[80px] ${isTodayColumn ? "border-yellow-300 bg-yellow-50/30" : "border-neutral-200"
                      }`}
                  >
                    <span className="text-neutral-300 text-xs">—</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Grid - Mobile */}
      <div className="lg:hidden space-y-6">
        {weekDays.map((day, dayIndex) => {
          const dayDate = getDateForDay(dayIndex);
          const isTodayColumn = isToday(dayIndex);

          return (
            <div key={day.key} className="border-2 border-neutral-900 bg-white overflow-hidden">
              {/* Yellow top bar */}
              <div className="h-[2px] bg-yellow-400"></div>

              {/* Day Header */}
              <div className="p-4 bg-neutral-50 border-b-2 border-neutral-900">
                <div
                  className={`font-bold text-sm uppercase tracking-wider ${isTodayColumn ? "text-yellow-600" : "text-neutral-500"
                    }`}
                >
                  {day.label}
                </div>
                <div className={`text-xl font-black ${isTodayColumn ? "text-yellow-600" : "text-neutral-900"}`}>
                  {formatDate(dayDate)}
                </div>
                {isTodayColumn && <div className="mt-2 w-12 h-1 bg-yellow-400"></div>}
              </div>

              {/* Time Slots for this day */}
              <div className="divide-y-2 divide-neutral-100">
                {mockTimeSlots.map((slot) => {
                  const scheduleItem = getScheduleItem(dayIndex, slot.id);

                  return (
                    <div key={slot.id} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="font-bold text-sm text-neutral-900">{slot.name}</div>
                        <div className="text-xs text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>

                      {scheduleItem ? (
                        <div className="border-2 border-neutral-900 p-3 bg-white relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-400"></div>
                          {(() => {
                            const item = Array.isArray(scheduleItem) ? scheduleItem[0] : scheduleItem;
                            return (
                              <>
                                <div className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-1">
                                  {item.classCode}
                                </div>
                                <div className="text-sm text-neutral-700 font-medium leading-relaxed mb-2">
                                  {item.className || item.name}
                                </div>
                                {item.room && (
                                  <div className="flex items-center gap-1 text-xs text-neutral-500 mb-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{item.room}</span>
                                  </div>
                                )}
                                {item.instructorName && (
                                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                                    <User className="w-3 h-3" />
                                    <span>{item.instructorName}</span>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="border border-dashed border-neutral-200 bg-neutral-50 p-3 text-center">
                          <span className="text-neutral-400 text-xs">No class scheduled</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
