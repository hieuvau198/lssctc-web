import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { Clock, FileText, Lock, Calendar, Trophy, CheckCircle, Award, Play, AlertCircle, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PageNav from '../../../components/PageNav/PageNav';
import PartialApi from '../../../apis/FinalExam/PartialApi';

export default function FinalExam() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [exam, setExam] = useState(null);
  const [openCode, setOpenCode] = useState('');

  useEffect(() => {
    if (id) {
      fetchExamDetail();
    } else {
      setError(t('exam.invalidId', 'Invalid Exam ID'));
      setDataLoading(false);
    }
  }, [id]);

  const fetchExamDetail = async () => {
    try {
      setDataLoading(true);
      setError('');
      const data = await PartialApi.getMyPartialDetail(id);
      if (data) {
        setExam(data);
      } else {
        setError(t('exam.notFound', 'Exam not found'));
      }
    } catch (err) {
      console.error('Error fetching exam:', err);
      const errorMsg = err.response?.data?.message || err.message || t('exam.fetchError', 'Failed to load exam details');
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setDataLoading(false);
    }
  };

  const handleStartExam = async (e) => {
    e.preventDefault();
    if (!openCode.trim()) {
      message.error(t('exam.openCodeRequired', 'Please enter the open code'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      const payload = { examCode: openCode.trim() };

      if (exam.type === 'Theory') {
        response = await PartialApi.startTheoryExam(id, payload);
      } else if (exam.type === 'Simulation') {
        response = await PartialApi.startSimulationExam(id, payload);
      } else {
        message.error("Unknown exam type");
        setLoading(false);
        return;
      }

      navigate(`/final-exam/${id}/take`, { state: { examData: exam, sessionData: response } });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError(t('exam.invalidCode', 'Mã đề không hợp lệ. Vui lòng kiểm tra lại.'));
      } else {
        setError(err.response?.data?.message || t('exam.startError', 'Failed to start exam. Check your code.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">{t('common.loading', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-rose-400 to-red-500" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{t('error.title', 'Có lỗi xảy ra')}</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => {
                setError('');
                fetchExamDetail();
              }}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-200 hover:shadow-xl transition-all duration-300"
            >
              <RefreshCcw className="w-4 h-4" />
              {t('common.retry', 'Thử lại')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-slate-600 font-medium">{t('exam.notFound', 'Exam not found')}</p>
        </div>
      </div>
    );
  }

  const isCompleted = exam.status === 'Submitted' || exam.status === 'Completed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <PageNav
          items={[
            { title: t('exam.finalExam', 'Final Exam') },
            { title: exam.quizName || exam.practiceName || exam.type }
          ]}
        />

        <div className="mt-4 space-y-6">
          {/* Header Card */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 p-8 text-white text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FileText className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {exam.quizName || exam.practiceName || `${exam.type} Exam`}
              </h1>
              {exam.description && (
                <p className="text-white/80 max-w-xl mx-auto">{exam.description}</p>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-lg shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
              <div className="text-xs text-slate-400 uppercase font-semibold">{t('exam.duration', 'Duration')}</div>
              <div className="text-xl font-bold text-slate-800">{exam.duration} {t('exam.minutes', 'phút')}</div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-lg shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-xs text-slate-400 uppercase font-semibold">{t('exam.weight', 'Weight')}</div>
              <div className="text-xl font-bold text-slate-800">{exam.examWeight}%</div>
            </div>

            {exam.marks !== null && exam.marks !== undefined && (
              <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-lg shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-xs text-slate-400 uppercase font-semibold">{t('exam.marks', 'Marks')}</div>
                <div className="text-xl font-bold text-slate-800">{exam.marks}</div>
              </div>
            )}

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-lg shadow-slate-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                  <CheckCircle className={`w-5 h-5 ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`} />
                </div>
              </div>
              <div className="text-xs text-slate-400 uppercase font-semibold">{t('exam.status', 'Status')}</div>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(exam.status)}`}>
                {exam.status || 'Not Started'}
              </span>
            </div>
          </div>

          {/* Time Info */}
          {(exam.startTime || exam.completeTime) && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-5 shadow-lg shadow-slate-200/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exam.startTime && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">{t('exam.startTime', 'Start Time')}</div>
                      <div className="text-slate-700 font-medium">{formatDate(exam.startTime)}</div>
                    </div>
                  </div>
                )}
                {exam.completeTime && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">{t('exam.completeTime', 'Complete Time')}</div>
                      <div className="text-slate-700 font-medium">{formatDate(exam.completeTime)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Alert */}
          {isCompleted && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-800">{t('exam.completedTitle', 'Bài thi đã hoàn thành')}</h3>
                <p className="text-emerald-600 text-sm">{t('exam.completedDesc', 'Bạn đã hoàn thành bài thi này.')}</p>
              </div>
            </div>
          )}

          {/* Start Exam Form */}
          {!isCompleted && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t('exam.enterOpenCode', 'Nhập mã để bắt đầu')}
                </h3>
              </div>
              <form onSubmit={handleStartExam} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    {t('exam.openCode', 'Mã đề thi')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={openCode}
                      onChange={(e) => setOpenCode(e.target.value)}
                      placeholder={t('exam.openCodePlaceholder', 'Nhập mã đề thi')}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-300 text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('common.loading', 'Đang tải...')}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {t('exam.startExam', 'Bắt đầu làm bài')}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Instructions */}
          {exam.instructions && exam.instructions.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                <h3 className="text-amber-800 font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {t('exam.instructions', 'Hướng dẫn')}
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {exam.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 leading-relaxed">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
