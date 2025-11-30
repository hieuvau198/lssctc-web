import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import { getQuizzes, deleteQuiz } from '../../../apis/Instructor/InstructorQuiz';
import QuizFilters from './partials/QuizFilters';
import QuizHeader from './partials/QuizHeader';
import QuizTable from './partials/QuizTable';
import QuizPagination from './partials/QuizPagination';
import QuizEmptyState from './partials/QuizEmptyState';
import QuizLoading from './partials/QuizLoading';
import ImportQuizModal from './partials/ImportQuizModal';

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
  const [importModalVisible, setImportModalVisible] = useState(false);

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
    load(); // Reload list after successful import
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    load(newPage, pageSize);
  };

  if (loading) {
    return <QuizLoading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans animate-in fade-in duration-500">
      <QuizHeader
        total={total}
        onCreate={() => navigate('/instructor/quizzes/create')}
        onImport={() => setImportModalVisible(true)}
      />

      <div className="mb-6">
        <QuizFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onSearch={handleSearch}
        />
      </div>

      {(!quizzes || quizzes.length === 0) ? (
        <QuizEmptyState />
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <QuizTable
            quizzes={quizzes}
            page={page}
            pageSize={pageSize}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <QuizPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ImportQuizModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}
