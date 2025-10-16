import React, { useEffect, useState } from 'react';
import { Card, Table, Skeleton, Empty, Pagination, Alert } from 'antd';
import { getQuizzes } from '../../../apis/Instructor/InstructorApi';

export default function InstructorQuizzes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizzes({ page: p, pageSize: ps });
      setQuizzes(res.items || []);
      setTotal(res.totalCount || 0);
    } catch (e) {
      setError(e?.message || 'Failed to load quizzes');
      setQuizzes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { title: '#', key: 'index', width: 60, render: (_, __, idx) => (page - 1) * pageSize + idx + 1 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Pass %', dataIndex: 'passScoreCriteria', key: 'passScoreCriteria', width: 120 },
    { title: 'Time (min)', dataIndex: 'timelimitMinute', key: 'timelimitMinute', width: 120 },
    { title: 'Total Score', dataIndex: 'totalScore', key: 'totalScore', width: 120 },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
  ];

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Alert type="error" message="Error" description={error} />
    </div>
  );

  if (!quizzes || quizzes.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Card title="Quizzes">
        <Empty description="No quizzes found." />
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      
      <Card title="Quizzes">
        <div style={{ height: 420 }} className="overflow-auto">
          <Table columns={columns} dataSource={quizzes} rowKey="id" pagination={false} size="middle" />
        </div>
        <div className="pt-4 border-t border-gray-200 flex justify-center">
          <Pagination current={page} pageSize={pageSize} total={total} showSizeChanger pageSizeOptions={["10","20","50"]}
            onChange={(p, ps) => { setPage(p); setPageSize(ps); load(p, ps); }} showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} quizzes`} />
        </div>
      </Card>
    </div>
  );
}
