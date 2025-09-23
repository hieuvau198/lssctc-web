import React from 'react';

export default function QuizProgress({ answers, currentIndex, onJump }) {
  return (
    <div className="flex flex-wrap gap-2">
      {answers.map((ans, idx) => {
        const isCurrent = idx === currentIndex;
        const state = ans == null ? 'empty' : ans === '__REVIEW__' ? 'review' : 'answered';
        const cls = state === 'answered'
          ? 'bg-green-100 text-green-700 border-green-200'
          : state === 'review'
          ? 'bg-amber-100 text-amber-700 border-amber-200'
          : 'bg-slate-100 text-slate-700 border-slate-200';
        return (
          <button
            key={idx}
            onClick={() => onJump?.(idx)}
            className={`w-9 h-9 rounded-lg border text-sm font-medium ${cls} ${isCurrent ? 'ring-2 ring-blue-300' : ''}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
}
