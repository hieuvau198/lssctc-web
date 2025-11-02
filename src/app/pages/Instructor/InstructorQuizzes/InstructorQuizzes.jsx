import React, { useEffect, useState } from 'react';
import { Card, Table, Skeleton, Empty, Pagination, Alert, Button, Tooltip, message, Popconfirm } from 'antd';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getQuizzes, deleteQuiz } from '../../../apis/Instructor/InstructorQuiz';
import QuizFilters from './partials/QuizFilters';

export default function InstructorQuizzes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
    // TODO: Implement backend search when API supports it
    load(1, pageSize);
  };

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
    { title: 'Pass (pts)', dataIndex: 'passScoreCriteria', key: 'passScoreCriteria', width: 100, align: 'center' },
    { title: 'Time (min)', dataIndex: 'timelimitMinute', key: 'timelimitMinute', width: 120, align: 'center' },
    { title: 'Total Score (pts)', dataIndex: 'totalScore', key: 'totalScore', width: 120, align: 'center' },
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
              icon={<Eye className="w-4 h-4" />}
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
              icon={<Pencil className="w-4 h-4" />}
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
                icon={<Trash2 className="w-4 h-4" />}
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
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton.Button style={{ width: 200, height: 32 }} active />
      </div>

      {/* Search Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Skeleton.Input style={{ width: 320, height: 40 }} active />
      </div>

      {/* Content Skeleton */}
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">Quizzes</span>
      </div>
      <Alert type="error" message="Error" description={error} />
    </div>
  );

  if (!quizzes || quizzes.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">Quizzes</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <QuizFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
        />
      </div>

      <Card title="Quizzes">
        <Empty description="No quizzes found." />
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">Quizzes</span>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <QuizFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
        />
      </div>

      {/* Content */}
      <Card title="Quizzes">
        <div className="overflow-auto h-[350px]">
          <Table
            columns={columns}
            dataSource={quizzes}
            rowKey="id"
            pagination={false}
            size="middle"
            // scroll={{ y: 560 }}
          />
        </div>
        <div className="pt-4 border-t border-gray-200 flex justify-center">
          <Pagination current={page} pageSize={pageSize} total={total} showSizeChanger pageSizeOptions={["10", "20", "50"]}
            onChange={(p, ps) => { setPage(p); setPageSize(ps); load(p, ps); }} showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} quizzes`} />
        </div>
      </Card>
    </div>
  );
}
