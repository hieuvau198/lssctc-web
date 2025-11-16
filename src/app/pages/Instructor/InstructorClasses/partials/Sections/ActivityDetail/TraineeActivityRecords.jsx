import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Alert, Skeleton } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getActivityRecords } from '../../../../../../apis/Instructor/InstructorApi'; // Adjust path as needed
import DayTimeFormat from '../../../../../../components/DayTimeFormat/DayTimeFormat';

const { Title } = Typography;

const TraineeActivityRecords = ({ classId, sectionId, activityId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      // --- ADDED FOR DEBUGGING ---
      console.log('TraineeActivityRecords Props:', {
        classId: classId,
        sectionId: sectionId,
        activityId: activityId,
      });
      // --- END OF DEBUGGING ---

      if (!classId || !sectionId || !activityId) {
        setError('Missing required IDs to fetch records.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getActivityRecords(classId, sectionId, activityId);
        setRecords(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load trainee records.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [classId, sectionId, activityId]);

  const columns = [
    // ... (columns - no changes)
    {
      title: 'Trainee',
      dataIndex: 'traineeName',
      key: 'traineeName',
      sorter: (a, b) => a.traineeName.localeCompare(b.traineeName),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'Completed' ? 'success' : 'processing'}
          icon={status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
      render: (score) => score ?? 'N/A',
    },
    {
      title: 'Completed Date',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: (date) => (date ? <DayTimeFormat date={date} /> : 'N/A'),
      sorter: (a, b) => new Date(a.completedDate) - new Date(b.completedDate),
    },
  ];

  if (loading) {
    // ... (no changes)
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="mt-6">
      <Title level={4}>Trainee Progress</Title>
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