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
        return 'bg-yellow-400 text-black border-2 border-black';
      case 'In Progress':
        return 'bg-black text-yellow-400 border-2 border-black';
      default:
        return 'bg-neutral-100 text-neutral-600 border-2 border-neutral-300';
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-300 border-t-yellow-400 animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-bold uppercase tracking-wider">{t('common.loading', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-black overflow-hidden">
          <div className="h-1 bg-red-500" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-2 border-black bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-black text-black uppercase mb-2">{t('error.title', 'Có lỗi xảy ra')}</h2>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => {
                setError('');
                fetchExamDetail();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:scale-[1.02] transition-all"
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
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-black bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-black font-bold uppercase">{t('exam.notFound', 'Exam not found')}</p>
        </div>
      </div>
    );
  }

  const isCompleted = exam.status === 'Submitted' || exam.status === 'Completed';

  return (
    <div className="min-h-screen bg-neutral-100 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <PageNav
          items={[
            { title: t('exam.finalExam', 'Final Exam') },
            { title: exam.quizName || exam.practiceName || exam.type }
          ]}
        />

        <div className="mt-6 space-y-6">
          {/* Header Card - Light Wire Theme */}
          <div className="bg-white border-2 border-black overflow-hidden">
            <div className="h-1 bg-yellow-400" />
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white border-2 border-black flex items-center justify-center">
                <FileText className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-3xl font-black text-black uppercase tracking-tight mb-2">
                {exam.quizName || exam.practiceName || `${exam.type} Exam`}
              </h1>
              {exam.description && (
                <p className="text-black/70 max-w-xl mx-auto">{exam.description}</p>
              )}
            </div>
          </div>

          {/* Info Grid - Light Wire Theme */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-black p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                  <Clock className="w-5 h-5 text-black" />
                </div>
              </div>
              <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{t('exam.duration', 'Duration')}</div>
              <div className="text-xl font-black text-black">{exam.duration} {t('exam.minutes', 'minutes')}</div>
            </div>

            <div className="bg-white border-2 border-black p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-black" />
                </div>
              </div>
              <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{t('exam.weight', 'Weight')}</div>
              <div className="text-xl font-black text-black">{exam.examWeight}%</div>
            </div>

            {exam.marks !== null && exam.marks !== undefined && (
              <div className="bg-white border-2 border-black p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                    <Award className="w-5 h-5 text-black" />
                  </div>
                </div>
                <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{t('exam.marks', 'Marks')}</div>
                <div className="text-xl font-black text-black">{exam.marks}</div>
              </div>
            )}

            <div className="bg-white border-2 border-black p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${isCompleted ? 'bg-yellow-400' : 'bg-white'}`}>
                  <CheckCircle className="w-5 h-5 text-black" />
                </div>
              </div>
              <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{t('exam.status', 'Status')}</div>
              <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold uppercase ${getStatusStyle(exam.status)}`}>
                {exam.status || 'NotYet'}
              </span>
            </div>
          </div>

          {/* Time Info */}
          {(exam.startTime || exam.completeTime) && (
            <div className="bg-white border-2 border-black p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exam.startTime && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 uppercase font-bold">{t('exam.startTime', 'Start Time')}</div>
                      <div className="text-black font-bold">{formatDate(exam.startTime)}</div>
                    </div>
                  </div>
                )}
                {exam.completeTime && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 uppercase font-bold">{t('exam.completeTime', 'Complete Time')}</div>
                      <div className="text-black font-bold">{formatDate(exam.completeTime)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Alert */}
          {isCompleted && (
            <div className="bg-yellow-50 border-2 border-yellow-400 p-5 flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-black bg-yellow-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-black text-black uppercase">{t('exam.completedTitle', 'Bài thi đã hoàn thành')}</h3>
                <p className="text-neutral-600 text-sm">{t('exam.completedDesc', 'Bạn đã hoàn thành bài thi này.')}</p>
              </div>
            </div>
          )}

          {/* Start Exam Form */}
          {!isCompleted && (
            <div className="bg-white border-2 border-black overflow-hidden">
              <div className="bg-black px-6 py-4">
                <h3 className="text-yellow-400 font-black text-lg flex items-center gap-2 uppercase tracking-wide">
                  <Lock className="w-5 h-5" />
                  {t('exam.enterOpenCode', 'Enter Open Code to Start')}
                </h3>
              </div>
              <form onSubmit={handleStartExam} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-black uppercase tracking-wider mb-2">
                    {t('exam.openCode', 'Open Code')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      value={openCode}
                      onChange={(e) => setOpenCode(e.target.value)}
                      placeholder={t('exam.openCodePlaceholder', 'Enter open code')}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-300 focus:outline-none focus:border-yellow-400 transition-all text-black placeholder-neutral-400"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-400 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-black font-black text-lg uppercase tracking-wider border-2 border-black hover:scale-[1.01] hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black animate-spin" />
                      {t('common.loading', 'Loading...')}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {t('exam.startExam', 'Start Exam')}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Instructions */}
          {exam.instructions && exam.instructions.length > 0 && (
            <div className="bg-white border-2 border-black overflow-hidden">
              <div className="bg-yellow-50 border-b-2 border-black px-6 py-4">
                <h3 className="text-black font-black flex items-center gap-2 uppercase tracking-wide">
                  <AlertCircle className="w-5 h-5" />
                  {t('exam.instructions', 'Instructions')}
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {exam.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-yellow-400 text-black border-2 border-black flex items-center justify-center text-sm font-black flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-neutral-700 leading-relaxed">{instruction}</span>
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
