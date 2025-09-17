import React from 'react';

export default function QuizHeader({ title, timeLeftSec, totalSec, current, total }) {
  const pct = totalSec > 0 ? Math.max(0, Math.min(100, (1 - timeLeftSec / totalSec) * 100)) : 0;

  function fmt(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="mb-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-slate-600 text-sm">Question {current} of {total}</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium">
          Time left: {fmt(timeLeftSec)}
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
