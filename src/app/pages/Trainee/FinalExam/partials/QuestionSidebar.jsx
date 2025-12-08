import React from 'react';
import { Card, Progress } from 'antd';

export default function QuestionSidebar({ questions = [], currentIndex = 0, answers = {}, onSelect }) {
  const answeredCount = Object.keys(answers || {}).length;
  const total = Math.max(questions.length, 1);

  return (
    <Card
      className="shadow-lg border-blue-100 bg-white/80 backdrop-blur-sm"
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      headStyle={{ background: 'linear-gradient(to right, #dbeafe, #bfdbfe)', borderBottom: '2px solid #93c5fd' }}
    >
      {/* Progress block */}
      <div className="mb-4 px-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tiến độ</div>
            <div className="text-sm text-slate-700 font-medium">{answeredCount}/{questions.length} câu</div>
          </div>
          <div>
            <Progress
              percent={Math.round((answeredCount / total) * 100)}
              size="small"
              strokeColor={{ '0%': '#3b82f6', '100%': '#1d4ed8' }}
              style={{ width: 140 }}
            />
          </div>
        </div>
      </div>

      {/* Question grid */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const answered = !!answers[q.id];
          const isCurrent = idx === currentIndex;
          const className = `aspect-square rounded-lg font-bold text-sm transition-all transform hover:scale-105 ${
            isCurrent
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-300 shadow-lg'
              : answered
              ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border border-green-300'
              : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 border border-slate-300'
          }`;
          return (
            <button key={q.id} onClick={() => onSelect(idx)} className={className} aria-current={isCurrent}>
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-blue-100 space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300" />
          <span className="text-slate-700 font-medium">Đã trả lời</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300" />
          <span className="text-slate-700 font-medium">Chưa trả lời</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-700" />
          <span className="text-slate-700 font-medium">Đang làm</span>
        </div>
      </div>
    </Card>
  );
}
