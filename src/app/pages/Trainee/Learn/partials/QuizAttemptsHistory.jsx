import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { History, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, Trophy } from 'lucide-react';
import dayjs from 'dayjs';

export default function QuizAttemptsHistory({ attempts = [] }) {
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState(null);

    if (!attempts || attempts.length === 0) return null;

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="bg-white border-2 border-black mt-8">
            <div className="px-6 py-4 bg-neutral-100 border-b-2 border-black flex items-center justify-between">
                <h3 className="font-black text-black uppercase flex items-center gap-2 text-lg">
                    <History className="w-6 h-6" />
                    {t('trainee.quiz.history', 'Lịch sử làm bài')} ({attempts.length})
                </h3>
            </div>
            
            <div className="divide-y-2 divide-neutral-200">
                {attempts.map((attempt, index) => (
                    <div key={attempt.id} className="bg-white group">
                        {/* Attempt Header - Click to Expand */}
                        <div 
                            onClick={() => toggleExpand(attempt.id)}
                            className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-yellow-50 transition-colors"
                        >
                            <div className="flex items-start md:items-center gap-4">
                                {/* Rank/Order Badge */}
                                <div className={`w-12 h-12 border-2 border-black flex items-center justify-center flex-shrink-0 bg-white-400`}>
                                    <span className="font-black text-sm">{attempts.length - index}</span>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-black text-lg text-neutral-900">
                                            {dayjs(attempt.quizAttemptDate).format('HH:mm DD-MM-YYYY')}
                                        </span>
                                        {attempt.isCurrent && (
                                            <span className="px-2 py-0.5 bg-yellow-400 border-2 border-black text-xs font-bold uppercase">
                                                {t('common.latest', 'Chính thức')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mt-2">
                                        <span className="flex items-center gap-1.5 font-bold border-2 border-neutral-200 px-2 py-0.5 bg-neutral-50">
                                            <Trophy className="w-4 h-4 text-yellow-600" /> 
                                            Điểm: <span className="text-black">{attempt.attemptScore} / 10</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pl-[4rem] md:pl-0">
                                <div className={`px-4 py-1.5 border-2 border-black font-bold uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 ${attempt.isPass ? 'bg-white-100 text-white-800' : 'bg-white-100 text-white-800'}`}>
                                    {attempt.isPass ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Đạt</>
                                    ) : (
                                        <><XCircle className="w-4 h-4" /> Chưa đạt</>
                                    )}
                                </div>
                                {expandedId === attempt.id ? <ChevronUp className="w-6 h-6 text-black" /> : <ChevronDown className="w-6 h-6 text-black" />}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedId === attempt.id && (
                            <div className="border-t-2 border-neutral-200 bg-neutral-50 p-6 animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-1 bg-black"></div>
                                    <h4 className="text-sm font-black uppercase text-neutral-500 tracking-wider">Chi tiết</h4>
                                </div>
                                
                                <div className="grid gap-3">
                                    {attempt.quizAttemptQuestions?.map((question, qIndex) => (
                                        <div key={question.id} className="bg-white border-2 border-neutral-200 p-4 shadow-sm hover:border-neutral-400 transition-colors">
                                            <div className="flex items-start gap-3">
                                                {question.isCorrect 
                                                    ? <CheckCircle2 className="w-6 h-6 text-white-500 flex-shrink-0 mt-0.5" />
                                                    : <XCircle className="w-6 h-6 text-white-500 flex-shrink-0 mt-0.5" />
                                                }
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h5 className="font-bold text-neutral-900 text-sm">
                                                            <span className="text-neutral-500 mr-2">Q{qIndex + 1}.</span>
                                                            {question.name}
                                                        </h5>
                                                        <span className={`text-xs font-mono font-bold px-2 py-1 border border-neutral-200 ${question.isCorrect ? 'bg-white-50 text-white-700' : 'bg-white-50 text-white-700'}`}>
                                                            {question.attemptScore} / {question.questionScore}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Display Answers if available */}
                                                    {question.quizAttemptAnswers && question.quizAttemptAnswers.length > 0 && (
                                                        <div className="mt-3 pl-2 border-l-2 border-neutral-200 space-y-1">
                                                            {question.quizAttemptAnswers.map((ans) => (
                                                                <div key={ans.id} className="text-xs flex items-center gap-2 text-neutral-600">
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${ans.isCorrect ? 'bg-white-500' : 'bg-white-500'}`} />
                                                                    <span>{ans.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}