// src\app\pages\Trainee\MyClasses\partials\ClassSchedule.jsx

import React from "react";
import { Card } from "antd";
import { Calendar } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function ClassSchedule({ classData }) {
  const { t } = useTranslation();
  const start = new Date(classData.startDate).toLocaleDateString("en-GB");
  const end = new Date(classData.endDate).toLocaleDateString("en-GB");

  return (
    <Card
      title={t('trainee.classSchedule.title')}
      className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>{t('trainee.classSchedule.startDate')}: {start || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>{t('trainee.classSchedule.endDate')}: {end || "N/A"}</span>
        </div>
      </div>
    </Card>
  );
}
