import {
  PlusOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Empty,
  Form,
  Input,
  Skeleton
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  createProgram,
  fetchPrograms,
} from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import ProgramCardView from "./partials/ProgramCardView";
import ProgramDrawer from "./partials/ProgramDrawer";
import ProgramTableView from "./partials/ProgramTableView";

const ManagerProgramList = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get('searchTerm') || "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || "");
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'

  // Create Drawer state
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    fetchPrograms({ pageNumber, pageSize, searchTerm })
      .then((data) => {
        setPrograms(data.items || []);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageNumber, pageSize, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
    setSearchParams({
      page: '1',
      pageSize: pageSize.toString(),
      searchTerm: value || ""
    });
  };

  const handlePageChange = (page, size) => {
    setPageNumber(page);
    setPageSize(size);
    setSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      searchTerm: searchTerm || ""
    });
  };

  // Navigates to the Detail Page
  const handleViewProgram = (program) => {
    navigate(`/admin/programs/${program.id}`);
  };

  const openCreate = () => {
    createForm.resetFields();
    setCreateDrawerOpen(true);
  };

  const closeCreateDrawer = () => {
    setCreateDrawerOpen(false);
    createForm.resetFields();
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await createProgram(values);
      message.success(t('admin.programs.createSuccess'));
      // Refresh list
      const data = await fetchPrograms({ pageNumber, pageSize, searchTerm });
      setPrograms(data.items || []);
      setTotal(data.totalCount || 0);
      closeCreateDrawer();
    } catch (err) {
      message.error(err.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-2 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-slate-800">{t('admin.programs.title')}</span>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Input.Search
          placeholder={t('admin.programs.searchPlaceholder')}
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          className="w-full md:w-1/3"
        />
        <div className="flex gap-2">
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t('admin.programs.addProgram')}
          </Button>
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {/* Content */}
      {programs.length === 0 ? (
        <Empty description={t('admin.programs.noPrograms')} className="mt-16" />
      ) : (
        <>
          {viewMode === "table" ? (
            <ProgramTableView
              programs={programs}
              pageNumber={pageNumber}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onView={handleViewProgram}
            />
          ) : (
            <ProgramCardView
              programs={programs}
              pageNumber={pageNumber}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onView={handleViewProgram}
              onEdit={handleViewProgram} 
              onDelete={(id) => {/* Delete is now handled in detail page, but if you keep card actions, you need to implement delete here again or remove buttons from card view */}}
              // Note: You might want to update ProgramCardView to remove Edit/Delete buttons or redirect them to handleViewProgram
            />
          )}
        </>
      )}

      {/* Create Drawer */}
      <ProgramDrawer
        open={createDrawerOpen}
        mode="create"
        createForm={createForm}
        submitting={submitting}
        onClose={closeCreateDrawer}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default ManagerProgramList;