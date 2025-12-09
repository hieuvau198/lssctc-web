import { Alert, Button, Card, Empty, Skeleton, Tag, Descriptions, Table, Progress } from 'antd';
import { Award, Calendar, Clock, FileText, CheckCircle, XCircle, BookOpen, Cpu, Wrench } from 'lucide-react';
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
      <Card className="rounded-xl shadow-lg">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl shadow-lg">
        <Alert
          type="warning"
          message={t('trainee.finalExam.noExam')}
          description={error}
          showIcon
        />
      </Card>
    );
  }

  if (!exam) {
    return (
      <Card className="rounded-xl shadow-lg p-12 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('trainee.finalExam.noExamAvailable')}
          className="py-8"
        />
      </Card>
    );
  }

  const isPassed = exam.isPass;
  const hasPartials = exam.partials && exam.partials.length > 0;
  const totalMarks = exam.totalMarks || 0;

  // Get type icon
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

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Approved':
        return { color: 'success', text: t('trainee.finalExam.statusApproved') };
      case 'Rejected':
        return { color: 'error', text: t('trainee.finalExam.statusRejected') };
      case 'Pending':
        return { color: 'warning', text: t('trainee.finalExam.statusPending') };
      case 'NotYet':
        return { color: 'default', text: t('trainee.finalExam.statusNotYet') };
      default:
        return { color: 'default', text: status };
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
          <span className="font-medium">{type}</span>
        </div>
      ),
    },
    {
      title: t('trainee.finalExam.duration'),
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} ${t('common.minutes')}`,
    },
    {
      title: t('trainee.finalExam.marks'),
      dataIndex: 'marks',
      key: 'marks',
      render: (marks, record) => (
        <span className={`font-bold ${record.isPass ? 'text-green-600' : 'text-red-600'}`}>
          {marks.toFixed(2)} / {record.examWeight.toFixed(2)}
        </span>
      ),
    },
    {
      title: t('trainee.finalExam.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const statusInfo = getStatusInfo(status);
        return (
          <Tag
            color={statusInfo.color}
          >
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: t('trainee.finalExam.timeRange'),
      key: 'timeRange',
      render: (_, record) => (
        <div className="text-xs">
          <div><DayTimeFormat value={record.startTime} /></div>
          <div className="text-gray-500">→</div>
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
            size="small"
            onClick={() => navigate(`/final-exam/${record.id}`)}
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
    },
    {
      title: t('trainee.finalExam.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('trainee.finalExam.result'),
      dataIndex: 'isPass',
      key: 'isPass',
      render: (isPass) => (
        <Tag
          color={isPass ? 'success' : 'error'}
          icon={isPass ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        >
          {isPass ? t('trainee.finalExam.passed') : t('trainee.finalExam.failed')}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-xl shadow-lg border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold m-0">{t('trainee.finalExam.title')}</h2>
                <p className="text-indigo-100 mt-1 text-sm">
                  {exam.traineeName} - {exam.traineeCode}
                </p>
              </div>
            </div>
            <Tag
              icon={isPassed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              color={isPassed ? 'success' : 'error'}
              className="text-base px-4 py-1"
            >
              {isPassed ? t('trainee.finalExam.passed') : t('trainee.finalExam.failed')}
            </Tag>
          </div>
        </div>

        {/* Overall Score */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t('trainee.finalExam.overallScore')}</h3>
            <span className={`text-4xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {totalMarks.toFixed(2)} / 10
            </span>
          </div>
          <Progress
            percent={(totalMarks / 10) * 100}
            status={isPassed ? 'success' : 'exception'}
            strokeColor={isPassed ? '#10b981' : '#ef4444'}
            strokeWidth={12}
            className="mb-2"
          />
          {exam.examCode && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('trainee.finalExam.examCode')}:</span>
              <Tag color="blue" className="font-mono">
                {exam.examCode}
              </Tag>
            </div>
          )}
        </div>
      </Card>

      {/* Exam Partials */}
      {hasPartials && (
        <Card className="rounded-xl shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('trainee.finalExam.examParts')}
            </h3>
            <Table
              columns={partialsColumns}
              dataSource={exam.partials}
              rowKey="id"
              pagination={false}
              expandable={{
                expandedRowRender: (record) => {
                  // Show checklists for Practical exam
                  if (record.type === 'Practical' && record.checklists && record.checklists.length > 0) {
                    return (
                      <div className="ml-8 my-4">
                        <h4 className="font-semibold mb-2">{t('trainee.finalExam.checklists')}</h4>
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
                  // Show quiz/practice info
                  // - Practical handled above (checklists)
                  // - For Theory partials show Start button (take quiz)
                  if (record.type === 'Theory') {
                    return (
                      <div className="ml-8 my-4 p-4 bg-gray-50 rounded-lg">
                        {record.description && (
                          <div className="mb-2">
                            <span className="font-semibold">{t('common.description')}:</span> {record.description}
                          </div>
                        )}
                        {record.completeTime && (
                          <div className="mt-2">
                            <span className="font-semibold">{t('trainee.finalExam.completedAt')}:</span> <DayTimeFormat value={record.completeTime} />
                          </div>
                        )}

                        <div className="mt-4">
                          <Button
                            type="primary"
                            size="middle"
                            onClick={() => navigate(`/final-exam/${record.id}`)}
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
                      <div className="ml-8 my-4 p-4 bg-gray-50 rounded-lg">
                        {record.quizName && (
                          <div className="mb-2">
                            <span className="font-semibold">{t('trainee.finalExam.quiz')}:</span> {record.quizName}
                          </div>
                        )}
                        {record.practiceName && (
                          <div className="mb-2">
                            <span className="font-semibold">{t('trainee.finalExam.practice')}:</span> {record.practiceName}
                          </div>
                        )}
                        {record.description && (
                          <div>
                            <span className="font-semibold">{t('common.description')}:</span> {record.description}
                          </div>
                        )}
                        {record.completeTime && (
                          <div className="mt-2">
                            <span className="font-semibold">{t('trainee.finalExam.completedAt')}:</span> <DayTimeFormat value={record.completeTime} />
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
        </Card>
      )}

      {/* Complete Time Info */}
      {exam.completeTime && (
        <Card className="rounded-xl shadow-lg">
          <div className="p-6">
            <Alert
              type="info"
              message={t('trainee.finalExam.examCompleted')}
              description={
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <DayTimeFormat value={exam.completeTime} />
                </div>
              }
              showIcon
            />
          </div>
        </Card>
      )}
    </div>
  );
}
