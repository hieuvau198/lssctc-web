// src/app/pages/Trainee/Learn/partials/SessionLockScreen.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Lock, Calendar, AlertCircle } from 'lucide-react';

/**
 * SessionLockScreen - Industrial theme
 * Hiển thị khi phiên học chưa bắt đầu hoặc đã hết hạn
 */
export default function SessionLockScreen({ sessionStatus, activityName }) {
    const { t } = useTranslation();

    if (!sessionStatus || sessionStatus.isOpen) {
        return null;
    }

    const isNotStarted = sessionStatus?.message === "Not started yet";

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full">
                <div className="bg-white border-4 border-neutral-900 overflow-hidden">
                    {/* Header */}
                    <div className={`p-8 text-center ${isNotStarted ? 'bg-yellow-400' : 'bg-neutral-800'}`}>
                        <div className={`w-20 h-20 mx-auto mb-4 flex items-center justify-center border-4 ${isNotStarted ? 'border-black bg-white' : 'border-white bg-neutral-700'}`}>
                            {isNotStarted ? (
                                <Clock className="w-10 h-10 text-black" />
                            ) : (
                                <Lock className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h2 className={`text-2xl font-black uppercase tracking-wide ${isNotStarted ? 'text-black' : 'text-white'}`}>
                            {isNotStarted
                                ? t('trainee.learn.sessionNotStartedTitle', 'Phiên học chưa bắt đầu')
                                : t('trainee.learn.sessionExpiredTitle', 'Phiên học đã kết thúc')}
                        </h2>
                        <p className={`mt-2 ${isNotStarted ? 'text-black/80' : 'text-white/80'}`}>
                            {isNotStarted
                                ? t('trainee.learn.sessionNotStartedDesc', 'Bạn không thể xem nội dung bài học này lúc này')
                                : t('trainee.learn.sessionExpiredDesc', 'Thời gian học đã hết, bạn không thể xem nội dung')}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                        {/* Activity Name */}
                        <div className="bg-neutral-50 border-2 border-neutral-200 p-4">
                            <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">
                                {t('trainee.learn.activityName', 'Bài học')}
                            </div>
                            <div className="font-black text-neutral-900 uppercase">
                                {activityName || 'N/A'}
                            </div>
                        </div>

                        {/* Start Time */}
                        {sessionStatus?.startTime && (
                            <div className="bg-yellow-50 border-2 border-yellow-400 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-black" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                                            {isNotStarted
                                                ? t('trainee.learn.startsAt', 'Bắt đầu lúc')
                                                : t('trainee.learn.wasOpenFrom', 'Đã mở từ')}
                                        </div>
                                        <div className="font-bold text-neutral-900">
                                            {formatDateTime(sessionStatus.startTime)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* End Time */}
                        {sessionStatus?.endTime && (
                            <div className="bg-neutral-100 border-2 border-neutral-300 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-neutral-300 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-neutral-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                                            {isNotStarted
                                                ? t('trainee.learn.endsAt', 'Kết thúc lúc')
                                                : t('trainee.learn.closedAt', 'Đã đóng lúc')}
                                        </div>
                                        <div className="font-bold text-neutral-900">
                                            {formatDateTime(sessionStatus.endTime)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        <div className="text-center pt-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-400">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                <p className="text-sm text-neutral-700 font-semibold">
                                    {isNotStarted
                                        ? t('trainee.learn.pleaseWait', 'Vui lòng quay lại khi phiên học bắt đầu.')
                                        : t('trainee.learn.contactInstructor', 'Vui lòng liên hệ giảng viên nếu cần hỗ trợ.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
