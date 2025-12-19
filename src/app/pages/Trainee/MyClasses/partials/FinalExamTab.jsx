import { Alert, Skeleton } from 'antd';
import { Award, Calendar, CheckCircle, Clock, Lock, XCircle } from 'lucide-react'; // Added Clock
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMyExamInClass } from '../../../../apis/FinalExam/FinalExamApi';
import { getMyProgressInClass } from '../../../../apis/Trainee/TraineeProgressApi';
import DayTimeFormat from '../../../../components/DayTimeFormat/DayTimeFormat';
import FinalExamPartialsList from './FinalExamPartialsList';

export default function FinalExamTab({ classId }) {
  const { t } = useTranslation();
  const [exam, setExam] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [examData, progressData] = await Promise.allSettled([
          getMyExamInClass(classId),
          getMyProgressInClass(classId)
        ]);

        if (examData.status === 'fulfilled') {
          setExam(examData.value);
        } else {
          console.error('Failed to fetch final exam:', examData.reason);
          if (examData.reason?.response?.status !== 404) {
            setError(examData.reason?.message || t('trainee.finalExam.loadError'));
          }
        }

        if (progressData.status === 'fulfilled') {
          setProgress(progressData.value);
        } else {
          console.error('Failed to fetch progress:', progressData.reason);
        }

      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, t]);

  const isQualified = progress?.status === 'Completed';

  const getStatusBadge = (exam) => {
    if (!exam?.status) return null;

    switch (exam.status) {
      case 'Completed':
        return exam.isPass ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-black text-sm uppercase tracking-wider border-2 border-yellow-400">
            <CheckCircle className="w-5 h-5" />
            {t('trainee.finalExam.passed', 'Passed')}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-black text-sm uppercase tracking-wider border-2 border-red-600">
            <XCircle className="w-5 h-5" />
            {t('trainee.finalExam.failed', 'Failed')}
          </div>
        );
      case 'Submitted':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-black text-sm uppercase tracking-wider border-2 border-green-700">
            <Clock className="w-5 h-5" />
            {t('trainee.finalExam.submitted', 'Submitted')}
          </div>
        );
      case 'NotYet':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-500 font-black text-sm uppercase tracking-wider border-2 border-neutral-300">
            {t('trainee.finalExam.statusNotYet', 'Not Yet')}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-500 font-black text-sm uppercase tracking-wider border-2 border-neutral-300">
            {exam.status}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-black">
        <div className="h-0.5 bg-yellow-400 w-full" />
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-2 border-black">
        <div className="h-0.5 bg-yellow-400 w-full" />
        <div className="p-6">
          <Alert
            type="warning"
            message={t('trainee.finalExam.noExam')}
            description={error}
            showIcon
          />
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="bg-white border-2 border-black">
        <div className="h-0.5 bg-yellow-400 w-full" />
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 border-2 border-yellow-400 flex items-center justify-center">
            <Award className="w-10 h-10 text-neutral-400" />
          </div>
          <p className="text-neutral-600 font-medium">{t('trainee.finalExam.noExamAvailable')}</p>
        </div>
      </div>
    );
  }

  const isPassed = exam.isPass;
  const hasPartials = exam.partials && exam.partials.length > 0;
  const totalMarks = exam.totalMarks || 0;
  const isExamCompleted = exam.status === 'Completed';

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-black border-2 border-black relative overflow-hidden">
        <div className="h-0.5 bg-yellow-400 w-full" />

        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-yellow-400 flex items-center justify-center">
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl uppercase tracking-tight">
                {t('trainee.finalExam.title', 'Final Exam')}
              </h1>
              <p className="text-neutral-400 font-medium">
                {exam.traineeName} - {exam.traineeCode}
              </p>
            </div>
          </div>

          <div>
            {getStatusBadge(exam)}
          </div>
        </div>
      </div>

      {/* Qualification Status Message */}
      <div className={`border-2 border-black p-4 ${isQualified ? 'bg-green-50' : 'bg-neutral-50'}`}>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full border-2 border-black ${isQualified ? 'bg-green-400' : 'bg-neutral-300'}`}>
            {isQualified ? <CheckCircle className="w-5 h-5 text-black" /> : <Lock className="w-5 h-5 text-black" />}
          </div>
          <div>
            <h3 className="font-bold text-lg uppercase tracking-tight mb-1">
              {isQualified ? t('trainee.finalExam.qualifiedTitle', 'Qualified for Final Exam') : t('trainee.finalExam.notQualifiedTitle', 'Not Yet Qualified')}
            </h3>
            <p className="text-sm text-neutral-600">
              {isQualified
                ? t('trainee.finalExam.qualifiedDesc', 'You have completed all course requirements and can now proceed with the final exam.')
                : t('trainee.finalExam.notQualifiedDesc', 'You must complete all course learning materials and progress requirements before you can start the final exam.')}
            </p>
            {progress && (
              <div className="mt-2 text-xs font-mono bg-white px-2 py-1 border border-neutral-300 inline-block">
                Current Status: <span className="font-bold">{progress.status}</span> ({progress.progressPercentage?.toFixed(0)}%)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Score Section - Only visible if Completed */}
      {isExamCompleted && (
        <div className="bg-white border-2 border-black relative">
          <div className="h-0.5 bg-yellow-400 w-full" />

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {t('trainee.finalExam.overallScore', 'Overall Score')}
              </h2>
              <div className="font-black text-4xl md:text-5xl tracking-tight text-black">
                {totalMarks.toFixed(2)} / 10
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 border-2 border-black bg-white">
              <div
                className={`h-full transition-all duration-1000 ${isPassed ? "bg-yellow-400" : "bg-red-400"}`}
                style={{ width: `${(totalMarks / 10) * 100}%` }}
              />
            </div>

            {exam.examCode && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-neutral-500">{t('trainee.finalExam.examCode', 'Exam Code')}:</span>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 font-mono text-sm font-semibold border-2 border-neutral-200">
                  {exam.examCode}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exam Parts List */}
      {hasPartials && (
        <FinalExamPartialsList
          partials={exam.partials}
          isQualified={isQualified}
          examStatus={exam.status}
        />
      )}

      {/* Exam Completion Card */}
      {(exam.completeTime || isExamCompleted) && (
        <div className="bg-neutral-50 border-2 border-black relative">
          <div className="h-0.5 bg-yellow-400 w-full" />

          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-yellow-400 flex items-center justify-center bg-yellow-400">
              <CheckCircle className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight">
                {t('trainee.finalExam.examCompleted', 'Exam Completed')}
              </h3>
              <div className="flex items-center gap-2 text-neutral-600 font-medium">
                <Calendar className="w-4 h-4" />
                <DayTimeFormat value={exam.completeTime} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}