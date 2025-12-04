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
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/instructor/quizzes')}
        className="mb-4"
      >
        {t('instructor.quizzes.backToQuizzes')}
      </Button>

      <Card className="mb-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{quiz.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('instructor.quizzes.quizId')}: {quiz.id}</p>
          </div>

          {quiz.description && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-gray-700 mb-2">{t('instructor.quizzes.form.description')}:</p>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
          )}

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.passCriteria')}</p>
              <p className="text-2xl font-bold text-blue-600">{quiz.passScoreCriteria}</p>
              <p className="text-xs text-gray-500 mt-1">{t('instructor.quizzes.outOfRequired', { total: quiz.totalScore })}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.scoreSummary.totalScore')}</p>
              <p className="text-2xl font-bold text-green-600">{quiz.totalScore}</p>
              <p className="text-xs text-gray-500 mt-1">{t('instructor.quizzes.maximumPoints')}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.timeLimit')}</p>
              <p className="text-2xl font-bold text-purple-600">{quiz.timelimitMinute}</p>
              <p className="text-xs text-gray-500 mt-1">{t('instructor.quizzes.minutes')}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.totalQuestions')}</p>
              <p className="text-2xl font-bold text-orange-600">{quiz.questions?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{t('instructor.quizzes.questionsInQuiz')}</p>
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.createdAt')}</p>
              <p className="text-gray-800 text-sm mt-2">{formatDate(quiz.createdAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold">{t('instructor.quizzes.lastUpdated')}</p>
              <p className="text-gray-800 text-sm mt-2">{formatDate(quiz.updatedAt)}</p>
            </div>
          </div>

          <Divider />

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">{t('instructor.quizzes.created')}:</span> {new Date(quiz.createdAt).toLocaleString()}
            </p>
            {quiz.updatedAt && quiz.updatedAt !== quiz.createdAt && (
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-semibold">{t('instructor.quizzes.lastUpdated')}:</span> {new Date(quiz.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Card>

      {quiz.questions && quiz.questions.length > 0 ? (
        <Card title={t('instructor.quizzes.questions.title')} className="mb-6">
          <Collapse items={questionItems} />
        </Card>
      ) : (
        <Card title={t('instructor.quizzes.questions.title')}>
          <Empty description={t('instructor.quizzes.noQuestions')} />
        </Card>
      )}

      <div className="flex gap-3 mb-4">
        <Button 
          type="primary"
          onClick={() => navigate(`/instructor/quizzes/${id}/edit`)}
        >
          {t('instructor.quizzes.editQuiz')}
        </Button>
        <Button 
          onClick={() => navigate('/instructor/quizzes')}
        >
          {t('instructor.quizzes.backToList')}
        </Button>
      </div>
    </div>
  );
}
