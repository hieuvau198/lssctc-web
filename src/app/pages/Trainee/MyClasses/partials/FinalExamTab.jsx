import { Alert, Skeleton } from 'antd';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  FileText,
  Play,
  Wrench,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyExamInClass } from '../../../../apis/FinalExam/FinalExamApi';
import DayTimeFormat from '../../../../components/DayTimeFormat/DayTimeFormat';

export default function FinalExamTab({ classId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMyExamInClass(classId);
        setExam(data);
      } catch (err) {
        console.error('Failed to fetch final exam:', err);
        setError(err?.response?.data?.message || err?.message || t('trainee.finalExam.loadError'));
        setExam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [classId, t]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Theory':
        return <BookOpen className="w-5 h-5" />;
      case 'Simulation':
        return <Cpu className="w-5 h-5" />;
      case 'Practical':
        return <Wrench className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black">
            <CheckCircle className="w-3 h-3" />
            {t('trainee.finalExam.statusApproved', 'Approved')}
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white font-bold text-xs uppercase tracking-wider border-2 border-black">
            <XCircle className="w-3 h-3" />
            {t('trainee.finalExam.statusRejected', 'Rejected')}
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-wider border-2 border-black">
            <Clock className="w-3 h-3" />
            {t('trainee.finalExam.statusPending', 'Pending')}
          </span>
        );
      case 'NotYet':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-neutral-500 font-bold text-xs uppercase tracking-wider border-2 border-neutral-300">
            {t('trainee.finalExam.statusNotYet', 'Not Yet')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-neutral-500 font-bold text-xs uppercase tracking-wider border-2 border-neutral-300">
            {status}
          </span>
        );
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Loading State
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

  // Error State
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

  // No Exam State
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
            {isPassed ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-black text-sm uppercase tracking-wider border-2 border-yellow-400">
                <CheckCircle className="w-5 h-5" />
                {t('trainee.finalExam.passed', 'Passed')}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-black text-sm uppercase tracking-wider border-2 border-red-600">
                <XCircle className="w-5 h-5" />
                {t('trainee.finalExam.failed', 'Failed')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Score Section */}
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

      {/* Exam Parts */}
      {hasPartials && (
        <div className="bg-white border-2 border-black">
          <div className="h-0.5 bg-yellow-400 w-full" />

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-black" />
              <h2 className="text-xl font-black uppercase tracking-tight">
                {t('trainee.finalExam.examParts', 'Exam Parts')}
              </h2>
            </div>
            <div className="h-1 w-24 bg-yellow-400 mb-8" />

            {/* Table - Desktop */}
            <div className="hidden lg:block">
              {/* Table Header */}
              <div className="grid grid-cols-[200px_120px_140px_140px_180px_140px] gap-4 mb-4 pb-3 border-b-2 border-neutral-200">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t('trainee.finalExam.type', 'Type')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t('trainee.finalExam.duration', 'Duration')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t('trainee.finalExam.marks', 'Marks')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t('trainee.finalExam.status', 'Status')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t('trainee.finalExam.timeRange', 'Time Range')}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t('trainee.finalExam.action', 'Action')}</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-0">
                {exam.partials.map((partial) => (
                  <div key={partial.id} className="border-b-2 border-neutral-200">
                    <div
                      className="grid grid-cols-[200px_120px_140px_140px_180px_140px] gap-4 py-4 items-center hover:bg-neutral-50 transition-all duration-200 hover:border-l-4 hover:border-l-yellow-400 cursor-pointer"
                      onClick={() => (partial.checklists || partial.description) && toggleRow(partial.id)}
                    >
                      {/* Type */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(partial.type)}
                        </div>
                        <span className="font-medium">{partial.type}</span>
                        {(partial.checklists || partial.description) && (
                          expandedRow === partial.id ? (
                            <ChevronUp className="w-4 h-4 ml-auto" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-auto" />
                          )
                        )}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{partial.duration} {t('common.minutes', 'Minutes')}</span>
                      </div>

                      {/* Marks */}
                      <div className={`font-bold ${partial.isPass ? "text-yellow-500" : "text-red-600"}`}>
                        {partial.marks?.toFixed(2) || '0.00'} / {partial.examWeight?.toFixed(2) || '0.00'}
                      </div>

                      {/* Status */}
                      <div>{getStatusBadge(partial.status)}</div>

                      {/* Time Range */}
                      <div className="flex items-center gap-2 text-neutral-600 text-sm">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <div className="flex flex-col text-xs">
                          <DayTimeFormat value={partial.startTime} />
                          <span className="text-neutral-400">→</span>
                          <DayTimeFormat value={partial.endTime} />
                        </div>
                      </div>

                      {/* Action */}
                      <div>
                        {partial.type === 'Theory' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/final-exam/${partial.id}`);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                          >
                            <Play className="w-4 h-4" />
                            {t('trainee.finalExam.startExam', 'Start Exam')}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {expandedRow === partial.id && (
                      <div className="bg-neutral-50 p-6 border-t-2 border-neutral-200">
                        {/* Checklists for Practical */}
                        {partial.type === 'Practical' && partial.checklists && partial.checklists.length > 0 && (
                          <>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-700 mb-4">
                              {t('trainee.finalExam.checklists', 'Practical Checklists')}
                            </h3>
                            <div className="space-y-2">
                              {partial.checklists.map((checklist) => (
                                <div
                                  key={checklist.id}
                                  className="flex items-center justify-between p-4 bg-white border-2 border-neutral-200 hover:border-yellow-400 transition-colors duration-200"
                                >
                                  <div className="flex-1">
                                    <div className="font-bold text-black">{checklist.name}</div>
                                    <div className="text-sm text-neutral-600 mt-1">{checklist.description}</div>
                                  </div>
                                  <div>
                                    {checklist.isPass ? (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black">
                                        <CheckCircle className="w-3 h-3" />
                                        {t('trainee.finalExam.passed', 'Passed')}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white font-bold text-xs uppercase tracking-wider border-2 border-black">
                                        <XCircle className="w-3 h-3" />
                                        {t('trainee.finalExam.failed', 'Failed')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Description/Details for Theory or other */}
                        {partial.description && (
                          <div className="mb-2">
                            <span className="font-semibold text-neutral-600">{t('common.description', 'Description')}:</span>{' '}
                            <span className="text-neutral-500">{partial.description}</span>
                          </div>
                        )}

                        {partial.completeTime && (
                          <div className="mt-2 text-sm text-neutral-500">
                            <span className="font-semibold">{t('trainee.finalExam.completedAt', 'Completed at')}:</span>{' '}
                            <DayTimeFormat value={partial.completeTime} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              {exam.partials.map((partial) => (
                <div key={partial.id} className="border-2 border-black">
                  <div className="h-0.5 bg-yellow-400 w-full" />
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => (partial.checklists || partial.description) && toggleRow(partial.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                          {getTypeIcon(partial.type)}
                        </div>
                        <span className="font-bold">{partial.type}</span>
                      </div>
                      {getStatusBadge(partial.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Clock className="w-4 h-4" />
                        {partial.duration} {t('common.minutes', 'mins')}
                      </div>
                      <div className={`font-bold ${partial.isPass ? "text-yellow-500" : "text-red-600"}`}>
                        {partial.marks?.toFixed(2) || '0.00'} / {partial.examWeight?.toFixed(2) || '0.00'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-600 text-xs mb-3">
                      <Calendar className="w-4 h-4" />
                      <DayTimeFormat value={partial.startTime} /> → <DayTimeFormat value={partial.endTime} />
                    </div>

                    {partial.type === 'Theory' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/final-exam/${partial.id}`);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black"
                      >
                        <Play className="w-4 h-4" />
                        {t('trainee.finalExam.startExam', 'Start Exam')}
                      </button>
                    )}
                  </div>

                  {/* Mobile Expandable */}
                  {expandedRow === partial.id && partial.checklists && (
                    <div className="bg-neutral-50 p-4 border-t-2 border-neutral-200">
                      {partial.checklists.map((checklist) => (
                        <div key={checklist.id} className="flex items-center justify-between p-3 bg-white border-2 border-neutral-200 mb-2">
                          <div>
                            <div className="font-bold text-sm">{checklist.name}</div>
                            <div className="text-xs text-neutral-600">{checklist.description}</div>
                          </div>
                          {checklist.isPass ? (
                            <CheckCircle className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exam Completion Card */}
      {exam.completeTime && (
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
