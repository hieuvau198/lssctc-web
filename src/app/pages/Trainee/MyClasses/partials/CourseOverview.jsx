// src\app\pages\Trainee\MyClasses\partials\CourseOverview.jsx

import React from 'react';
import { Card } from 'antd';

export default function CourseOverview({ classData }) {
  return (
    <div className="my-4">
      <Card
        title="Class Overview"
        className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          <strong>Course:</strong> {classData.courseName} ({classData.courseCode})
          <br />
          <br />
          {classData.description ||
            "No course description available at the moment."}
        </p>
      </Card>
    </div>
  );
}