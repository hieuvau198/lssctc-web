import React, { useEffect, useState } from 'react';
import { Skeleton, Empty, Collapse } from 'antd';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';
import {
  ArrowLeft, HelpCircle, Target, Star, Clock, FileText,
  Calendar, RefreshCw, AlertCircle, CheckCircle, List
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

export default function QuizDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQuizDetail(id);
        setQuiz(data);
      } catch (e) {
        console.error('Error loading quiz:', e);
        setError(e?.message || t('instructor.quizzes.messages.loadQuizFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadQuiz();
    }
  }, [id, t]);

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="bg-black border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-neutral-800" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border-2 border-black p-6">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <button
          onClick={() => navigate('/instructor/quizzes')}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('instructor.quizzes.backToQuizzes')}
        </button>
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-4" />
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold uppercase">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <button
          onClick={() => navigate('/instructor/quizzes')}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('instructor.quizzes.backToQuizzes')}
        </button>
        <div className="bg-white border-2 border-black p-12">
          <div className="h-1 bg-yellow-400 -mx-12 -mt-12 mb-8" />
          <Empty description={t('instructor.quizzes.quizNotFound')} />
        </div>
      </div>
    );
  }

  const questionItems = (quiz.questions || []).map((q, idx) => ({
    key: q.id,
    label: (
      <div className="flex items-center justify-between w-full pr-4">
        <span className="font-bold uppercase tracking-wide">
          {t('instructor.quizzes.questions.question')} {idx + 1}: {q.name}
        </span>
        <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold border-2 border-black">
          {q.questionScore} {t('instructor.quizzes.questions.pts')}
        </span>
      </div>
    ),
    children: (
      <div className="space-y-4">
        <div className="border-2 border-neutral-200 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            {t('instructor.quizzes.questions.description')}
          </p>
          <p className="text-neutral-700">{q.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-neutral-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              {t('instructor.quizzes.questions.questionScore')}
            </p>
            <p className="text-lg font-black">{q.questionScore} {t('instructor.quizzes.points')}</p>
          </div>
          <div className="border-2 border-neutral-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              {t('instructor.quizzes.multipleAnswers')}
            </p>
            <p className="text-lg font-black">{q.isMultipleAnswers ? t('instructor.quizzes.multipleAnswersYes') : t('instructor.quizzes.multipleAnswersNo')}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            {t('instructor.quizzes.answerOptions')} ({q.options?.length || 0})
          </p>
          <div className="space-y-2">
            {(q.options || []).map((opt, optIdx) => (
              <div
                key={opt.id}
                className={`p-4 border-2 ${opt.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-neutral-200 bg-white'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-black text-yellow-400 text-xs font-bold flex items-center justify-center">
                        {optIdx + 1}
                      </span>
                      <span className="font-bold">{opt.name}</span>
                    </div>
                    {opt.description && (
                      <p className="text-sm text-neutral-500">{opt.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {opt.isCorrect && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {t('instructor.quizzes.options.correct')}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold">
                      {opt.optionScore} {t('instructor.quizzes.questions.pts')}
                    </span>
                  </div>
                </div>
                {opt.explanation && (
                  <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-xs font-bold uppercase mb-1">{t('instructor.quizzes.options.explanation')}:</p>
                    <p className="text-sm">{opt.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
      {/* Back Button */}
      <button
        onClick={() => navigate('/instructor/quizzes')}
        className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm hover:bg-neutral-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('instructor.quizzes.backToQuizzes')}
      </button>

      {/* Header - Industrial Theme */}
      <div className="bg-black border-2 border-black p-5 mb-6">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-black" />
            </div>
            <div>
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">
                {t('instructor.quizzes.detail.quizId', { id: quiz.id })}
              </p>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {quiz.name}
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/instructor/quizzes')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-neutral-100 transition-all"
            >
              {t('instructor.quizzes.backToList')}
            </button>
            <button
              onClick={() => navigate(`/instructor/quizzes/${id}/edit`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 transition-all"
            >
              {t('instructor.quizzes.editQuiz')}
            </button>
          </div>
        </div>

        {quiz.description && (
          <div className="mt-4 p-4 bg-white/10 border-2 border-white/20">
            <p className="text-white/90">{quiz.description}</p>
          </div>
        )}
      </div>

      {/* Stats Grid - Industrial */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {t('instructor.quizzes.detail.passScoreCriteria')}
            </p>
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Target className="w-5 h-5 text-black" />
            </div>
          </div>
          <p className="text-4xl font-black text-black">{quiz.passScoreCriteria}</p>
          <p className="text-xs text-neutral-500 mt-1">{t('instructor.quizzes.detail.outOfRequired', { total: quiz.totalScore })}</p>
        </div>

        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {t('instructor.quizzes.scoreSummary.totalScore')}
            </p>
            <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-black">{quiz.totalScore}</p>
          <p className="text-xs text-neutral-500 mt-1">{t('instructor.quizzes.detail.maximumPoints')}</p>
        </div>

        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {t('instructor.quizzes.detail.timeLimit')}
            </p>
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Clock className="w-5 h-5 text-black" />
            </div>
          </div>
          <p className="text-4xl font-black text-black">{quiz.timelimitMinute}</p>
          <p className="text-xs text-neutral-500 mt-1">{t('instructor.quizzes.detail.minutes')}</p>
        </div>

        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {t('instructor.quizzes.detail.totalQuestions')}
            </p>
            <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-black">{quiz.questions?.length || 0}</p>
          <p className="text-xs text-neutral-500 mt-1">{t('instructor.quizzes.detail.questionsInQuiz')}</p>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Calendar className="w-4 h-4 text-black" />
            </div>
            <p className="font-bold uppercase text-sm">{t('instructor.quizzes.detail.createdAt')}</p>
          </div>
          <p className="text-neutral-600">{formatDate(quiz.createdAt)}</p>
        </div>

        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="font-bold uppercase text-sm">{t('instructor.quizzes.detail.lastUpdated')}</p>
          </div>
          <p className="text-neutral-600">{formatDate(quiz.updatedAt)}</p>
        </div>
      </div>

      {/* Questions Section */}
      {quiz.questions && quiz.questions.length > 0 ? (
        <div className="bg-white border-2 border-black overflow-hidden">
          <div className="h-1 bg-yellow-400" />
          <div className="px-6 py-4 border-b-2 border-neutral-200 bg-neutral-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                <List className="w-5 h-5 text-black" />
              </div>
              <h2 className="font-black text-black uppercase tracking-tight">
                {t('instructor.quizzes.questions.title')} ({quiz.questions.length})
              </h2>
            </div>
          </div>
          <div className="p-6">
            <style>{`
              .industrial-collapse .ant-collapse-item {
                border: 2px solid #000 !important;
                margin-bottom: 12px !important;
              }
              .industrial-collapse .ant-collapse-header {
                background: #fef9c3 !important;
                font-weight: 700 !important;
              }
              .industrial-collapse .ant-collapse-content {
                border-top: 2px solid #000 !important;
              }
            `}</style>
            <Collapse
              items={questionItems}
              className="industrial-collapse"
              defaultActiveKey={[quiz.questions[0]?.id]}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-black p-12">
          <div className="h-1 bg-yellow-400 -mx-12 -mt-12 mb-8" />
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-800 font-bold uppercase mb-2">{t('instructor.quizzes.noQuestions')}</p>
            <p className="text-neutral-500 text-sm">{t('instructor.quizzes.createQuiz')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
