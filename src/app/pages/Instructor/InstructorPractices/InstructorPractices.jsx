import React, { useEffect, useState } from 'react';
import { Card, Table, Empty, Skeleton, Pagination, Tooltip, Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { getPractices } from '../../../apis/Instructor/InstructorPractice';

export default function InstructorPractices() {
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const res = await getPractices({ page: p, pageSize: ps });
      setPractices(res.items || []);
      setTotal(res.totalCount || 0);
    } catch (e) {
      console.error('Failed to load practices', e);
      message.error('Failed to load practices');
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { title: '#', key: 'idx', width: 60, render: (_, __, idx) => (page - 1) * pageSize + idx + 1 },
    { title: 'Practice Name', dataIndex: 'practiceName', key: 'practiceName', ellipsis: true },
    { title: 'Duration (min)', dataIndex: 'estimatedDurationMinutes', key: 'duration', width: 140, align: 'center' },
    { title: 'Difficulty', dataIndex: 'difficultyLevel', key: 'difficulty', width: 120, align: 'center' },
    { title: 'Max Attempts', dataIndex: 'maxAttempts', key: 'maxAttempts', width: 120, align: 'center' },
    {
      title: 'Actions', key: 'actions', width: 100, fixed: 'right', render: (_, record) => (
        <div className="flex justify-center">
          <Tooltip title="View">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => message.info(`View practice ${record.practiceName}`)} />
          </Tooltip>
        </div>
      )
    }
  ];

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </div>
  );

  if (!practices || practices.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card title="Practices">
        <Empty description="No practices found." />
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card title="Practices">
        <div style={{ height: 420 }} className="overflow-auto">
          <Table columns={columns} dataSource={practices} rowKey="id" pagination={false} size="middle" />
        </div>
        <div className="pt-4 border-t border-gray-200 flex justify-center">
          <Pagination current={page} pageSize={pageSize} total={total} showSizeChanger pageSizeOptions={["10","20","50"]}
            onChange={(p, ps) => { setPage(p); setPageSize(ps); load(p, ps); }} showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} practices`} />
        </div>
      </Card>
    </div>
  );
}
