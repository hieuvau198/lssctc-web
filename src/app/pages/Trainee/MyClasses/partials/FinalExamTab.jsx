import { Alert, Button, Empty, Skeleton, Table, Progress } from 'antd';
import { Award, Calendar, Clock, FileText, CheckCircle, XCircle, BookOpen, Cpu, Wrench, Play } from 'lucide-react';
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
  }, [classId]);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
        <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
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
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
        <div className="h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center shadow-inner">
            <Award className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">{t('trainee.finalExam.noExamAvailable')}</p>
        </div>
      </div>
    );
  }

  const isPassed = exam.isPass;
  const hasPartials = exam.partials && exam.partials.length > 0;
  const totalMarks = exam.totalMarks || 0;

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Theory':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Simulation':
        return <Cpu className="w-5 h-5 text-purple-500" />;
      case 'Practical':
        return <Wrench className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Approved':
        return { bgColor: 'bg-emerald-100', textColor: 'text-emerald-700', text: t('trainee.finalExam.statusApproved') };
      case 'Rejected':
        return { bgColor: 'bg-red-100', textColor: 'text-red-700', text: t('trainee.finalExam.statusRejected') };
      case 'Pending':
        return { bgColor: 'bg-amber-100', textColor: 'text-amber-700', text: t('trainee.finalExam.statusPending') };
      case 'NotYet':
        return { bgColor: 'bg-slate-100', textColor: 'text-slate-600', text: t('trainee.finalExam.statusNotYet') };
      default:
        return { bgColor: 'bg-slate-100', textColor: 'text-slate-600', text: status };
    }
  };

  // Partials table columns
  const partialsColumns = [
    {
      title: t('trainee.finalExam.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <span className="font-semibold text-slate-700">{type}</span>
        </div>
      ),
    },
    {
      title: t('trainee.finalExam.duration'),
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <span className="text-slate-600">{duration} {t('common.minutes')}</span>
      ),
    },
    {
      title: t('trainee.finalExam.marks'),
      dataIndex: 'marks',
      key: 'marks',
      render: (marks, record) => (
        <span className={`font-bold ${record.isPass ? 'text-emerald-600' : 'text-red-600'}`}>
          {marks.toFixed(2)} / {record.examWeight.toFixed(2)}
        </span>
      ),
    },
    {
      title: t('trainee.finalExam.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusInfo = getStatusInfo(status);
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.textColor}`}>
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      title: t('trainee.finalExam.timeRange'),
      key: 'timeRange',
      render: (_, record) => (
        <div className="text-xs text-slate-500">
          <div><DayTimeFormat value={record.startTime} /></div>
          <div className="text-slate-400">→</div>
          <div><DayTimeFormat value={record.endTime} /></div>
        </div>
      ),
    },
    {
      title: t('trainee.finalExam.action'),
      key: 'action',
      render: (_, record) => (
        record.type === 'Theory' ? (
          <Button
            type="primary"
            onClick={() => navigate(`/final-exam/${record.id}`)}
            icon={<Play className="w-4 h-4" />}
          >
            {t('trainee.finalExam.startExam')}
          </Button>
        ) : null
      ),
    },
  ];

  // Checklists table columns (for Practical exam)
  const checklistColumns = [
    {
      title: t('trainee.finalExam.checklistName'),
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span className="font-medium text-slate-700">{name}</span>,
    },
    {
      title: t('trainee.finalExam.description'),
      dataIndex: 'description',
      key: 'description',
      render: (desc) => <span className="text-slate-500">{desc}</span>,
    },
    {
      title: t('trainee.finalExam.result'),
      dataIndex: 'isPass',
      key: 'isPass',
      render: (isPass) => (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isPass ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {isPass ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {isPass ? t('trainee.finalExam.passed') : t('trainee.finalExam.failed')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold m-0">{t('trainee.finalExam.title')}</h2>
                <p className="text-white/80 mt-1 text-sm">
                  {exam.traineeName} - {exam.traineeCode}
                </p>
              </div>
            </div>
            <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${isPassed ? 'bg-emerald-500' : 'bg-red-500/95'}`}>
              {isPassed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isPassed ? t('trainee.finalExam.passed') : t('trainee.finalExam.failed')}
            </span>
          </div>
        </div>

        {/* Overall Score */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-cyan-50/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{t('trainee.finalExam.overallScore')}</h3>
            <span className={`text-4xl font-bold ${isPassed ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-rose-500'} bg-clip-text text-transparent`}>
              {totalMarks.toFixed(2)} / 10
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isPassed ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`}
              style={{ width: `${(totalMarks / 10) * 100}%` }}
            />
          </div>
          {exam.examCode && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-slate-500">{t('trainee.finalExam.examCode')}:</span>
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg font-mono text-sm font-semibold">
                {exam.examCode}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Exam Partials */}
      {hasPartials && (
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
          <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              {t('trainee.finalExam.examParts')}
            </h3>
            <Table
              columns={partialsColumns}
              dataSource={exam.partials}
              rowKey="id"
              pagination={false}
              className="modern-table"
              expandable={{
                expandedRowRender: (record) => {
                  // Show checklists for Practical exam
                  if (record.type === 'Practical' && record.checklists && record.checklists.length > 0) {
                    return (
                      <div className="ml-8 my-4">
                        <h4 className="font-semibold text-slate-700 mb-2">{t('trainee.finalExam.checklists')}</h4>
                        <Table
                          columns={checklistColumns}
                          dataSource={record.checklists}
                          rowKey="id"
                          pagination={false}
                          size="small"
                        />
                      </div>
                    );
                  }
                  // Theory partials - show Start button
                  if (record.type === 'Theory') {
                    return (
                      <div className="ml-8 my-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl border border-slate-100">
                        {record.description && (
                          <div className="mb-2">
                            <span className="font-semibold text-slate-600">{t('common.description')}:</span>{' '}
                            <span className="text-slate-500">{record.description}</span>
                          </div>
                        )}
                        {record.completeTime && (
                          <div className="mt-2 text-sm text-slate-500">
                            <span className="font-semibold">{t('trainee.finalExam.completedAt')}:</span>{' '}
                            <DayTimeFormat value={record.completeTime} />
                          </div>
                        )}
                        <div className="mt-4">
                          <Button
                            onClick={() => navigate(`/final-exam/${record.id}`)}
                          // className="px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
                          >
                            {t('trainee.finalExam.startExam')}
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  // Other partials (e.g., Simulation) - view only
                  if (record.quizName || record.practiceName) {
                    return (
                      <div className="ml-8 my-4 p-4 bg-gradient-to-r from-slate-50 to-purple-50/50 rounded-xl border border-slate-100">
                        {record.quizName && (
                          <div className="mb-2">
                            <span className="font-semibold text-slate-600">{t('trainee.finalExam.quiz')}:</span>{' '}
                            <span className="text-slate-500">{record.quizName}</span>
                          </div>
                        )}
                        {record.practiceName && (
                          <div className="mb-2">
                            <span className="font-semibold text-slate-600">{t('trainee.finalExam.practice')}:</span>{' '}
                            <span className="text-slate-500">{record.practiceName}</span>
                          </div>
                        )}
                        {record.description && (
                          <div>
                            <span className="font-semibold text-slate-600">{t('common.description')}:</span>{' '}
                            <span className="text-slate-500">{record.description}</span>
                          </div>
                        )}
                        {record.completeTime && (
                          <div className="mt-2 text-sm text-slate-500">
                            <span className="font-semibold">{t('trainee.finalExam.completedAt')}:</span>{' '}
                            <DayTimeFormat value={record.completeTime} />
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                },
                rowExpandable: (record) =>
                  (record.type === 'Practical' && record.checklists && record.checklists.length > 0) ||
                  record.quizName ||
                  record.practiceName ||
                  record.description,
              }}
            />
          </div>
        </div>
      )}

      {/* Complete Time Info */}
      {exam.completeTime && (
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-700">{t('trainee.finalExam.examCompleted')}</p>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Calendar className="w-4 h-4" />
                  <DayTimeFormat value={exam.completeTime} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
