import React from 'react';
import { Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

export default function HeaderTimer({ name, current, total, answeredCount, timeRemaining }) {
  const progressPercent = Math.round((answeredCount / total) * 100);
  return (
    <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{name}</h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">Câu hỏi {current} / {total}</p>
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm transition-all ${timeRemaining < 300 ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-600 ring-2 ring-red-200' : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700'}`}>
            <ClockCircleOutlined className="text-2xl" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide">Thời gian còn lại</div>
              <div className="text-xl font-bold tabular-nums">{Math.floor(timeRemaining/60).toString().padStart(2,'0')}:{(timeRemaining%60).toString().padStart(2,'0')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
