// src\app\pages\Trainee\Quiz\partials\QuizQuestion.jsx

import React from 'react';

export default function QuizQuestion({ q, value, onChange, index }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
          {index + 1}
        </div>
        <div>
          <h2 className="text-slate-900 font-semibold">{q.text}</h2>
          {q.description && (
            <p className="mt-1 text-slate-600 text-sm">{q.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {q.options?.map((opt, i) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value ?? i}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
            >
              <input
                type="radio"
                name={`q_${index}`}
                checked={selected}
                onChange={() => onChange?.(opt.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-800">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
