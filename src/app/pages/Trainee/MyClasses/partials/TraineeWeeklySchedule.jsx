import React, { useState, useMemo } from 'react';
import { Badge, Select } from 'antd';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TraineeWeeklySchedule({ enrolledClasses = [], weeklySchedule = [] }) {
  const { t } = useTranslation();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [selectedClass, setSelectedClass] = useState('all');

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setCurrentWeekStart(new Date(today.setDate(diff)));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaySchedule = (date) => {
    const dateStr = formatDate(date);
    const dayData = weeklySchedule.find(d => d.date === dateStr);
    let slots = dayData?.slots || [];

    // Filter by selected class
    if (selectedClass !== 'all') {
      slots = slots.filter(slot => slot.classId === selectedClass);
    }

    return slots;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'processing';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
      <div className="h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
      <div className="p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-violet-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{t('attendance.myWeeklySchedule')}</h3>
            </div>
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              style={{ width: 200 }}
              className="rounded-xl"
              options={[
                { label: t('common.all'), value: 'all' },
                ...enrolledClasses.map(cls => ({
                  label: cls.className,
                  value: cls.classId,
                })),
              ]}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all duration-300"
            >
              {t('attendance.today')}
            </button>
            <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <button
                onClick={handlePrevWeek}
                className="px-3 py-2 hover:bg-slate-100 border-r border-slate-200 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={handleNextWeek}
                className="px-3 py-2 hover:bg-slate-100 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Week Range */}
        <div className="mb-5 text-center">
          <p className="text-sm font-medium text-slate-500">
            {weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((date, index) => {
            const slots = getDaySchedule(date);
            const today = isToday(date);

            return (
              <div
                key={index}
                className={`border rounded-xl p-3 min-h-[200px] transition-all duration-300 ${today
                    ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-purple-50/30 shadow-md shadow-violet-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
              >
                {/* Day Header */}
                <div className="mb-3 pb-2 border-b border-slate-100">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${today ? 'text-violet-600' : 'text-slate-400'}`}>
                    {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </div>
                  <div className={`text-xl font-bold ${today ? 'text-violet-600' : 'text-slate-800'}`}>
                    {date.getDate()}
                  </div>
                  {today && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-violet-100 text-violet-600 text-xs font-semibold rounded-full">
                      {t('attendance.today')}
                    </span>
                  )}
                </div>

                {/* Slots */}
                <div className="space-y-2">
                  {slots.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-400">{t('attendance.noSlots')}</p>
                    </div>
                  ) : (
                    slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-lg p-2.5 hover:shadow-md hover:border-slate-200 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="text-xs font-semibold text-slate-700 truncate flex-1 pr-2">
                            {slot.className}
                          </div>
                          <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${getStatusBadgeClass(slot.status)}`}>
                            {t(`attendance.status.${slot.status}`)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                          <MapPin className="w-3 h-3" />
                          <span>{slot.location}</span>
                        </div>
                        {slot.topic && (
                          <div className="text-xs text-slate-600 truncate mt-1.5 font-medium border-t border-slate-100 pt-1.5">
                            {slot.topic}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-6 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-400"></span>
            <span className="text-xs text-slate-600">{t('attendance.status.scheduled')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-slate-600">{t('attendance.status.completed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="text-xs text-slate-600">{t('attendance.status.cancelled')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
