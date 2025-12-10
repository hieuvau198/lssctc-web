// src\app\pages\Trainee\Learn\partials\ReadingContent.jsx

import { useTranslation } from 'react-i18next';
import { Button, Tag, Progress, Alert } from "antd"; // Import Alert
import { CheckCircle2, FileText, Clock, BookOpen, AlertCircle } from "lucide-react"; // Import icon AlertCircle
import dayjs from 'dayjs'; // Import dayjs để format ngày tháng

export default function ReadingContent({
  title,
  completed = false,
  documentUrl,
  onMarkAsComplete,
  sessionStatus // [NEW] Nhận prop sessionStatus
}) {
  const { t } = useTranslation();

  // [NEW] Logic kiểm tra session
  const isSessionOpen = sessionStatus ? sessionStatus.isOpen : true;
  
  const handleMarkComplete = () => {
    if (isSessionOpen && onMarkAsComplete) {
      onMarkAsComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* [NEW] Session Warning Banner */}
      {sessionStatus && !isSessionOpen && (
        <Alert
          message={
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-red-600">
                {sessionStatus.message === "Not started yet" 
                  ? t('trainee.learn.sessionNotStarted') 
                  : t('trainee.learn.sessionExpired')}
              </span>
              <span className="text-xs text-gray-500">
                {sessionStatus.startTime && `Start: ${dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm')}`}
                {sessionStatus.endTime && ` - End: ${dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm')}`}
              </span>
            </div>
          }
          type="warning"
          showIcon
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
          className="border-red-200 bg-red-50"
        />
      )}

      {/* Header (Giữ nguyên, chỉ sửa logic hiển thị Tag nếu cần) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag color="cyan" className="text-xs font-medium">{t('trainee.learn.document')}</Tag>
                  {completed && (
                    <Tag color="success" className="text-xs font-medium">{t('trainee.learn.completed')}</Tag>
                  )}
                </div>
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="p-6">
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm h-[70vh] bg-slate-100">
            <iframe
              src={`${documentUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title={title}
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {completed ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{t('trainee.learn.completed')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">{t('trainee.learn.readingInProgress')}</span>
              </div>
            )}
          </div>

          {!completed && (
            // [NEW] Disable nút nếu session đóng
            <Button 
              type="primary" 
              size="large" 
              onClick={handleMarkComplete} 
              disabled={!isSessionOpen} // Khóa nút
              className="shadow-sm"
            >
              {t('trainee.learn.markComplete')}
            </Button>
          )}
        </div>
      </div>

      {/* Progress Card */}
      {completed && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              {t('trainee.learn.readingProgress')}
            </h3>
          </div>
          <div className="p-6">
            <Progress 
              percent={100} 
              status="success" 
              strokeColor={{ from: '#10b981', to: '#059669' }}
            />
            <p className="text-sm text-slate-600 mt-3">
              {t('trainee.learn.readingCompleted')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
