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
  const renderLoading = () => (
    <div className="p-6 h-full flex items-center justify-center">
      <Skeleton active paragraph={{ rows: 10 }} className="max-w-4xl" />
    </div>
  );

  // Error State - Industrial Theme
  const renderError = () => (
    <div className="p-6 h-full flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 p-6 flex flex-col items-center gap-3 text-red-600 max-w-lg shadow-sm">
        <AlertCircle className="w-10 h-10" />
        <span className="font-bold uppercase text-lg">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col pb-2">
      {/* Header - Industrial Theme */}
      <div className="bg-black border-2 border-black px-4 py-3 mb-0 flex-none z-10">
        <div className="h-1 bg-yellow-400 -mx-4 -mt-3 mb-3" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Layers className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight leading-none block">
                {t('admin.programs.title')}
              </span>
              <p className="text-yellow-400 text-xs mt-0.5 font-bold">
                {total} {t('admin.programs.totalPrograms') || 'programs'}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('admin.programs.addProgram')}
          </button>
        </div>
      </div>

      {/* Main Content Card Wrapper */}
      <div className="bg-white border-x-2 border-b-2 border-black overflow-hidden flex-1 flex flex-col min-h-0">

        {/* Integrated Search Bar */}
        <div className="px-4 py-2 bg-white border-b-2 border-neutral-200 flex-none shadow-sm z-10">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Custom Search Input */}
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.programs.searchPlaceholder')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchValue)}
                className="w-full h-9 pl-10 pr-4 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white focus:ring-1 focus:ring-black font-medium text-sm text-black placeholder-neutral-400 transition-all outline-none"
              />
              {searchValue && (
                <button
                  onClick={() => { setSearchValue(''); handleSearch(''); }}
                  className="absolute inset-y-0 right-10 flex items-center pr-2 text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => handleSearch(searchValue)}
                className="absolute inset-y-0 right-0 flex items-center px-4 bg-yellow-400 text-black font-bold uppercase text-xs border-l border-black hover:bg-yellow-500 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Main Content Area - Scrollable Table */}
        <div className="flex-1 overflow-hidden bg-white relative">
          {loading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : programs.length === 0 ? (
            <Empty description={t('admin.programs.noPrograms')} className="py-20" />
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
                  scroll={{ x: 'max-content', y: 'calc(100vh - 350px)' }}
                />
              ) : (
                <div className="h-full overflow-y-auto p-6 bg-neutral-50">
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
                </div>
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