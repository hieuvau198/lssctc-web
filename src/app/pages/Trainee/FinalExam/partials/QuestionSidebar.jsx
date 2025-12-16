import React from 'react';
import { CheckCircle, Circle, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuestionSidebar({ questions = [], currentIndex = 0, answers = {}, onSelect }) {
  const { t } = useTranslation();
  const answeredCount = Object.keys(answers || {}).length;
  const total = Math.max(questions.length, 1);
  const progressPercent = Math.round((answeredCount / total) * 100);

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
      {/* Header */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
      <div className="p-5">
        {/* Progress Section */}
        <div className="mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('exam.progress', 'Tiến độ')}</div>
              <div className="text-lg font-bold text-slate-700">{answeredCount}/{questions.length} <span className="text-sm font-medium text-slate-500">{t('exam.questions', 'câu')}</span></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              {progressPercent}%
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const answered = !!answers[q.id];
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => onSelect(idx)}
                className={`aspect-square rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${isCurrent
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white ring-2 ring-cyan-300 shadow-lg shadow-cyan-200'
                    : answered
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 hover:from-emerald-100 hover:to-teal-200 border border-emerald-200'
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500 hover:from-slate-100 hover:to-slate-200 border border-slate-200'
                  }`}
                aria-current={isCurrent}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-600 font-medium">{t('exam.answered', 'Đã trả lời')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center">
              <Circle className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-sm text-slate-600 font-medium">{t('exam.notAnswered', 'Chưa trả lời')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-slate-600 font-medium">{t('exam.current', 'Đang làm')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
