import {
  App,
  Empty,
  Form,
  Skeleton
} from "antd";
import { Layers, Plus, AlertCircle, Search, X } from "lucide-react";
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

  // Loading State - Industrial Theme
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
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
  }

  // Error State - Industrial Theme
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-4" />
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold uppercase">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
      {/* Header - Industrial Theme */}
      <div className="bg-black border-2 border-black p-5 mb-6">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('admin.programs.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {total} {t('admin.programs.totalPrograms') || 'programs'}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('admin.programs.addProgram')}
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />

        {/* Search Bar - Industrial Theme */}
        <div className="px-6 py-4 bg-neutral-50 border-b-2 border-neutral-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="flex-1 w-full max-w-xl relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.programs.searchPlaceholder')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchValue)}
                className="w-full h-12 pl-12 pr-24 bg-white border-2 border-neutral-300 focus:border-black focus:ring-0 font-medium text-black placeholder-neutral-400 transition-colors outline-none"
              />
              {searchValue && (
                <button
                  onClick={() => { setSearchValue(''); handleSearch(''); }}
                  className="absolute inset-y-0 right-14 flex items-center pr-2 text-neutral-400 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleSearch(searchValue)}
                className="absolute inset-y-0 right-0 flex items-center px-5 bg-yellow-400 text-black font-bold uppercase text-sm border-l-2 border-black hover:bg-yellow-500 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {programs.length === 0 ? (
            <Empty description={t('admin.programs.noPrograms')} className="py-16" />
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
                  onDelete={(id) => {/* Delete is handled in detail page */ }}
                />
              )}
            </>
          )}
        </div>
      </div>

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