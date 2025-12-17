import React from 'react';
import { Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HeaderTimer({ name, current, total, answeredCount, timeRemaining }) {
  const { t } = useTranslation();
  const progressPercent = Math.round((answeredCount / total) * 100);
  const isLowTime = timeRemaining < 300;

  return (
    <div className="bg-white border-b-2 border-black sticky top-0 z-10">
      <div className="h-1 bg-yellow-400" />
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Exam Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <FileText className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black uppercase tracking-tight">{name}</h1>
              <p className="text-sm text-neutral-600 font-bold mt-0.5">
                {t('exam.question', 'Question')} {current} / {total}
              </p>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-neutral-50">
              <CheckCircle className="w-4 h-4 text-black" />
              <span className="text-sm font-bold text-black">
                {answeredCount}/{total} {t('exam.answered', 'answered')}
              </span>
            </div>
            <div className="w-32 h-2 border-2 border-black bg-white overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Right: Timer */}
          <div className={`flex items-center gap-3 px-5 py-3 border-2 border-black transition-all duration-300 ${isLowTime
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-400 text-black'
            }`}>
            {isLowTime ? (
              <AlertCircle className="w-6 h-6 animate-pulse" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
            <div>
              <div className="text-xs font-black uppercase tracking-wider opacity-80">
                {t('exam.timeRemaining', 'Time Remaining')}
              </div>
              <div className="text-2xl font-black tabular-nums">
                {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
