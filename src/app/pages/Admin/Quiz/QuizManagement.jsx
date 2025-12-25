// hieuvau198/lssctc-web/lssctc-web-dev/src/app/pages/Admin/Quiz/QuizManagement.jsx

import React, { useState, useEffect } from 'react';
import { App, Modal, Tooltip, Input, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Trash2, Edit, FileSpreadsheet, FileQuestion, X, Eye } from 'lucide-react';
import { getQuizzes, deleteQuiz, getQuizDetail } from '../../../apis/Instructor/InstructorQuiz';
import IndustrialTable from '../../../components/Common/IndustrialTable';
import CreateQuizDrawer from '../../Instructor/InstructorQuizzes/partials/CreateQuizDrawer';
import ImportQuizModal from '../../Instructor/InstructorQuizzes/partials/ImportQuizModal';

const QuizManagement = () => {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();

  // Data States
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  // View/Filter States
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination States (Client-side buffering)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer/Modal States
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [editingQuizData, setEditingQuizData] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Client-side filtering
    if (!searchTerm.trim()) {
      setFilteredQuizzes(quizzes);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = quizzes.filter(q =>
        (q.name && q.name.toLowerCase().includes(lower)) ||
        (q.description && q.description.toLowerCase().includes(lower))
      );
      setFilteredQuizzes(filtered);
    }
    setPage(1);
  }, [searchTerm, quizzes]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetching large page size to handle client-side search/sort efficiently
      const res = await getQuizzes({ pageIndex: 1, pageSize: 10000 });
      setQuizzes(res.items || []);
      setFilteredQuizzes(res.items || []);
    } catch (error) {
      message.error(t('admin.quizzes.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    modal.confirm({
      title: t('admin.quizzes.deleteConfirm'),
      content: t('admin.quizzes.deleteWarning'),
      okText: t('common.delete'),
      okButtonProps: { danger: true },
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteQuiz(id);
          message.success(t('admin.quizzes.deleteSuccess'));
          fetchData();
        } catch (error) {
          message.error(error.message || t('admin.quizzes.deleteError'));
        }
      },
    });
  };

  const handleEdit = async (record) => {
    try {
      setLoading(true);
      const data = await getQuizDetail(record.id);
      setEditingQuizData(data || null);
      setEditingQuizId(record.id);
      setEditDrawerVisible(true);
    } catch (e) {
      console.error('Failed to load quiz for edit:', e);
      message.error(t('admin.quizzes.loadDetailFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setCreateDrawerVisible(false);
    setEditDrawerVisible(false);
    setEditingQuizData(null);
    setEditingQuizId(null);
    fetchData();
  };

  const handleImportSuccess = () => {
    setImportModalVisible(false);
    fetchData();
  };

  // Columns for IndustrialTable
  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 border border-black flex items-center justify-center text-black">
            <FileQuestion size={20} />
          </div>
          <div>
            <div className="font-bold text-base">{text}</div>
            <div className="text-xs text-neutral-500 truncate max-w-[200px]">{record.description}</div>
          </div>
        </div>
      )
    },
    {
      title: t('admin.quizzes.timeLimit'),
      dataIndex: 'timelimitMinute',
      key: 'timelimitMinute',
      width: 120,
      align: 'center',
      render: (v) => <span className="font-bold">{v} {t('common.minutes')}</span>
    },
    {
      title: t('admin.quizzes.passScore'),
      dataIndex: 'passScoreCriteria',
      key: 'passScoreCriteria',
      width: 120,
      align: 'center',
      render: (v) => (
        <span className="px-2 py-1 bg-neutral-200 border border-black text-xs font-bold">
          {v} {t('admin.quizzes.points')}
        </span>
      )
    },
    {
      title: t('admin.quizzes.totalScore'),
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 120,
      align: 'center',
      render: (v) => <span className="font-black text-lg">{v}</span>
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Tooltip title={t('common.edit')}>
            <button
              onClick={() => handleEdit(record)}
              className="w-8 h-8 flex items-center justify-center bg-white border border-black hover:bg-yellow-400 transition-colors"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <button
              onClick={() => handleDelete(record.id)}
              className="w-8 h-8 flex items-center justify-center bg-white border border-black hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      )
    }
  ];

  const paginatedData = filteredQuizzes.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col pb-2">
      {/* Header - Industrial Theme */}
      <div className="bg-neutral-800 border-2 border-black px-4 py-3 mb-0 flex-none z-10">
        <div className="h-1 bg-yellow-400 -mx-4 -mt-3 mb-3" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <FileQuestion className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight leading-none block">
                {t('admin.quizzes.title')}
              </span>
              <p className="text-yellow-400 text-xs mt-0.5 font-bold">
                {filteredQuizzes.length} {t('admin.quizzes.items')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setImportModalVisible(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-neutral-100 hover:scale-[1.02] transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {t('common.import')}
            </button>
            <button
              onClick={() => setCreateDrawerVisible(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('admin.quizzes.createQuiz')}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border-x-2 border-b-2 border-black overflow-hidden flex-1 flex flex-col min-h-0">
        {/* Search Bar */}
        <div className="px-4 py-2 bg-white border-b-2 border-neutral-200 flex-none shadow-sm z-10">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.quizzes.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white focus:ring-1 focus:ring-black font-medium text-sm text-black placeholder-neutral-400 transition-all outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-2 flex items-center text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 flex-1 overflow-hidden bg-white relative p-0">
          <IndustrialTable
            loading={loading}
            dataSource={paginatedData}
            columns={columns}
            rowKey="id"
            pagination={true}
            page={page}
            pageSize={pageSize}
            total={filteredQuizzes.length}
            onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}
            scroll={{ y: 'calc(100vh - 360px)' }}
            className="h-full border-none"
          />
        </div>
      </div>

      {/* Modals & Drawers */}
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
        onSuccess={handleCreateSuccess}
        mode="edit"
        quizId={editingQuizId}
        initialData={editingQuizData}
      />
    </div>
  );
};

export default QuizManagement;