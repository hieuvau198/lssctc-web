import React from "react";

export default function CourseHeader() {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Courses
        </h1>
        <p className="mt-1 text-slate-600 text-sm md:text-base">
          Explore our training catalog and start your learning journey.
        </p>
      </div>

      {/* Placeholder for future filters/search */}
      <div className="hidden md:flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50">
          All Levels
        </button>
        <button className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50">
          Duration
        </button>
      </div>
    </div>
  );
}
