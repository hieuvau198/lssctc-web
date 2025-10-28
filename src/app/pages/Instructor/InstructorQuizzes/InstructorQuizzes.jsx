import React, { useEffect, useState } from 'react';
import { Card, Table, Skeleton, Empty, Pagination, Alert, Button, Tooltip, message, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { getQuizzes, deleteQuiz } from '../../../apis/Instructor/InstructorQuiz';

export default function InstructorQuizzes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizzes({ pageIndex: p, pageSize: ps });
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

  const handleView = (record) => {
    navigate(`/instructor/quizzes/${record.id}`);
  };

  const handleEdit = (record) => {
    navigate(`/instructor/quizzes/${record.id}/edit`);
  };

  const handleDelete = async (record) => {
    try {
      await deleteQuiz(record.id);
      message.success(`Quiz "${record.name}" deleted successfully`);
      load(); // Reload list
    } catch (e) {
      console.error('Failed to delete quiz:', e);
      message.error(e?.message || 'Failed to delete quiz');
    }
  };

  const columns = [
    { title: '#', key: 'index', width: 60, render: (_, __, idx) => (page - 1) * pageSize + idx + 1 },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Pass %', dataIndex: 'passScoreCriteria', key: 'passScoreCriteria', width: 100, align: 'center' },
    { title: 'Time (min)', dataIndex: 'timelimitMinute', key: 'timelimitMinute', width: 120, align: 'center' },
    { title: 'Total Score', dataIndex: 'totalScore', key: 'totalScore', width: 120, align: 'center' },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex justify-center gap-1">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleView(record);
              }}
              className="hover:bg-blue-50 hover:text-blue-600"
            />
          </Tooltip>
          <Tooltip title="Edit Quiz">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
              className="hover:bg-yellow-50 hover:text-yellow-600"
            />
          </Tooltip>
          <Tooltip title="Delete Quiz">
            <Popconfirm
              title="Delete Quiz"
              description={`Are you sure you want to delete "${record.name}"?`}
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(record);
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
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
