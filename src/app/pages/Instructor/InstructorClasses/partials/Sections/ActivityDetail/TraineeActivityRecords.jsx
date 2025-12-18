import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Alert, Skeleton, Button, Modal, Tooltip, Collapse, Empty } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  HistoryOutlined, 
  CloseCircleOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getActivityRecords, getPracticeAttemptsForInstructor } from '../../../../../../apis/Instructor/InstructorApi'; // Import new API
import DayTimeFormat from '../../../../../../components/DayTimeFormat/DayTimeFormat';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const TraineeActivityRecords = ({ classId, sectionId, activityId }) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- New State for History Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState('');

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

  // --- Handler to Open History Modal ---
  const handleViewHistory = async (record) => {
    setSelectedTrainee(record.traineeName);
    setIsModalOpen(true);
    setHistoryLoading(true);
    setHistoryData([]);

    try {
        // record.traineeId and record.id (activityRecordId) are needed. 
        // Ensure your API response for getActivityRecords returns these fields.
        // Assuming record.id is the ActivityRecordId based on typical API structure.
        const data = await getPracticeAttemptsForInstructor(record.traineeId, record.id);
        setHistoryData(data || []);
    } catch (err) {
        console.error("Failed to load history", err);
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
    // --- New Actions Column ---
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Tooltip title={t('instructor.classes.activityDetail.viewHistory', 'View Attempt History')}>
          <Button 
            type="default" 
            shape="circle" 
            icon={<HistoryOutlined />} 
            onClick={() => handleViewHistory(record)} 
          />
        </Tooltip>
      ),
    },
  ];

  // --- Task Table Columns (Nested in History) ---
  const taskColumns = [
    {
      title: t('common.task', 'Task'),
      dataIndex: 'taskCode',
      key: 'taskCode',
      render: (code, item) => (
        <span className={item.isPass ? 'text-green-600' : 'text-red-600'}>
            {code || `Task #${item.taskId}`}
        </span>
      )
    },
    {
      title: t('common.score', 'Score'),
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      render: (score) => <b>{score}</b>
    },
    {
      title: t('common.mistakes', 'Mistakes'),
      dataIndex: 'mistakes',
      key: 'mistakes',
      align: 'center',
      render: (mistakes) => mistakes ?? 0
    },
    {
      title: t('common.result', 'Result'),
      key: 'result',
      align: 'center',
      render: (_, item) => (
        item.isPass 
          ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
          : <CloseCircleOutlined style={{ color: '#f5222d', fontSize: '16px' }} />
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

      {/* --- History Modal --- */}
      <Modal
        title={
          <span>
            <HistoryOutlined className="mr-2" />
            {t('instructor.classes.activityDetail.historyTitle', 'Attempt History')} - <span className="text-blue-600">{selectedTrainee}</span>
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            {t('common.close', 'Close')}
          </Button>
        ]}
        width={700}
      >
        {historyLoading ? (
          <Skeleton active />
        ) : historyData.length === 0 ? (
          <Empty description={t('common.noData', 'No attempts found')} />
        ) : (
          <Collapse accordion className="bg-transparent" defaultActiveKey={[historyData[0]?.id]}>
            {historyData.map((attempt, index) => (
              <Panel 
                header={
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center gap-2">
                       <Tag color="blue">#{historyData.length - index}</Tag>
                       <span className="font-semibold"><DayTimeFormat value={attempt.attemptDate} /></span>
                       {attempt.isCurrent && <Tag color="gold">{t('common.latest', 'Latest')}</Tag>}
                    </div>
                    <div className="flex items-center gap-3">
                       <Text type="secondary" className="text-xs">
                          {t('common.mistakes', 'Mistakes')}: <b>{attempt.totalMistakes ?? 0}</b>
                       </Text>
                       <Tag color={attempt.isPass ? 'success' : 'error'}>
                          {attempt.isPass ? t('common.passed', 'Passed') : t('common.failed', 'Failed')}
                       </Tag>
                       <Text strong className="text-lg" style={{ minWidth: '40px', textAlign: 'right' }}>
                          {attempt.score}
                       </Text>
                    </div>
                  </div>
                } 
                key={attempt.id}
              >
                <Table 
                    dataSource={attempt.practiceAttemptTasks || []}
                    columns={taskColumns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    bordered
                />
              </Panel>
            ))}
          </Collapse>
        )}
      </Modal>
    </div>
  );
};

export default TraineeActivityRecords;