// src\app\pages\Trainee\Learn\partials\ReadingContent.jsx

import { useTranslation } from 'react-i18next';
import { Button, Tag, Progress } from "antd";
import { CheckCircle2, FileText, BookOpen, AlertCircle } from "lucide-react";
import dayjs from 'dayjs';

export default function ReadingContent({
  title,
  completed = false,
  documentUrl,
  onMarkAsComplete,
  sessionStatus
}) {
  const { t } = useTranslation();

  const isSessionOpen = sessionStatus ? sessionStatus.isOpen : true;

  const handleMarkComplete = () => {
    if (isSessionOpen && onMarkAsComplete) {
      onMarkAsComplete();
    }
  };

  return (
    <div className="space-y-3">
      {/* Session Warning Banner */}
      {sessionStatus && !isSessionOpen && (
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-amber-700 block text-sm">
              {sessionStatus.message === "Not started yet"
                ? t('trainee.learn.sessionNotStarted')
                : t('trainee.learn.sessionExpired')}
            </span>
            <span className="text-xs text-amber-600">
              {sessionStatus.startTime && `Start: ${dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm')}`}
              {sessionStatus.endTime && ` - End: ${dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm')}`}
            </span>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />

        {/* Compact Header */}
        <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-200">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Tag color="cyan" className="text-xs font-medium m-0">{t('trainee.learn.document')}</Tag>
                {completed && (
                  <Tag color="success" className="text-xs font-medium m-0">{t('trainee.learn.completed')}</Tag>
                )}
              </div>
              <h1 className="text-base font-semibold text-slate-900 leading-tight mt-0.5">{title}</h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {completed ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{t('trainee.learn.completed')}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-xs">{t('trainee.learn.readingInProgress')}</span>
                </div>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleMarkComplete}
                  disabled={!isSessionOpen}
                >
                  {t('trainee.learn.markComplete')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Document Viewer - Larger */}
        <div className="p-4">
          <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm h-[75vh] bg-slate-100">
            <iframe
              src={`${documentUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title={title}
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Progress Card - Only when completed */}
      {completed && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-md overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-800">{t('trainee.learn.readingProgress')}</span>
              <Progress
                percent={100}
                status="success"
                strokeColor={{ from: '#10b981', to: '#059669' }}
                size="small"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
