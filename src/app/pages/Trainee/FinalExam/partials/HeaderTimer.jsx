import React from 'react';
import { Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HeaderTimer({ name, current, total, answeredCount, timeRemaining }) {
  const { t } = useTranslation();
  const progressPercent = Math.round((answeredCount / total) * 100);
  const isLowTime = timeRemaining < 300;

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Exam Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-200">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">{name}</h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                {t('exam.question', 'Câu hỏi')} {current} / {total}
              </p>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-600">
                {answeredCount}/{total} {t('exam.answered', 'đã trả lời')}
              </span>
            </div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Right: Timer */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${isLowTime
              ? 'bg-gradient-to-r from-red-50 to-rose-100 text-red-600 ring-2 ring-red-200 shadow-lg shadow-red-100'
              : 'bg-gradient-to-r from-cyan-50 to-blue-100 text-blue-700 shadow-lg shadow-blue-100'
            }`}>
            {isLowTime ? (
              <AlertCircle className="w-6 h-6 animate-pulse" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
                {t('exam.timeRemaining', 'Thời gian còn lại')}
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
