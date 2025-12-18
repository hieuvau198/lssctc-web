// src/app/pages/Trainee/Learn/partials/QuizContent.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import QuizAttempt from './QuizAttempt/QuizAttempt';
import QuizAttemptsHistory from './QuizAttemptsHistory'; // Import the new component
import { getQuizAttempts } from '../../../../apis/Trainee/TraineeQuizApi'; // Import API
import { ClipboardList, Clock, Target, HelpCircle, CheckCircle2, XCircle, Trophy, Play, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';

// Child component for quiz start screen - Light Wire Theme
const QuizStartScreen = ({ quiz, onStart, t, sessionStatus, attempts }) => {
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

            {/* Header Card - Light Wire Theme */}
            <div className="bg-white border-2 border-black overflow-hidden">
                <div className="h-0.5 bg-yellow-400" />

                {/* Header */}
                <div className="px-6 py-5 border-b-2 border-neutral-200">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 border-2 border-black flex items-center justify-center bg-yellow-400">
                            <ClipboardList className="w-7 h-7 text-black" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black">
                                    Quiz
                                </span>
                            </div>
                            <h1 className="text-xl font-black text-black uppercase tracking-tight">{quiz.quizName}</h1>
                            {quiz.description && (
                                <p className="text-neutral-600 mt-1">{quiz.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quiz Info Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Time Limit */}
                        <div className="border-2 border-black p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{t('trainee.quizContent.timeLimit', 'Time Limit')}</div>
                                    <div className="text-lg font-black text-black">{quiz.timelimitMinute} {t('trainee.quizContent.mins', 'mins')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="border-2 border-black p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{t('trainee.quizContent.questions', 'Questions')}</div>
                                    <div className="text-lg font-black text-black">{quiz.questions?.length || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Pass Score */}
                        <div className="border-2 border-black p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{t('trainee.quizContent.passScore', 'Pass Score')}</div>
                                    <div className="text-lg font-black text-black">{quiz.passScoreCriteria}/{quiz.totalScore}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <h3 className="font-bold text-black mb-2 uppercase tracking-wide">{t('trainee.quizContent.instructions', 'Instructions')}</h3>
                        <ul className="text-sm text-neutral-700 space-y-1">
                            <li>• {t('trainee.quizContent.instruction1', 'Read each question carefully before answering')}</li>
                            <li>• {t('trainee.quizContent.instruction2', 'You can navigate between questions')}</li>
                            <li>• {t('trainee.quizContent.instruction3', 'The quiz will auto-submit when time runs out')}</li>
                            <li>• {t('trainee.quizContent.instruction4', 'Make sure you have a stable internet connection')}</li>
                        </ul>
                    </div>

                    {/* Start Button */}
                    <div className="text-center">
                        <button
                            onClick={onStart}
                            disabled={!isSessionOpen}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play className="w-5 h-5" />
                            {t('trainee.quizContent.startQuiz', 'Start Quiz')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Attempts History */}
            <QuizAttemptsHistory attempts={attempts} />
        </div>
    );
};

// Child component for quiz result screen - Light Wire Theme
const QuizResultScreen = ({ quiz, onRestart, t, attempts }) => {
    const isPass = (quiz.attemptScore || 0) >= (quiz.passScoreCriteria || 0);
    const scorePercent = (quiz.totalScore > 0) ? Math.round((quiz.attemptScore / quiz.totalScore) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Result Card */}
            <div className="bg-white border-2 border-black overflow-hidden">
                <div className={`h-0.5 ${isPass ? 'bg-yellow-400' : 'bg-red-500'}`} />

                {/* Header */}
                <div className={`px-6 py-5 border-b-2 ${isPass ? 'border-yellow-400 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 border-2 border-black flex items-center justify-center ${isPass ? 'bg-yellow-400' : 'bg-red-500'}`}>
                            {isPass ? <Trophy className="w-7 h-7 text-black" /> : <XCircle className="w-7 h-7 text-white" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-3 py-1 font-bold text-xs uppercase tracking-wider border-2 border-black ${isPass ? 'bg-yellow-400 text-black' : 'bg-red-500 text-white'}`}>
                                    {isPass ? t('trainee.quizContent.passed', 'Passed') : t('trainee.quizContent.notPassed', 'Not Passed')}
                                </span>
                            </div>
                            <h1 className="text-xl font-black text-black uppercase tracking-tight">{t('trainee.quizContent.quizResult', 'Quiz Result')}</h1>
                            <p className="text-neutral-600">{quiz.quizName}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Score Display */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 border-4 border-black mb-4">
                            <div>
                                <div className={`text-4xl font-black ${isPass ? 'text-black' : 'text-red-600'}`}>
                                    {quiz.attemptScore}
                                </div>
                                <div className="text-sm text-neutral-500 font-bold">/ {quiz.totalScore}</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="max-w-xs mx-auto">
                            <div className="w-full h-3 border-2 border-black bg-white">
                                <div
                                    className={`h-full transition-all duration-500 ${isPass ? 'bg-yellow-400' : 'bg-red-500'}`}
                                    style={{ width: `${scorePercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Result Message */}
                    {isPass ? (
                        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="font-bold text-black uppercase">{t('trainee.quizContent.congratulations', 'Congratulations!')}</div>
                                <div className="text-sm text-neutral-700">{t('trainee.quizContent.passedDesc', { score: quiz.attemptScore, total: quiz.totalScore })}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="font-bold text-red-800 uppercase">{t('trainee.quizContent.notPassedMsg', 'Not Passed')}</div>
                                <div className="text-sm text-red-700">{t('trainee.quizContent.notPassedDesc', { score: quiz.attemptScore, total: quiz.totalScore, required: quiz.passScoreCriteria })}</div>
                            </div>
                        </div>
                    )}

                    {/* Completion Info */}
                    <div className="bg-neutral-50 border-2 border-neutral-200 p-4 text-center mb-6">
                        <div className="text-sm text-neutral-500 uppercase font-bold">{t('trainee.quizContent.completedOn', 'Completed On')}</div>
                        <div className="font-bold text-black">
                            {new Date(quiz.lastAttemptDate).toLocaleString()}
                        </div>
                    </div>

                    {/* Retake Button */}
                    <div className="text-center">
                        <button
                            onClick={onRestart}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                        >
                            <Play className="w-5 h-5" />
                            {t('trainee.quizContent.retakeQuiz', 'Retake Quiz')}
                        </button>
                    </div>
                </div>
            </div>

             {/* Attempts History */}
             <QuizAttemptsHistory attempts={attempts} />
        </div>
    );
};

// Main component
export default function QuizContent({ sectionQuiz, partition, onReload, onSubmitAttempt, sessionStatus }) {
    const { t } = useTranslation();
    const [quizState, setQuizState] = useState(
        sectionQuiz.isCompleted ? 'result' : 'start'
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attempts, setAttempts] = useState([]);

    // Fetch attempts history
    const fetchHistory = async () => {
        // Try to get activityRecordId from partition (most reliable for content items) or sectionQuiz
        const activityRecordId = partition?.activityRecordId || sectionQuiz?.activityRecordId;
        
        if (activityRecordId) {
            try {
                const history = await getQuizAttempts(activityRecordId);
                setAttempts(history);
            } catch (error) {
                console.error("Failed to fetch quiz history:", error);
            }
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [partition, sectionQuiz, quizState]); // Refetch when quiz state changes (e.g. after submit)

    const handleStartQuiz = () => {
        setQuizState('attempting');
    };

    const handleSubmit = async (answers) => {
        console.log('[QuizContent] handleSubmit triggered. Forwarding to LearnContent...');
        setIsSubmitting(true);
        try {
            await onSubmitAttempt(answers);
            setQuizState('result');
            console.log('[QuizContent] Submission successful.');
            fetchHistory(); // Refresh history immediately
        } catch (error) {
            console.error('Submission failed in QuizContent:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (quizState === 'attempting') {
        return (
            <QuizAttempt
                quizData={sectionQuiz}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        );
    }

    if (quizState === 'result') {
        return (
            <QuizResultScreen
                quiz={sectionQuiz}
                onRestart={() => setQuizState('start')}
                t={t}
                attempts={attempts}
            />
        );
    }

    return (
        <QuizStartScreen
            quiz={sectionQuiz}
            onStart={handleStartQuiz}
            t={t}
            sessionStatus={sessionStatus}
            attempts={attempts}
        />
    );
}