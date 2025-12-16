import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Alert, Skeleton } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getActivityRecords } from '../../../../../../apis/Instructor/InstructorApi';
import DayTimeFormat from '../../../../../../components/DayTimeFormat/DayTimeFormat';

const { Title } = Typography;

const TraineeActivityRecords = ({ classId, sectionId, activityId }) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    </div>
  );
};

export default TraineeActivityRecords;