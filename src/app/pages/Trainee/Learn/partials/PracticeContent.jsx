// src/app/pages/Trainee/Learn/partials/PracticeContent.jsx

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, CheckCircle2, Clock, Play, ListTodo, ChevronsRight, Monitor, Download, LogIn, MousePointer, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PracticeAttemptsHistory from './PracticeAttemptsHistory';
import { getPracticeAttemptsHistory } from '../../../../apis/Trainee/TraineePracticeApi';
import useAuthStore from '../../../../store/authStore';

export default function PracticeContent({
    practiceId,
    activityRecordId,
    title,
    duration,
    completed = false,
    description,
    tasks = [],
    sessionStatus
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const authData = useAuthStore();
    const nameid = authData?.nameid;

    const [attempts, setAttempts] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (nameid && activityRecordId) {
                try {
                    const data = await getPracticeAttemptsHistory(activityRecordId);
                    setAttempts(data);
                } catch (error) {
                    console.error("Failed to load practice history", error);
                }
            }
        };
        fetchHistory();
    }, [nameid, activityRecordId]);
    
    const isSessionOpen = sessionStatus ? sessionStatus.isOpen : true;

    return (
        <div className="space-y-6">
             {/* Session Warning Banner */}
             {sessionStatus && !isSessionOpen && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-400">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                        <span className="font-bold text-yellow-800 block text-sm uppercase tracking-wide">
                            {sessionStatus.message === "Not started yet"
                                ? t('trainee.learn.sessionNotStarted', 'Session Not Started')
                                : t('trainee.learn.sessionExpired', 'Session Expired')}
                        </span>
                        <span className="text-xs text-yellow-700">
                            {sessionStatus.startTime && `Start: ${dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm')}`}
                            {sessionStatus.endTime && ` - End: ${dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm')}`}
                        </span>
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="bg-white border-2 border-black overflow-hidden">
                <div className="h-0.5 bg-yellow-400" />
                <div className="px-6 py-5 border-b-2 border-neutral-200">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 border-2 border-black flex items-center justify-center bg-yellow-400">
                            <Settings className="w-7 h-7 text-black" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black">
                                    {t('trainee.learn.practice', 'Practice')}
                                </span>
                                {completed && (
                                    <span className="px-3 py-1 bg-black text-yellow-400 font-bold text-xs uppercase tracking-wider border-2 border-black">
                                        {t('trainee.learn.completed', 'Completed')}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl font-black text-black uppercase tracking-tight">{title}</h1>
                            {description && <p className="text-neutral-600 mt-1">{description}</p>}
                            
                            {/* Display Time Range if Session is Open and has limits */}
                            {sessionStatus && isSessionOpen && (sessionStatus.startTime || sessionStatus.endTime) && (
                                <div className="text-xs text-neutral-500 mt-2 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                        {sessionStatus.startTime ? dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm') : '...'} 
                                        {' - '} 
                                        {sessionStatus.endTime ? dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm') : '...'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="border-2 border-black p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase font-bold">{t('trainee.learn.practiceTime', 'Practice Time')}</div>
                                    <div className="text-lg font-black text-black">{duration || t('trainee.learn.flexible', 'Flexible')}</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-2 border-black p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center">
                                    <Monitor className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase font-bold">{t('trainee.learn.type', 'Type')}</div>
                                    <div className="text-lg font-black text-black">{t('trainee.learn.simulator', 'Simulator')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="border-2 border-black mb-6">
                        <div className="px-4 py-3 bg-neutral-50 border-b-2 border-black">
                            <h3 className="font-black text-black uppercase flex items-center gap-2">
                                <ListTodo className="w-5 h-5" />
                                {t('trainee.learn.practiceTasks', 'Practice Tasks')} ({tasks.length})
                            </h3>
                        </div>
                        <div className="p-4">
                            {tasks.length > 0 ? (
                                <ul className="space-y-3">
                                    {tasks.map((task, index) => (
                                        <li key={task.taskId || index} className="flex items-start gap-3 p-3 border-2 border-neutral-200 hover:border-yellow-400 transition-colors">
                                            <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border-2 border-black ${task.isPass ? 'bg-yellow-400' : 'bg-white'}`}>
                                                {task.isPass ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-black">{index + 1}</span>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-black">{task.taskName || 'Unnamed Task'}</div>
                                                {task.taskDescription && <div className="text-sm text-neutral-600">{task.taskDescription}</div>}
                                                {task.taskCode && <div className="text-xs font-mono text-neutral-400 mt-1">{task.taskCode}</div>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-neutral-500 text-sm">{t('trainee.learn.noTasks', 'No tasks listed.')}</p>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="border-2 border-black mb-6">
                        <div className="px-4 py-3 bg-neutral-50 border-b-2 border-black">
                            <h3 className="font-black text-black uppercase flex items-center gap-2">
                                <ChevronsRight className="w-5 h-5" />
                                {t('trainee.learn.howToComplete', 'How to Complete')}
                            </h3>
                        </div>
                        <div className="p-4">
                            <ol className="space-y-3">
                                {[
                                    { icon: <Play className="w-4 h-4" />, text: t('trainee.learn.step1', 'Click "Start Practice"') },
                                    { icon: <Download className="w-4 h-4" />, text: t('trainee.learn.step2', 'Download simulator') },
                                    { icon: <MousePointer className="w-4 h-4" />, text: t('trainee.learn.step3', 'Open .exe file') },
                                    { icon: <LogIn className="w-4 h-4" />, text: t('trainee.learn.step4', 'Log in') },
                                    { icon: <ListTodo className="w-4 h-4" />, text: t('trainee.learn.step5', 'Select practice') },
                                    { icon: <CheckCircle2 className="w-4 h-4" />, text: t('trainee.learn.step6', 'Complete tasks') },
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-8 h-8 border-2 border-black flex items-center justify-center">{step.icon}</div>
                                        <span className="text-neutral-700 pt-1">{step.text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={() => navigate('/simulator')} 
                            disabled={!isSessionOpen}
                            className={`inline-flex items-center gap-2 px-8 py-3 font-bold uppercase border-2 border-black transition-all
                                ${isSessionOpen 
                                    ? 'bg-yellow-400 text-black hover:scale-[1.02]' 
                                    : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'}
                            `}
                        >
                            <Play className="w-5 h-5" />
                            {completed ? t('trainee.learn.practiceAgain', 'Practice Again') : t('trainee.learn.startPractice', 'Start Practice')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Attempts History */}
            <PracticeAttemptsHistory attempts={attempts} />
        </div>
    );
}