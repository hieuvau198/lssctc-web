import React from 'react';
import { Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

export default function HeaderTimer({ name, current, total, answeredCount, timeRemaining }) {
  const progressPercent = Math.round((answeredCount / total) * 100);
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">{name}</h1>
            <p className="text-sm text-slate-500">Question {current} / {total}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-slate-500 mb-1">Progress</div>
              <Progress
                percent={progressPercent}
                size="small"
                format={() => `${answeredCount}/${total}`}
                className="w-32"
              />
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              <ClockCircleOutlined className="text-2xl" />
              <div>
                <div className="text-xs">Time Remaining</div>
                <div className="text-xl font-bold">{Math.floor(timeRemaining/60).toString().padStart(2,'0')}:{(timeRemaining%60).toString().padStart(2,'0')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
