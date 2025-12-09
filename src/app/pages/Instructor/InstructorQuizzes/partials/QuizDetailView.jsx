import React, { useEffect, useState } from 'react';
import { Card, Skeleton, Alert, Button, Tag, Divider, Empty, Collapse, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';

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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/instructor/quizzes')}
          className="mb-4"
        >
          {t('instructor.quizzes.backToQuizzes')}
        </Button>
        <Alert type="error" message={t('common.error')} description={error} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/instructor/quizzes')}
          className="mb-4"
        >
          {t('instructor.quizzes.backToQuizzes')}
        </Button>
        <Card>
          <Empty description={t('instructor.quizzes.quizNotFound')} />
        </Card>
      </div>
    );
  }

  const questionItems = (quiz.questions || []).map((q, idx) => ({
    key: q.id,
    label: `${t('instructor.quizzes.questions.question')}${idx + 1}: ${q.name}`,
    extra: <Tag color="blue">{q.questionScore} {t('instructor.quizzes.questions.pts')}</Tag>,
    children: (
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-gray-600">{t('instructor.quizzes.questions.description')}:</p>
          <p>{q.description}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">{t('instructor.quizzes.questions.questionScore')}:</p>
          <p>{q.questionScore} {t('instructor.quizzes.points')}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">{t('instructor.quizzes.multipleAnswers')}:</p>
          <p>{q.isMultipleAnswers ? t('instructor.quizzes.multipleAnswersYes') : t('instructor.quizzes.multipleAnswersNo')}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600 mb-2">{t('instructor.quizzes.answerOptions')} ({q.options?.length || 0}):</p>
          <div className="space-y-2">
            {(q.options || []).map((opt, optIdx) => (
              <div 
                key={opt.id}
                className={`p-3 rounded border-l-4 ${
                  opt.isCorrect 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-medium">{t('instructor.quizzes.options.option')} {optIdx + 1}:</p>
                    <p className="text-sm mt-1">{opt.name}</p>
                    {opt.description && (
                      <p className="text-xs text-gray-500 mt-1">({opt.description})</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {opt.isCorrect && (
                      <Tag color="green" className="mb-1">✓ {t('instructor.quizzes.options.correct')}</Tag>
                    )}
                    <Tag color="blue">{opt.optionScore} {t('instructor.quizzes.questions.pts')}</Tag>
                  </div>
                </div>
                {opt.explanation && (
                  <div className="mt-2 p-2 bg-blue-100 rounded text-xs">
                    <p className="font-semibold">{t('instructor.quizzes.options.explanation')}:</p>
                    <p>{opt.explanation}</p>
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
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Back Button with Modern Style */}
      <Button 
        type="text" 
        size="large"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/instructor/quizzes')}
        className="mb-4 hover:bg-gray-100"
      >
        {t('instructor.quizzes.backToQuizzes')}
      </Button>

      {/* Header Card with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{quiz.name}</h1>
            <p className="text-blue-100 text-sm">
              {t('instructor.quizzes.detail.quizId', { id: quiz.id })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              size="large"
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
              onClick={() => navigate('/instructor/quizzes')}
            >
              {t('instructor.quizzes.backToList')}
            </Button>
            <Button 
              type="primary"
              size="large"
              className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-md"
              onClick={() => navigate(`/instructor/quizzes/${id}/edit`)}
            >
              {t('instructor.quizzes.editQuiz')}
            </Button>
          </div>
        </div>

        {quiz.description && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <p className="text-white/90 text-sm leading-relaxed">{quiz.description}</p>
          </div>
        )}
      </div>

      {/* Stats Cards - Modern Design with Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.detail.passScoreCriteria')}</p>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-1">{quiz.passScoreCriteria}</p>
          <p className="text-xs text-gray-500">{t('instructor.quizzes.detail.outOfRequired', { total: quiz.totalScore })}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.scoreSummary.totalScore')}</p>
            <span className="text-3xl">⭐</span>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-1">{quiz.totalScore}</p>
          <p className="text-xs text-gray-500">{t('instructor.quizzes.detail.maximumPoints')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.detail.timeLimit')}</p>
            <span className="text-3xl">⏱️</span>
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-1">{quiz.timelimitMinute}</p>
          <p className="text-xs text-gray-500">{t('instructor.quizzes.detail.minutes')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.detail.totalQuestions')}</p>
            <span className="text-3xl">📝</span>
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-1">{quiz.questions?.length || 0}</p>
          <p className="text-xs text-gray-500">{t('instructor.quizzes.detail.questionsInQuiz')}</p>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📅</span>
            <p className="text-gray-700 font-semibold">{t('instructor.quizzes.detail.createdAt')}</p>
          </div>
          <p className="text-gray-600 text-sm">{formatDate(quiz.createdAt)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🔄</span>
            <p className="text-gray-700 font-semibold">{t('instructor.quizzes.detail.lastUpdated')}</p>
          </div>
          <p className="text-gray-600 text-sm">{formatDate(quiz.updatedAt)}</p>
        </div>
      </div>

      {/* Questions Section - Modern Card */}
      {quiz.questions && quiz.questions.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📋</span>
              {t('instructor.quizzes.questions.title')}
            </h2>
          </div>
          <div className="p-6">
            <Collapse 
              items={questionItems} 
              className="modern-collapse"
              defaultActiveKey={[quiz.questions[0]?.id]}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12">
          <Empty 
            description={
              <div>
                <p className="text-gray-600 text-lg font-medium mb-2">{t('instructor.quizzes.noQuestions')}</p>
                <p className="text-gray-400 text-sm">{t('instructor.quizzes.createQuiz')}</p>
              </div>
            }
            image={<div className="text-8xl">📝</div>}
          />
        </div>
      )}
    </div>
  );
}
