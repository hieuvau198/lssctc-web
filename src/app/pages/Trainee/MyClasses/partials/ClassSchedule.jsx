// src\app\pages\Trainee\MyClasses\partials\ClassSchedule.jsx

import React from "react";
import { Card } from "antd";
import { Calendar } from "lucide-react";

export default function ClassSchedule({ classData }) {
  const start = new Date(classData.startDate).toLocaleDateString("en-GB");
  const end = new Date(classData.endDate).toLocaleDateString("en-GB");

  return (
    <Card
      title="Class Schedule"
      className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Start Date: {start || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>End Date: {end || "N/A"}</span>
        </div>
      </div>
    </Card>
  );
}
