import React from 'react';
import { CheckCircle, Circle, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuestionSidebar({ questions = [], currentIndex = 0, answers = {}, onSelect }) {
  const { t } = useTranslation();
  const answeredCount = Object.keys(answers || {}).length;
  const total = Math.max(questions.length, 1);
  const progressPercent = Math.round((answeredCount / total) * 100);

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      {/* Header */}
      <div className="h-1 bg-yellow-400" />
      <div className="p-5">
        {/* Progress Section */}
        <div className="mb-5 pb-4 border-b-2 border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-black text-neutral-500 uppercase tracking-wider">{t('exam.progress', 'Progress')}</div>
              <div className="text-lg font-black text-black">{answeredCount}/{questions.length} <span className="text-sm font-bold text-neutral-500">{t('exam.questions', 'questions')}</span></div>
            </div>
            <div className="text-2xl font-black text-black">
              {progressPercent}%
            </div>
          </div>
          <div className="h-2 border-2 border-black bg-white overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
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
                className={`aspect-square font-black text-sm transition-all duration-200 flex items-center justify-center border-2 border-black ${isCurrent
                  ? 'bg-yellow-400'
                  : answered
                    ? 'bg-neutral-800 hover:scale-105'
                    : 'bg-white text-neutral-500 hover:bg-neutral-50'
                  }`}
                style={{ color: isCurrent ? '#000' : answered ? '#facc15' : undefined }}
                aria-current={isCurrent}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t-2 border-neutral-200 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-neutral-800 border-2 border-black flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <span className="text-sm text-neutral-700 font-bold">{t('exam.answered', 'Answered')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white border-2 border-black flex items-center justify-center">
              <Circle className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <span className="text-sm text-neutral-700 font-bold">{t('exam.notAnswered', 'Not Answered')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm text-neutral-700 font-bold">{t('exam.current', 'Current')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
