import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Home, RefreshCcw, CheckCircle, XCircle, Award, FileText } from 'lucide-react';

export default function ExamResult() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { examData, resultData, score: navScore, isPass: navIsPass } = location.state || {};

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
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="max-w-2xl mx-auto px-6">
                <div className="bg-white border-4 border-neutral-900 overflow-hidden">
                    {/* Header */}
                    <div className={`p-8 text-center text-white ${isPassed ? 'bg-yellow-400' : 'bg-red-500'}`}>
                        <div className={`w-24 h-24 mx-auto mb-4 flex items-center justify-center border-4 ${isPassed ? 'border-black bg-white' : 'border-white bg-red-600'}`}>
                            {isPassed ? (
                                <Trophy className="w-12 h-12 text-black" />
                            ) : (
                                <XCircle className="w-12 h-12 text-white" />
                            )}
                        </div>
                        <h1 className={`text-3xl font-black uppercase tracking-wide ${isPassed ? 'text-black' : 'text-white'}`}>
                            {isPassed
                                ? t('exam.congratulations', 'Xin chúc mừng!')
                                : t('exam.failed', 'Chưa đạt')}
                        </h1>
                        <p className={`text-lg mt-2 ${isPassed ? 'text-black/80' : 'text-white/90'}`}>
                            {isPassed
                                ? t('exam.passedMessage', 'Bạn đã hoàn thành bài thi xuất sắc!')
                                : t('exam.failedMessage', 'Rất tiếc, bạn chưa đạt lần này. Hãy tiếp tục học và thử lại!')}
                        </p>
                    </div>

                    {/* Score Display */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-40 h-40 border-4 border-neutral-900 mb-4 ${isPassed ? 'bg-yellow-50' : 'bg-red-50'}`}>
                                <div>
                                    <span className={`text-5xl font-black ${isPassed ? 'text-neutral-900' : 'text-red-600'}`}>
                                        {displayScore}
                                    </span>
                                    <span className="text-lg text-neutral-500 block font-bold">/ 10 {t('exam.points', 'điểm')}</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="max-w-xs mx-auto">
                                <div className="w-full h-4 border-2 border-neutral-900 bg-white">
                                    <div
                                        className={`h-full transition-all duration-500 ${isPassed ? 'bg-yellow-400' : 'bg-red-500'}`}
                                        style={{ width: `${(displayScore / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Exam Details */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center justify-between p-4 bg-neutral-50 border-2 border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-black" />
                                    </div>
                                    <span className="text-neutral-600 font-bold uppercase text-sm">{t('exam.examName', 'Tên bài thi')}</span>
                                </div>
                                <span className="font-black text-neutral-900">{examName}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-neutral-50 border-2 border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-black" />
                                    </div>
                                    <span className="text-neutral-600 font-bold uppercase text-sm">{t('exam.yourScore', 'Điểm của bạn')}</span>
                                </div>
                                <span className={`px-4 py-1.5 text-sm font-black uppercase ${isPassed ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'}`}>
                                    {displayScore} / 10
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-neutral-50 border-2 border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 flex items-center justify-center ${isPassed ? 'bg-yellow-400' : 'bg-red-500'}`}>
                                        {isPassed ? (
                                            <CheckCircle className="w-5 h-5 text-black" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <span className="text-neutral-600 font-bold uppercase text-sm">{t('exam.status', 'Trạng thái')}</span>
                                </div>
                                <span className={`px-4 py-1.5 text-sm font-black uppercase ${isPassed ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'}`}>
                                    {isPassed ? t('exam.passed', 'ĐẠT') : t('exam.notPassed', 'CHƯA ĐẠT')}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <a
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-black hover:text-yellow-400 transition-all"
                            >
                                <Home className="w-5 h-5" />
                                {t('common.home', 'Trang chủ')}
                            </a>
                            {!isPassed && examData?.id && (
                                <button
                                    onClick={() => navigate(`/final-exam/${examData.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-neutral-900 font-bold uppercase tracking-wider border-2 border-neutral-900 hover:bg-neutral-100 transition-all"
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
