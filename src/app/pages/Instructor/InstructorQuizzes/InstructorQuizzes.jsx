import React, { useEffect, useState } from 'react';
import { Table, Skeleton, Pagination, Alert, Button, Tooltip, Popconfirm, Space, Tag, App } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { getQuizzes, deleteQuiz } from '../../../apis/Instructor/InstructorQuiz';
import QuizFilters from './partials/QuizFilters';
import ImportQuizModal from './partials/ImportQuizModal';
import CreateQuizDrawer from './partials/CreateQuizDrawer';

export default function InstructorQuizzes() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);

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

  const handleImportSuccess = () => {
    setImportModalVisible(false);
    load(1, pageSize);
  };

  const handleCreateSuccess = () => {
    setCreateDrawerVisible(false);
    load(1, pageSize);
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (page - 1) * pageSize + idx + 1,
      fixed: 'left',
    },
    {
      title: 'Quiz Code',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <span className="text-gray-500">Q-{id}</span>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (text, record) => (
        <div
          className="font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => handleView(record)}
        >
          {text}
        </div>
      )
    },
    {
      title: 'Time (min)',
      dataIndex: 'timelimitMinute',
      key: 'timelimitMinute',
      width: 120,
      align: 'center',
      render: (v) => <span>{v}</span>
    },
    {
      title: 'Pass Score',
      dataIndex: 'passScoreCriteria',
      key: 'passScoreCriteria',
      width: 120,
      align: 'center',
      render: (v) => <Tag color="blue">{v} pts</Tag>
    },
    {
      title: 'Total Score',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 120,
      align: 'center',
      render: (v) => <span>{v} pts</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Quiz">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Quiz">
            <Popconfirm
              title="Delete Quiz"
              description={`Are you sure you want to delete "${record.name}"?`}
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton.Button style={{ width: 100, height: 32 }} active />
        <div className="flex gap-2">
          <Skeleton.Button style={{ width: 120, height: 32 }} active />
          <Skeleton.Button style={{ width: 120, height: 32 }} active />
        </div>
      </div>
      <div className="mb-4">
        <Skeleton.Input style={{ width: 320, height: 40 }} active />
      </div>
      <div className="rounded-lg shadow overflow-hidden bg-white">
        <Skeleton active paragraph={{ rows: 8 }} className="p-4" />
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Alert type="error" message="Error" description={error} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-semibold">Quizzes</span>
      </div>

      {/* Search */}
      <div className=" flex items-center justify-between mb-4">
        <QuizFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
        />
        <div className="flex items-center gap-2">
          <Button
            icon={<UploadOutlined />}
            onClick={() => setImportModalVisible(true)}
          >
            Import Excel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateDrawerVisible(true)}
          >
            Create Quiz
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow overflow-hidden">
        <div className="overflow-hidden min-h-[450px]">
          <Table
            columns={columns}
            dataSource={quizzes}
            rowKey="id"
            pagination={false}
            scroll={{ y: 450 }}
            size="middle"
          />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p, ps) => { setPage(p); setPageSize(ps); load(p, ps); }}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} quizzes`}
          />
        </div>
      </div>

      <ImportQuizModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onSuccess={handleImportSuccess}
      />

      <CreateQuizDrawer
        open={createDrawerVisible}
        onClose={() => setCreateDrawerVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
