import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Home, RefreshCcw, CheckCircle, XCircle, Award, FileText } from 'lucide-react';

export default function ExamResult() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { examData, resultData, score: navScore, isPass: navIsPass } = location.state || {};

    // Determine the final score and pass status to display
    let displayScore = 0;
    let isPassed = false;

    if (resultData) {
        displayScore = resultData.totalMarks || resultData.marks || resultData.score || 0;
        isPassed = resultData.isPass === true || String(resultData.isPass).toLowerCase() === 'true';

        if (displayScore === 0 && !isPassed && resultData.partials && Array.isArray(resultData.partials)) {
            const relevantPartial = resultData.partials.find(p =>
                (p.status === 'Submitted' || p.status === 'Completed') || (p.marks && p.marks > 0)
            );

            if (relevantPartial) {
                const partialPass = relevantPartial.isPass === true || String(relevantPartial.isPass).toLowerCase() === 'true';
                const partialScore = relevantPartial.marks || 0;
                displayScore = partialScore;
                isPassed = partialPass;
            }
        }
    } else {
        displayScore = navScore || 0;
        isPassed = navIsPass === true || String(navIsPass).toLowerCase() === 'true';
    }

    const examName = examData?.quizName || examData?.practiceName || examData?.name || t('exam.finalExam', 'Final Exam');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
                    {/* Header */}
                    <div className={`p-8 text-center text-white ${isPassed
                            ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500'
                            : 'bg-gradient-to-br from-rose-500 via-red-500 to-orange-500'
                        }`}>
                        <div className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg bg-white/20">
                            {isPassed ? (
                                <Trophy className="w-12 h-12 text-white" />
                            ) : (
                                <XCircle className="w-12 h-12 text-white" />
                            )}
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            {isPassed
                                ? t('exam.congratulations', 'Xin chúc mừng!')
                                : t('exam.failed', 'Chưa đạt')}
                        </h1>
                        <p className="text-white/90 text-lg">
                            {isPassed
                                ? t('exam.passedMessage', 'Bạn đã hoàn thành bài thi xuất sắc!')
                                : t('exam.failedMessage', 'Rất tiếc, bạn chưa đạt lần này. Hãy tiếp tục học và thử lại!')}
                        </p>
                    </div>

                    {/* Score Display */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="relative w-40 h-40 mx-auto">
                                {/* Background Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="none"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="url(#scoreGradient)"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(displayScore / 10) * 440} 440`}
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor={isPassed ? "#10b981" : "#ef4444"} />
                                            <stop offset="100%" stopColor={isPassed ? "#06b6d4" : "#f97316"} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                {/* Score Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-4xl font-bold ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {displayScore}
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium">/ 10 {t('exam.points', 'điểm')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Exam Details */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <span className="text-slate-600 font-medium">{t('exam.examName', 'Tên bài thi')}</span>
                                </div>
                                <span className="font-bold text-slate-800">{examName}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Award className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-slate-600 font-medium">{t('exam.yourScore', 'Điểm của bạn')}</span>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {displayScore} / 10
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPassed ? 'bg-emerald-100' : 'bg-red-100'
                                        }`}>
                                        {isPassed ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-600" />
                                        )}
                                    </div>
                                    <span className="text-slate-600 font-medium">{t('exam.status', 'Trạng thái')}</span>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {isPassed ? t('exam.passed', 'ĐẠT') : t('exam.notPassed', 'CHƯA ĐẠT')}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <a
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300 transition-all duration-300"
                            >
                                <Home className="w-5 h-5" />
                                {t('common.home', 'Trang chủ')}
                            </a>
                            {!isPassed && examData?.id && (
                                <button
                                    onClick={() => navigate(`/final-exam/${examData.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
                                >
                                    <RefreshCcw className="w-5 h-5" />
                                    {t('exam.tryAgain', 'Thử lại')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
