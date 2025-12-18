// src/app/pages/Instructor/InstructorClasses/partials/Sections/ActivityDetail/TraineeActivityRecords.jsx

import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Alert, Skeleton, Button, Tooltip, Modal } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
// --- FIX: Imported getQuizAttemptsForInstructor ---
import { 
    getActivityRecords, 
    getPracticeAttemptsForInstructor, 
    getQuizAttemptsForInstructor 
} from '../../../../../../apis/Instructor/InstructorApi';
import DayTimeFormat from '../../../../../../components/DayTimeFormat/DayTimeFormat';
import { History, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, Trophy } from 'lucide-react';
import dayjs from 'dayjs';

const { Title } = Typography;

// --- Helper Component for Practice History ---
const AttemptsHistoryList = ({ attempts = [] }) => {
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState(null);

    if (!attempts || attempts.length === 0) {
        return <div className="p-4 text-center text-gray-500">{t('common.noData', 'No attempts found.')}</div>;
    }

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="bg-white border-2 border-black mt-6">
            <div className="px-4 py-3 bg-neutral-100 border-b-2 border-black flex items-center justify-between">
                <h3 className="font-black text-black uppercase flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {t('trainee.practice.history', 'Practice History')} ({attempts.length})
                </h3>
            </div>
            
            <div className="divide-y-2 divide-neutral-200">
                {attempts.map((attempt, index) => (
                    <div key={attempt.id} className="bg-white">
                        <div 
                            onClick={() => toggleExpand(attempt.id)}
                            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-yellow-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 ${attempt.isPass ? 'bg-green-400' : 'bg-red-400'}`}>
                                    <span className="font-black text-sm">#{attempts.length - index}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">
                                            {dayjs(attempt.attemptDate).format('DD/MM/YYYY HH:mm')}
                                        </span>
                                        {attempt.isCurrent && (
                                            <span className="px-2 py-0.5 bg-yellow-400 border border-black text-xs font-bold uppercase">
                                                {t('common.latest', 'Latest')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> 
                                            Score: <span className="font-bold text-black">{attempt.score ?? 0}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> 
                                            Mistakes: <span className="font-bold text-black">{attempt.totalMistakes ?? 0}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-4">
                                <div className={`px-4 py-1 border-2 border-black font-bold uppercase text-sm ${attempt.isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {attempt.isPass ? 'Passed' : 'Failed'}
                                </div>
                                {expandedId === attempt.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </div>
                        {expandedId === attempt.id && (
                            <div className="border-t-2 border-neutral-200 bg-neutral-50 p-4">
                                <h4 className="text-xs font-bold uppercase text-neutral-500 mb-3 ml-1">Task Breakdown</h4>
                                <div className="grid gap-2">
                                    {attempt.practiceAttemptTasks?.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-3 bg-white border border-neutral-300 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                {task.isPass 
                                                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    : <XCircle className="w-5 h-5 text-red-600" />
                                                }
                                                <span className={`${task.isPass ? 'text-black' : 'text-neutral-500'}`}>
                                                    {task.taskCode || `Task #${task.taskId}`}
                                                </span>
                                            </div>
                                            <div className="text-sm font-mono">
                                                <span className="text-neutral-500">Mistakes:</span> <b>{task.mistakes ?? 0}</b>
                                                <span className="mx-2 text-neutral-300">|</span>
                                                <span className="text-neutral-500">Score:</span> <b>{task.score}</b>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- FIX: Added QuizAttemptsHistoryList Component ---
const QuizAttemptsHistoryList = ({ attempts = [] }) => {
    const { t } = useTranslation();

    if (!attempts || attempts.length === 0) {
        return <div className="p-4 text-center text-gray-500">{t('common.noData', 'No attempts found.')}</div>;
    }

    return (
        <div className="bg-white border-2 border-black mt-6">
            <div className="px-4 py-3 bg-neutral-100 border-b-2 border-black flex items-center justify-between">
                <h3 className="font-black text-black uppercase flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {t('trainee.quiz.history', 'Quiz History')} ({attempts.length})
                </h3>
            </div>
            
            <div className="divide-y-2 divide-neutral-200">
                {attempts.map((attempt, index) => (
                    <div key={attempt.id} className="bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-yellow-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0 ${attempt.isPass ? 'bg-green-400' : 'bg-red-400'}`}>
                                <span className="font-black text-sm">#{attempts.length - index}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">
                                        {dayjs(attempt.quizAttemptDate || attempt.attemptDate).format('DD/MM/YYYY HH:mm')}
                                    </span>
                                    {attempt.isCurrent && (
                                        <span className="px-2 py-0.5 bg-yellow-400 border border-black text-xs font-bold uppercase">
                                            {t('common.latest', 'Latest')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Trophy className="w-3 h-3" /> 
                                        Score: <span className="font-bold text-black">{attempt.attemptScore} / {attempt.maxScore || attempt.totalScore}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4">
                            <div className={`px-4 py-1 border-2 border-black font-bold uppercase text-sm ${attempt.isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {attempt.isPass ? 'Passed' : 'Failed'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- FIX: Added activityType to props ---
const TraineeActivityRecords = ({ classId, sectionId, activityId, activityType }) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!classId || !sectionId || !activityId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getActivityRecords(classId, sectionId, activityId);
        setRecords(data || []);
      } catch (err) {
        setError(err.message || t('instructor.classes.activityDetail.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [classId, sectionId, activityId]);

  const handleViewHistory = async (record) => {
    setSelectedTrainee(record.traineeName);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    setHistoryData([]);

    try {
        let data = [];
        // --- FIX: Logic to switch between Quiz and Practice APIs ---
        if (activityType === 'Quiz') {
            console.log("Fetching QUIZ history for", record.traineeName);
            data = await getQuizAttemptsForInstructor(record.traineeId, record.id);
        } else {
            console.log("Fetching PRACTICE history for", record.traineeName);
            data = await getPracticeAttemptsForInstructor(record.traineeId, record.id);
        }
        setHistoryData(data || []);
    } catch (err) {
        console.error("Failed to load history:", err);
    } finally {
        setHistoryLoading(false);
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    {
      title: t('instructor.classes.activityDetail.trainee'),
      dataIndex: 'traineeName',
      key: 'traineeName',
      sorter: (a, b) => a.traineeName.localeCompare(b.traineeName),
    },
    {
      title: t('instructor.classes.activityDetail.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const isCompleted = status === 'Completed';
        return (
          <Tag
            color={isCompleted ? 'success' : 'processing'}
            icon={isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          >
            {isCompleted
              ? t('instructor.classes.activityDetail.statusCompleted')
              : t('instructor.classes.activityDetail.statusInProgress')}
          </Tag>
        );
      },
    },
    {
      title: t('instructor.classes.activityDetail.score'),
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
      render: (score) => (score !== null && score !== undefined ? score : t('common.na')),
    },
    {
      title: t('instructor.classes.activityDetail.completedDate'),
      dataIndex: 'completedDate',
      key: 'completedDate',
      sorter: (a, b) => new Date(a.completedDate || 0) - new Date(b.completedDate || 0),
      render: (date) => {
        if (!date) return t('common.na');
        return <DayTimeFormat value={date} />;
      },
    },
    {
        title: t('common.actions', 'Actions'),
        key: 'actions',
        align: 'center',
        render: (_, record) => (
            <Tooltip title={t('instructor.classes.activityDetail.viewHistory', 'View History')}>
                <Button 
                    type="default"
                    icon={<HistoryOutlined />} 
                    onClick={() => handleViewHistory(record)}
                />
            </Tooltip>
        )
    }
  ];

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} className="mt-6" />;
  }

  if (error) {
    return (
      <Alert
        message={t('common.error')}
        description={error}
        type="error"
        showIcon
        className="mt-6"
      />
    );
  }

  return (
    <div className="mt-6">
      <Title level={4}>{t('instructor.classes.activityDetail.traineeProgress')}</Title>
      <Table
        dataSource={records}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title={`${t('common.history', 'History')}: ${selectedTrainee}`}
        open={historyModalOpen}
        onCancel={() => setHistoryModalOpen(false)}
        footer={[
            <Button key="close" onClick={() => setHistoryModalOpen(false)}>
                {t('common.close', 'Close')}
            </Button>
        ]}
        width={700}
      >
        {historyLoading ? (
            <Skeleton active />
        ) : (
            // --- FIX: Switch between Quiz and Practice History UI ---
            activityType === 'Quiz' ? (
                <QuizAttemptsHistoryList attempts={historyData} />
            ) : (
                <AttemptsHistoryList attempts={historyData} />
            )
        )}
      </Modal>
    </div>
  );
};

export default TraineeActivityRecords;