// src/app/pages/Trainee/Learn/partials/QuizContent.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QuizAttempt from './QuizAttempt/QuizAttempt';
import { Button, Alert, Tag, Progress } from 'antd';
import { ClipboardList, Clock, Target, HelpCircle, CheckCircle2, XCircle, Trophy, Play } from 'lucide-react';

// Child component for quiz start screen
const QuizStartScreen = ({ quiz, onStart, t }) => (
  <div className="space-y-6">
    {/* Header Card */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag color="purple" className="text-xs font-medium">Quiz</Tag>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{quiz.quizName}</h1>
            {quiz.description && (
              <p className="text-slate-600 mt-1">{quiz.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Info Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">{t('trainee.quizContent.timeLimit')}</div>
                <div className="text-lg font-bold text-slate-900">{quiz.timelimitMinute} {t('trainee.quizContent.mins')}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">{t('trainee.quizContent.questions')}</div>
                <div className="text-lg font-bold text-slate-900">{quiz.questions?.length || 0}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">{t('trainee.quizContent.passScore')}</div>
                <div className="text-lg font-bold text-slate-900">{quiz.passScoreCriteria}/{quiz.totalScore}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-2">{t('trainee.quizContent.instructions')}</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• {t('trainee.quizContent.instruction1')}</li>
            <li>• {t('trainee.quizContent.instruction2')}</li>
            <li>• {t('trainee.quizContent.instruction3')}</li>
            <li>• {t('trainee.quizContent.instruction4')}</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            type="primary" 
            size="large" 
            onClick={onStart}
            icon={<Play className="w-4 h-4" />}
            className="px-8 shadow-lg shadow-purple-200"
          >
            {t('trainee.quizContent.startQuiz')}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Child component for quiz result screen
const QuizResultScreen = ({ quiz, onRestart, t }) => {
  const isPass = (quiz.attemptScore || 0) >= (quiz.passScoreCriteria || 0);
  const scorePercent = (quiz.totalScore > 0) ? Math.round((quiz.attemptScore / quiz.totalScore) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Result Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className={`px-6 py-5 border-b ${isPass ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-100'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isPass ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-200' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200'}`}>
              {isPass ? <Trophy className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag color={isPass ? 'success' : 'error'} className="text-xs font-medium">
                  {isPass ? t('trainee.quizContent.passed') : t('trainee.quizContent.notPassed')}
                </Tag>
              </div>
              <h1 className="text-xl font-bold text-slate-900">{t('trainee.quizContent.quizResult')}</h1>
              <p className="text-slate-600">{quiz.quizName}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border-4 border-slate-200 mb-4">
              <div>
                <div className={`text-3xl font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                  {quiz.attemptScore}
                </div>
                <div className="text-sm text-slate-500">/ {quiz.totalScore}</div>
              </div>
            </div>
            <Progress 
              percent={scorePercent} 
              status={isPass ? 'success' : 'exception'}
              strokeColor={isPass ? { from: '#10b981', to: '#059669' } : { from: '#ef4444', to: '#dc2626' }}
              className="max-w-xs mx-auto"
            />
          </div>

          {/* Result Message */}
          {isPass ? (
            <Alert
              message={t('trainee.quizContent.congratulations')}
              description={t('trainee.quizContent.passedDesc', { score: quiz.attemptScore, total: quiz.totalScore })}
              type="success"
              showIcon
              icon={<CheckCircle2 className="w-5 h-5" />}
              className="mb-6"
            />
          ) : (
            <Alert
              message={t('trainee.quizContent.notPassedMsg')}
              description={t('trainee.quizContent.notPassedDesc', { score: quiz.attemptScore, total: quiz.totalScore, required: quiz.passScoreCriteria })}
              type="error"
              showIcon
              icon={<XCircle className="w-5 h-5" />}
              className="mb-6"
            />
          )}

          {/* Completion Info */}
          <div className="bg-slate-50 rounded-xl p-4 text-center mb-6">
            <div className="text-sm text-slate-500">{t('trainee.quizContent.completedOn')}</div>
            <div className="font-medium text-slate-900">
              {new Date(quiz.lastAttemptDate).toLocaleString()}
            </div>
          </div>

          {/* Retake Button */}
          <div className="text-center">
            <Button 
              type="primary" 
              size="large" 
              onClick={onRestart}
              icon={<Play className="w-4 h-4" />}
              className="px-8 shadow-lg"
            >
              {t('trainee.quizContent.retakeQuiz')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export default function QuizContent({ sectionQuiz, partition, onReload, onSubmitAttempt }) {
  const { t } = useTranslation();
  // state: 'start', 'attempting', 'result'
  const [quizState, setQuizState] = useState(
    sectionQuiz.isCompleted ? 'result' : 'start'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartQuiz = () => {
    setQuizState('attempting');
  };

  // This function is called by QuizAttempt
  const handleSubmit = async (answers) => {
    console.log('[QuizContent] handleSubmit triggered. Forwarding to LearnContent...'); // <-- LOG
    setIsSubmitting(true);
    try {
      // Call the submit function passed from LearnContent
      await onSubmitAttempt(answers);
      // On success, LearnContent will trigger 'onReload'
      // which will cause this component to show the 'result' state
      setQuizState('result');
      console.log('[QuizContent] Submission successful.'); // <-- LOG
    } catch (error) {
      console.error('Submission failed in QuizContent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (quizState === 'attempting') {
    return (
      <QuizAttempt
        quizData={sectionQuiz} // Pass all quiz data
        onSubmit={handleSubmit} // Pass the handler
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
      />
    );
  }

  // Default is 'start'
  return (
    <QuizStartScreen
      quiz={sectionQuiz}
      onStart={handleStartQuiz}
      t={t}
    />
  );
}