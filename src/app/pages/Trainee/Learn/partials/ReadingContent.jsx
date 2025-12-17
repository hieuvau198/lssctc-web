// src\app\pages\Trainee\Learn\partials\ReadingContent.jsx

import { useTranslation } from 'react-i18next';
import { Button, Tag } from "antd";
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
        <div className="space-y-4">
            {/* Session Warning Banner */}
            {sessionStatus && !isSessionOpen && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-400">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                        <span className="font-bold text-yellow-800 block text-sm uppercase tracking-wide">
                            {sessionStatus.message === "Not started yet"
                                ? t('trainee.learn.sessionNotStarted')
                                : t('trainee.learn.sessionExpired')}
                        </span>
                        <span className="text-xs text-yellow-700">
                            {sessionStatus.startTime && `Start: ${dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm')}`}
                            {sessionStatus.endTime && ` - End: ${dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm')}`}
                        </span>
                    </div>
                </div>
            )}

            {/* Main Card - Light Wire Theme */}
            <div className="bg-white border-2 border-black overflow-hidden">
                {/* Yellow accent bar */}
                <div className="h-0.5 bg-yellow-400" />

                {/* Header */}
                <div className="px-6 py-4 border-b-2 border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-yellow-400">
                            <FileText className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black">
                                    {t('trainee.learn.document', 'Document')}
                                </span>
                                {completed && (
                                    <span className="px-3 py-1 bg-black text-yellow-400 font-bold text-xs uppercase tracking-wider border-2 border-black">
                                        {t('trainee.learn.completed', 'Completed')}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-lg font-black text-black uppercase tracking-tight">{title}</h1>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {completed ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black border-2 border-black">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-bold uppercase">{t('trainee.learn.completed', 'Completed')}</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-neutral-500">
                                    <BookOpen className="w-5 h-5" />
                                    <span className="text-sm font-medium">{t('trainee.learn.readingInProgress', 'Reading in progress')}</span>
                                </div>
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={!isSessionOpen}
                                    className="px-4 py-2 bg-yellow-400 text-black font-bold text-sm uppercase tracking-wider border-2 border-black hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('trainee.learn.markComplete', 'Mark as Complete')}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Document Viewer */}
                <div className="p-6">
                    <div className="overflow-hidden border-2 border-black h-[75vh] bg-neutral-100">
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
                <div className="bg-white border-2 border-black overflow-hidden">
                    <div className="h-0.5 bg-yellow-400" />
                    <div className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-bold text-black uppercase tracking-wide">{t('trainee.learn.readingProgress', 'Reading Progress')}</span>
                            <div className="w-full h-2 border-2 border-black bg-white mt-2">
                                <div className="h-full bg-yellow-400 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
