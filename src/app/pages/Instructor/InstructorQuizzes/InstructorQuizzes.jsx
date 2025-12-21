import React, { useEffect, useState } from 'react';
import { Table, Skeleton, Pagination, Tooltip, Popconfirm, App, Tag } from 'antd';
import { Eye, Pencil, Trash2, FileSpreadsheet, Plus, HelpCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getQuizzes, deleteQuiz, getQuizDetail } from '../../../apis/Instructor/InstructorQuiz';
import QuizFilters from './partials/QuizFilters';
import ImportQuizModal from './partials/ImportQuizModal';
import CreateQuizDrawer from './partials/CreateQuizDrawer';

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
      load();
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
      title: '#',
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (
        <span className="font-bold text-neutral-500">
          {(page - 1) * pageSize + idx + 1}
        </span>
      ),
      fixed: 'left',
    },
    {
      title: t('instructor.quizzes.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (text, record) => (
        <div
          className="font-bold text-black cursor-pointer hover:text-yellow-600 transition-colors"
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
      render: (v) => <span className="font-medium">{v}</span>
    },
    {
      title: t('instructor.quizzes.table.passScore'),
      dataIndex: 'passScoreCriteria',
      key: 'passScoreCriteria',
      width: 120,
      align: 'center',
      render: (v) => (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs font-bold">
          {v} {t('instructor.quizzes.detail.pts')}
        </span>
      )
    },
    {
      title: t('instructor.quizzes.table.totalScore'),
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 120,
      align: 'center',
      render: (v) => <span className="font-bold">{v} {t('instructor.quizzes.detail.pts')}</span>
    },
    {
      title: t('instructor.quizzes.table.actions'),
      key: 'actions',
      width: 140,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title={t('instructor.quizzes.tooltip.viewDetails')}>
            <button
              onClick={() => handleView(record)}
              className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Eye className="w-4 h-4 text-yellow-400" />
            </button>
          </Tooltip>
          <Tooltip title={t('instructor.quizzes.tooltip.editQuiz')}>
            <button
              onClick={() => handleEdit(record)}
              className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 hover:scale-105 transition-all"
            >
              <Pencil className="w-4 h-4 text-black" />
            </button>
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
              <button className="w-8 h-8 bg-red-500 border-2 border-red-600 flex items-center justify-center hover:bg-red-600 hover:scale-105 transition-all">
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Loading State
  if (loading) return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-black border-2 border-black p-6 mb-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
        <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-neutral-800" />
      </div>
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  );

  // Error State
  if (error) return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-4" />
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <span className="font-bold uppercase">{error}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Header - Industrial Theme */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-4">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('instructor.quizzes.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {t('instructor.quizzes.table.pagination', { start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, total), total })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setImportModalVisible(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-neutral-100 hover:scale-[1.02] transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {t('instructor.quizzes.importExcel')}
            </button>
            <button
              onClick={() => setCreateDrawerVisible(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" />
              {t('instructor.quizzes.createQuiz')}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-none bg-white border-2 border-black p-4 mb-4">
        <div className="h-1 bg-yellow-400 -mx-4 -mt-4 mb-4" />
        <QuizFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
        />
      </div>

      {/* Table Card */}
      <div className="flex-1 flex flex-col bg-white border-2 border-black overflow-hidden relative">
        <div className="h-1 bg-yellow-400 flex-none" />

        {/* Industrial Table Styles */}
        <style>{`
          .industrial-quiz-table .ant-table {
            border: 2px solid #000 !important;
            border-radius: 0 !important;
          }
          .industrial-quiz-table .ant-table-container {
            border-radius: 0 !important;
          }
          .industrial-quiz-table .ant-table-thead > tr > th:first-child {
            border-top-left-radius: 0 !important;
          }
          .industrial-quiz-table .ant-table-thead > tr > th:last-child {
            border-top-right-radius: 0 !important;
          }
          .industrial-quiz-table .ant-table-thead > tr > th {
            background: #fef08a !important;
            border-bottom: 2px solid #000 !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            font-size: 12px !important;
            letter-spacing: 0.05em !important;
            color: #000 !important;
          }
          .industrial-quiz-table .ant-table-tbody > tr > td {
            border-bottom: 1px solid #e5e5e5 !important;
          }
          .industrial-quiz-table .ant-table-tbody > tr:hover > td {
            background: #fef9c3 !important;
          }
          .industrial-quiz-table .ant-pagination-item-active {
            background: #facc15 !important;
            border-color: #000 !important;
          }
          .industrial-quiz-table .ant-pagination-item-active a {
            color: #000 !important;
            font-weight: 700 !important;
          }
        `}</style>

        <div className="flex-1 overflow-hidden p-0 industrial-quiz-table">
          <Table
            columns={columns}
            dataSource={quizzes}
            rowKey="id"
            pagination={false}
            scroll={{ y: "calc(100vh - 480px)" }}
            size="middle"
            locale={{
              emptyText: (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
                    <HelpCircle className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-800 font-bold uppercase mb-2">{t('instructor.quizzes.noQuestions')}</p>
                  <button
                    onClick={() => setCreateDrawerVisible(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    {t('instructor.quizzes.createQuiz')}
                  </button>
                </div>
              )
            }}
          />
        </div>

        <div className="flex-none p-4 border-t-2 border-neutral-200 flex justify-center bg-white z-10">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p, ps) => { setPage(p); setPageSize(ps); load(p, ps); }}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            className="industrial-pagination"
            showTotal={(total, range) => (
              <span className="font-bold text-neutral-600 mr-4">
                {range[0]}-{range[1]} / {total} {t('instructor.quizzes.title').toLowerCase()}
              </span>
            )}
            itemRender={(curr, type, originalElement) => {
              if (type === 'page') {
                return (
                  <a className={`font-bold flex items-center justify-center w-full h-full border border-neutral-300 hover:border-yellow-400 hover:text-yellow-600 transition-colors ${curr === page ? 'bg-yellow-400 text-black border-black' : 'bg-white text-neutral-600'}`}>
                    {curr}
                  </a>
                );
              }
              return originalElement;
            }}
          />
          <style>{`
            .industrial-pagination .ant-pagination-item-active {
              border-color: #000 !important;
              background: #facc15 !important;
            }
            .industrial-pagination .ant-pagination-item-active a {
              color: #000 !important;
            }
             .industrial-pagination .ant-pagination-options .ant-select-selector {
               border-radius: 0 !important;
            }
            .industrial-pagination .ant-pagination-item {
               border-radius: 0 !important;
            }
          `}</style>
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
