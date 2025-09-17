import React from 'react';
import CourseTable from './partials/CourseTable';

export default function ManageCourse() {
  return (
    <div className="max-w-[1380px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Courses</h1>
        <p className="text-slate-600">Create, update and manage course catalog.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-4">
        <CourseTable />
      </div>
    </div>
  );
}
