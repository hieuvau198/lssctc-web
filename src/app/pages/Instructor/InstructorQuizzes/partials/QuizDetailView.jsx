import React, { useEffect, useState } from 'react';
import { Skeleton, Alert, Button, Tag, Empty, Collapse, message } from 'antd';
import {
  ArrowLeft,
  Clock,
  Target,
  Award,
  HelpCircle,
  CheckCircle,
  XCircle,
  Edit,
  Calendar,
  ChevronRight,
  FileQuestion,
  CheckSquare,
  Square
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
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
    });
  } catch (e) {
    return dateString;
  }
};

export default function QuizDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
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
        setError(e?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadQuiz();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <Button
            type="text"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/instructor/quizzes')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            Back to Quizzes
          </Button>
          <Alert type="error" message="Error" description={error} showIcon className="rounded-xl" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <Button
            type="text"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/instructor/quizzes')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            Back to Quizzes
          </Button>
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
            <Empty description="Quiz not found" />
          </div>
        </div>
      </div>
    );
  }

  const questionItems = (quiz.questions || []).map((q, idx) => ({
    key: q.id,
    label: (
      <div className="flex items-center justify-between w-full py-1">
        <span className="font-bold text-gray-800 text-base">Question {idx + 1}: {q.name}</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <Award className="w-3 h-3" />
          {q.questionScore} pts
        </span>
      </div>
    ),
    children: (
      <div className="space-y-6 px-2 pb-4">
        {/* Question Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-gray-700 font-medium">{q.description || 'No description provided'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Type</p>
            <div className="flex items-center gap-2">
              {q.isMultipleAnswers ? (
                <>
                  <CheckSquare className="w-4 h-4 text-purple-500" />
                  <span className="text-purple-700 font-bold text-sm">Multiple Answers</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-700 font-bold text-sm">Single Answer</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Options */}
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">{q.options?.length || 0}</span>
            Answer Options
          </p>
          <div className="space-y-3">
            {(q.options || []).map((opt, optIdx) => (
              <div
                key={opt.id}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${opt.isCorrect
                  ? 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${opt.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <p className={`font-bold ${opt.isCorrect ? 'text-emerald-900' : 'text-gray-700'}`}>
                        {opt.name}
                      </p>
                    </div>
                    {opt.description && (
                      <p className="text-sm text-gray-500 ml-8">{opt.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {opt.isCorrect && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                        <CheckCircle className="w-3 h-3" />
                        Correct
                      </span>
                    )}
                    <span className="text-xs font-bold text-gray-400">{opt.optionScore} pts</span>
                  </div>
                </div>

                {opt.explanation && (
                  <div className="mt-3 ml-8 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
                    <p className="text-blue-800 font-medium flex items-center gap-2 mb-1">
                      <HelpCircle className="w-3 h-3" />
                      Explanation
                    </p>
                    <p className="text-blue-700/80">{opt.explanation}</p>
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
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans animate-in fade-in duration-500">
      {/* Header */}
      <div className="w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              onClick={() => navigate('/instructor/quizzes')}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1 cursor-pointer hover:underline w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="uppercase tracking-wider text-xs">Back to Quizzes</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {quiz.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="large"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => navigate(`/instructor/quizzes/${id}/edit`)}
              className="!flex !items-center !gap-2 !h-12 !px-6 !rounded-xl !font-bold !shadow-sm hover:!shadow-md transition-all duration-300"
            >
              Edit Quiz
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pass Score */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:border-blue-200 transition-colors">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Pass Criteria</p>
              <p className="text-2xl font-extrabold text-gray-900">{quiz.passScoreCriteria}</p>
              <p className="text-xs font-medium text-blue-600 mt-1">Required to pass</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Target className="w-5 h-5" />
            </div>
          </div>

          {/* Total Score */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:border-emerald-200 transition-colors">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Score</p>
              <p className="text-2xl font-extrabold text-gray-900">{quiz.totalScore}</p>
              <p className="text-xs font-medium text-emerald-600 mt-1">Maximum points</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
          </div>

          {/* Time Limit */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:border-purple-200 transition-colors">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Time Limit</p>
              <p className="text-2xl font-extrabold text-gray-900">{quiz.timelimitMinute}</p>
              <p className="text-xs font-medium text-purple-600 mt-1">Minutes allowed</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Questions Count */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:border-orange-200 transition-colors">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Questions</p>
              <p className="text-2xl font-extrabold text-gray-900">{quiz.questions?.length || 0}</p>
              <p className="text-xs font-medium text-orange-600 mt-1">Total items</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Description */}
        {quiz.description && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{quiz.description}</p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Quiz Content</h2>
            <span className="text-sm font-medium text-gray-500">{quiz.questions?.length || 0} Questions</span>
          </div>

          {quiz.questions && quiz.questions.length > 0 ? (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-2">
              <Collapse
                items={questionItems}
                bordered={false}
                expandIcon={({ isActive }) => <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />}
                className="bg-white [&_.ant-collapse-item]:border-b-0 [&_.ant-collapse-item]:mb-2 [&_.ant-collapse-item]:rounded-xl [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:!py-4 [&_.ant-collapse-header]:!px-6 [&_.ant-collapse-header]:hover:bg-gray-50/80 [&_.ant-collapse-content]:!border-t-0"
              />
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
              <Empty description="No questions added yet" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
