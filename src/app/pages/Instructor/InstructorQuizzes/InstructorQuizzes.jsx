import React, { useEffect, useState } from 'react';
import { Table, Skeleton, Pagination, Alert, Button, Tooltip, Popconfirm, Space, Tag, App } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getQuizzes, deleteQuiz, getQuizDetail } from '../../../apis/Instructor/InstructorQuiz';
import QuizFilters from './partials/QuizFilters';
import ImportQuizModal from './partials/ImportQuizModal';
import CreateQuizDrawer from './partials/CreateQuizDrawer';
import { FileSpreadsheet } from 'lucide-react';

export default function InstructorQuizzes() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { t } = useTranslation();
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
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingQuizData, setEditingQuizData] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getQuizzes({ pageIndex: p, pageSize: ps });
      setQuizzes(res.items || []);
      setTotal(res.totalCount || 0);
    } catch (e) {
      setError(e?.message || t('instructor.quizzes.messages.loadFailed'));
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

  const handleEdit = async (record) => {
    try {
      const data = await getQuizDetail(record.id);
      setEditingQuizData(data || null);
      setEditingQuizId(record.id);
      setEditDrawerVisible(true);
    } catch (e) {
      console.error('Failed to load quiz for edit:', e);
      message.error(t('instructor.quizzes.messages.loadQuizFailed'));
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteQuiz(record.id);
      message.success(t('instructor.quizzes.messages.deleteSuccess', { name: record.name }));
      load(); // Reload list
    } catch (e) {
      console.error('Failed to delete quiz:', e);
      message.error(e?.message || t('instructor.quizzes.messages.deleteFailed'));
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
      title: t('instructor.quizzes.table.index'),
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (page - 1) * pageSize + idx + 1,
      fixed: 'left',
    },
    {
      title: t('instructor.quizzes.table.name'),
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
      title: t('instructor.quizzes.table.timeMinutes'),
      dataIndex: 'timelimitMinute',
      key: 'timelimitMinute',
      width: 120,
      align: 'center',
      render: (v) => <span>{v}</span>
    },
    {
      title: t('instructor.quizzes.table.passScore'),
      dataIndex: 'passScoreCriteria',
      key: 'passScoreCriteria',
      width: 120,
      align: 'center',
      render: (v) => <Tag color="blue">{v} {t('instructor.quizzes.detail.pts')}</Tag>
    },
    {
      title: t('instructor.quizzes.table.totalScore'),
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 120,
      align: 'center',
      render: (v) => <span>{v} {t('instructor.quizzes.detail.pts')}</span>
    },
    {
      title: t('instructor.quizzes.table.actions'),
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('instructor.quizzes.tooltip.viewDetails')}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title={t('instructor.quizzes.tooltip.editQuiz')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t('instructor.quizzes.tooltip.deleteQuiz')}>
            <Popconfirm
              title={t('instructor.quizzes.deleteConfirm.title')}
              description={t('instructor.quizzes.deleteConfirm.description', { name: record.name })}
              onConfirm={() => handleDelete(record)}
              okText={t('instructor.quizzes.deleteConfirm.yes')}
              cancelText={t('instructor.quizzes.deleteConfirm.no')}
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
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-6">
        <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-white/20" />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Alert type="error" message={t('common.error')} description={error} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{t('instructor.quizzes.title')}</span>
              <p className="text-blue-100 text-sm mt-1">
                {t('instructor.quizzes.table.pagination', { start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, total), total })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="large"
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
              icon={<FileSpreadsheet className="w-5 h-5" />}
              onClick={() => setImportModalVisible(true)}
            >
              {t('instructor.quizzes.importExcel')}
            </Button>
            <Button
              size="large"
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
              icon={<PlusOutlined />}
              onClick={() => setCreateDrawerVisible(true)}
            >
              {t('instructor.quizzes.createQuiz')}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-md p-4 mb-4">
        <QuizFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-hidden min-h-[360px]">
          <Table
            columns={columns}
            dataSource={quizzes}
            rowKey="id"
            pagination={false}
            scroll={{ y: 360 }}
            size="middle"
            locale={{
              emptyText: (
                <div className="py-12">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {t('instructor.quizzes.noQuestions')}
                    </h3>
                    <p className="text-gray-500 mb-4">{t('instructor.quizzes.createQuiz')}</p>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setCreateDrawerVisible(true)}
                    >
                      {t('instructor.quizzes.createQuiz')}
                    </Button>
                  </div>
                </div>
              )
            }}
          />
        </div>

        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 flex justify-center">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p, ps) => { setPage(p); setPageSize(ps); load(p, ps); }}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            showTotal={(total, r) => t('instructor.quizzes.table.pagination', { start: r[0], end: r[1], total })}
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

      <CreateQuizDrawer
        open={editDrawerVisible}
        onClose={() => { setEditDrawerVisible(false); setEditingQuizData(null); setEditingQuizId(null); }}
        onSuccess={() => { setEditDrawerVisible(false); setEditingQuizData(null); setEditingQuizId(null); load(1, pageSize); }}
        mode="edit"
        quizId={editingQuizId}
        initialData={editingQuizData}
      />
    </div>
  );
}
