// src/app/pages/Trainee/Learn/partials/PracticeContent.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, CheckCircle2, Clock, Play, ListTodo, ChevronsRight, Monitor, Download, LogIn, MousePointer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PracticeContent({
    title,
    duration,
    completed = false,
    description,
    tasks = []
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const completedTasks = tasks.filter(t => t.isPass).length;
    const avgScore = tasks.length > 0
        ? Math.round(tasks.reduce((acc, t) => acc + (t.score || 0), 0) / tasks.length)
        : 0;

    return (
        <div className="space-y-6">
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
                                            <div className={`w-8 h-8 flex items-center justify-center border-2 border-black ${task.isPass ? 'bg-yellow-400' : 'bg-white'}`}>
                                                {task.isPass ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-black">{index + 1}</span>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-black">{task.taskName || 'Unnamed Task'}</div>
                                                {task.taskDescription && <div className="text-sm text-neutral-600">{task.taskDescription}</div>}
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
                        <button onClick={() => navigate('/simulator')} className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:scale-[1.02] transition-all">
                            <Play className="w-5 h-5" />
                            {completed ? t('trainee.learn.practiceAgain', 'Practice Again') : t('trainee.learn.startPractice', 'Start Practice')}
                        </button>
                    </div>
                </div>
            </div>

            {completed && (
                <div className="bg-white border-2 border-black overflow-hidden">
                    <div className="h-0.5 bg-yellow-400" />
                    <div className="px-6 py-4 border-b-2 border-neutral-200 bg-yellow-50">
                        <h3 className="font-black text-black uppercase flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            {t('trainee.learn.practiceSummary', 'Practice Summary')}
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="w-full h-3 border-2 border-black bg-white mb-6"><div className="h-full bg-yellow-400 w-full" /></div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="border-2 border-black p-4 text-center">
                                <div className="text-xs text-neutral-500 uppercase font-bold">{t('trainee.learn.tasksCompleted', 'Tasks Completed')}</div>
                                <div className="text-2xl font-black">{completedTasks} / {tasks.length}</div>
                            </div>
                            <div className="border-2 border-black bg-yellow-50 p-4 text-center">
                                <div className="text-xs text-neutral-500 uppercase font-bold">{t('trainee.learn.averageScore', 'Average Score')}</div>
                                <div className="text-2xl font-black">{avgScore}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
