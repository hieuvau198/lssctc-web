// src\app\pages\Trainee\MyClasses\partials\ClassSchedule.jsx

import React from "react";
import { Calendar, CalendarDays } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function ClassSchedule({ classData }) {
  const { t } = useTranslation();
  const start = new Date(classData.startDate).toLocaleDateString("vi-VN");
  const end = new Date(classData.endDate).toLocaleDateString("vi-VN");

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-lg overflow-hidden shadow-lg shadow-slate-200/50">
      <div className="h-1 bg-gradient-to-r from-teal-400 to-emerald-500" />
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-teal-500" />
          {t('trainee.classSchedule.title')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/80 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-teal-500" />
            </div>
            <div>
              <div className="text-slate-400 text-xs font-medium">{t('trainee.classSchedule.startDate')}</div>
              <div className="text-slate-700 font-semibold">{start || "N/A"}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/80 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-slate-400 text-xs font-medium">{t('trainee.classSchedule.endDate')}</div>
              <div className="text-slate-700 font-semibold">{end || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

