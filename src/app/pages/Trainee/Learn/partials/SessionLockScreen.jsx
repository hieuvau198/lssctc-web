// src/app/pages/Trainee/Learn/partials/SessionLockScreen.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Lock, Calendar, AlertCircle } from 'lucide-react';

/**
 * SessionLockScreen - Hiển thị khi phiên học chưa bắt đầu hoặc đã hết hạn
 * @param {Object} sessionStatus - Thông tin trạng thái session từ API
 * @param {string} activityName - Tên bài học/activity
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
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
                    {/* Header */}
                    <div className={`p-8 text-center ${isNotStarted
                            ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600'
                            : 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700'
                        }`}>
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            {isNotStarted ? (
                                <Clock className="w-10 h-10 text-white" />
                            ) : (
                                <Lock className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isNotStarted
                                ? t('trainee.learn.sessionNotStartedTitle', 'Phiên học chưa bắt đầu')
                                : t('trainee.learn.sessionExpiredTitle', 'Phiên học đã kết thúc')}
                        </h2>
                        <p className="text-white/80">
                            {isNotStarted
                                ? t('trainee.learn.sessionNotStartedDesc', 'Bạn không thể xem nội dung bài học này lúc này')
                                : t('trainee.learn.sessionExpiredDesc', 'Thời gian học đã hết, bạn không thể xem nội dung')}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                        {/* Activity Name */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="text-sm text-slate-500 mb-1">
                                {t('trainee.learn.activityName', 'Bài học')}
                            </div>
                            <div className="font-semibold text-slate-800">
                                {activityName || 'N/A'}
                            </div>
                        </div>

                        {/* Start Time */}
                        {sessionStatus?.startTime && (
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">
                                            {isNotStarted
                                                ? t('trainee.learn.startsAt', 'Bắt đầu lúc')
                                                : t('trainee.learn.wasOpenFrom', 'Đã mở từ')}
                                        </div>
                                        <div className="font-medium text-slate-800">
                                            {formatDateTime(sessionStatus.startTime)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* End Time */}
                        {sessionStatus?.endTime && (
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">
                                            {isNotStarted
                                                ? t('trainee.learn.endsAt', 'Kết thúc lúc')
                                                : t('trainee.learn.closedAt', 'Đã đóng lúc')}
                                        </div>
                                        <div className="font-medium text-slate-800">
                                            {formatDateTime(sessionStatus.endTime)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        <div className="text-center pt-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                                <AlertCircle className="w-4 h-4 text-slate-500" />
                                <p className="text-sm text-slate-600">
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
