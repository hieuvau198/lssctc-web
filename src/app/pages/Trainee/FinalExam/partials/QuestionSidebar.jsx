import React from 'react';
import { Card } from 'antd';

export default function QuestionSidebar({ questions, currentIndex, answers, onSelect }) {
  return (
    <Card title={'Question List'} className="shadow-sm sticky top-24" bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const answered = !!answers[q.id];
          const isCurrent = idx === currentIndex;
          const className = `aspect-square rounded-lg font-semibold transition-all ${isCurrent ? 'bg-blue-500 text-white ring-2 ring-blue-300' : answered ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
          return (
            <button key={q.id} onClick={() => onSelect(idx)} className={className}>{idx + 1}</button>
          );
        })}

      </div>

      <div className="mt-4 pt-4 border-t space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
          <span className="text-slate-600">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300"></div>
          <span className="text-slate-600">Not answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 border border-blue-600"></div>
          <span className="text-slate-600">Current</span>
        </div>
      </div>
    </Card>
  );
}
