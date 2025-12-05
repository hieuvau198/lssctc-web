import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, Empty, Select } from 'antd';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WeeklyScheduleView({ weeklySchedule = [] }) {
  const { t } = useTranslation();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(today.setDate(diff));
  });

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
    return dayData?.slots || [];
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

  return (
    <Card className="shadow-sm">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{t('attendance.weeklySchedule')}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleToday}>{t('attendance.today')}</Button>
          <Button.Group>
            <Button icon={<ChevronLeft className="w-4 h-4" />} onClick={handlePrevWeek} />
            <Button icon={<ChevronRight className="w-4 h-4" />} onClick={handleNextWeek} />
          </Button.Group>
        </div>
      </div>

      <div className="mb-4 text-center">
        <p className="text-sm text-slate-600">
          {weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((date, index) => {
          const slots = getDaySchedule(date);
          const today = isToday(date);

          return (
            <div
              key={index}
              className={`border rounded-lg p-3 min-h-[200px] ${
                today ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200'
              }`}
            >
              <div className="mb-2">
                <div className={`text-xs font-medium ${today ? 'text-blue-600' : 'text-slate-500'}`}>
                  {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${today ? 'text-blue-600' : 'text-slate-900'}`}>
                  {date.getDate()}
                </div>
              </div>

              <div className="space-y-2">
                {slots.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400">{t('attendance.noSlots')}</p>
                  </div>
                ) : (
                  slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-white border border-slate-200 rounded-md p-2 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-xs font-medium text-slate-700 truncate flex-1">
                          {slot.className}
                        </div>
                        <Badge status={getStatusColor(slot.status)} />
                      </div>
                      <div className="text-xs text-slate-500">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-1">
                        📍 {slot.location}
                      </div>
                      {slot.topic && (
                        <div className="text-xs text-slate-600 truncate mt-1 font-medium">
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
      <div className="mt-4 flex items-center gap-4 flex-wrap justify-center text-xs">
        <div className="flex items-center gap-1">
          <Badge status="processing" />
          <span>{t('attendance.status.scheduled')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge status="success" />
          <span>{t('attendance.status.completed')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge status="error" />
          <span>{t('attendance.status.cancelled')}</span>
        </div>
      </div>
    </Card>
  );
}
