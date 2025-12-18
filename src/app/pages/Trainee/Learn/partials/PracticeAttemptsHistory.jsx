import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { History, ChevronDown, ChevronUp, CheckCircle2, XCircle, Calendar, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function PracticeAttemptsHistory({ attempts = [] }) {
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState(null);

    if (!attempts || attempts.length === 0) return null;

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="bg-white border-2 border-black mt-6">
            <div className="px-4 py-3 bg-neutral-100 border-b-2 border-black flex items-center justify-between">
                <h3 className="font-black text-black uppercase flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {t('trainee.practice.history', 'Attempt History')} ({attempts.length})
                </h3>
            </div>
            
            <div className="divide-y-2 divide-neutral-200">
                {attempts.map((attempt, index) => (
                    <div key={attempt.id} className="bg-white">
                        {/* Attempt Header - Click to Expand */}
                        <div 
                            onClick={() => toggleExpand(attempt.id)}
                            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-yellow-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 ${attempt.isPass ? 'bg-green-400' : 'bg-red-400'}`}>
                                    <span className="font-black text-sm">#{attempts.length - index}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">
                                            {dayjs(attempt.attemptDate).format('DD/MM/YYYY HH:mm')}
                                        </span>
                                        {attempt.isCurrent && (
                                            <span className="px-2 py-0.5 bg-yellow-400 border border-black text-xs font-bold uppercase">
                                                {t('common.latest', 'Latest')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> 
                                            Score: <span className="font-bold text-black">{attempt.score ?? 0}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> 
                                            Mistakes: <span className="font-bold text-black">{attempt.totalMistakes ?? 0}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-4">
                                <div className={`px-4 py-1 border-2 border-black font-bold uppercase text-sm ${attempt.isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {attempt.isPass ? 'Passed' : 'Failed'}
                                </div>
                                {expandedId === attempt.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </div>

                        {/* Expanded Task Details */}
                        {expandedId === attempt.id && (
                            <div className="border-t-2 border-neutral-200 bg-neutral-50 p-4">
                                <h4 className="text-xs font-bold uppercase text-neutral-500 mb-3 ml-1">Task Breakdown</h4>
                                <div className="grid gap-2">
                                    {attempt.practiceAttemptTasks?.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-3 bg-white border border-neutral-300 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                {task.isPass 
                                                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    : <XCircle className="w-5 h-5 text-red-600" />
                                                }
                                                <span className={`${task.isPass ? 'text-black' : 'text-neutral-500'}`}>
                                                    {task.taskCode || `Task #${task.taskId}`}
                                                </span>
                                            </div>
                                            <div className="text-sm font-mono">
                                                <span className="text-neutral-500">Mistakes:</span> <b>{task.mistakes ?? 0}</b>
                                                <span className="mx-2 text-neutral-300">|</span>
                                                <span className="text-neutral-500">Score:</span> <b>{task.score}</b>
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