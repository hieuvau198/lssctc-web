import { App, Drawer, Empty, Form, Select, Skeleton } from "antd";
import { GraduationCap, Plus, AlertCircle, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from "react-router-dom";
import { createClass, deleteClass, fetchClasses } from "../../../apis/ProgramManager/ClassesApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import ClassList from "./partials/ClassList";
import AddClassForm from "./partials/AddClassForm";

const { Option } = Select;

const PMClasses = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || "");
  const [status, setStatus] = useState(searchParams.get('status') || undefined);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'startDate');
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') || 'desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: page,
      pageSize,
      searchTerm,
      status,
      sortBy,
      sortDirection
    };

    // Clean undefined params
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    fetchClasses(params)
      .then((data) => {
        setClasses(data.items || []);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch classes");
        setLoading(false);
      });
  }, [page, pageSize, searchTerm, status, sortBy, sortDirection]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
    updateSearchParams({ searchTerm: value, page: '1' });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
    updateSearchParams({ status: value, page: '1' });
  };

  const handleSortChange = (value) => {
    const [field, direction] = value.split('_');
    setSortBy(field);
    setSortDirection(direction);
    setPage(1);
    updateSearchParams({ sortBy: field, sortDirection: direction, page: '1' });
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
    updateSearchParams({ page: newPage.toString(), pageSize: newPageSize.toString() });
  };

  const updateSearchParams = (newParams) => {
    const currentParams = {};
    searchParams.forEach((value, key) => { currentParams[key] = value; });

    const updatedParams = { ...currentParams, ...newParams };

    // Remove undefined/empty values
    Object.keys(updatedParams).forEach(key => {
      if (updatedParams[key] === undefined || updatedParams[key] === null || updatedParams[key] === "") {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteClass(id);
      message.success(t('admin.classes.deleteSuccess'));
      // Refresh list
      const params = {
        pageNumber: page,
        pageSize,
        searchTerm,
        status,
        sortBy,
        sortDirection
      };

      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const data = await fetchClasses(params);
      setClasses(data.items || []);
      setTotal(data.totalCount || 0);
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || t('admin.classes.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => {
    createForm.resetFields();
    setDrawerOpen(true);
  };
  const openView = (classItem) => navigate(`/admin/class/${classItem.id}`);
  const openEdit = (classItem) => navigate(`/admin/class/${classItem.id}/edit`);

  const closeDrawer = () => {
    setDrawerOpen(false);
    createForm.resetFields();
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await createClass(values);
      message.success(t('admin.classes.createSuccess'));
      // Refresh list
      const params = {
        pageNumber: page,
        pageSize,
        searchTerm,
        status,
        sortBy,
        sortDirection
      };

      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const data = await fetchClasses(params);
      setClasses(data.items || []);
      setTotal(data.totalCount || 0);
      closeDrawer();
    } catch (err) {
      message.error(err?.message || t('admin.classes.createError'));
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
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight leading-none block">
                {t('admin.classes.title')}
              </span>
              <p className="text-yellow-400 text-xs mt-0.5 font-bold">
                {total} {t('admin.classes.totalClasses') || 'classes'}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('admin.classes.addClass')}
          </button>
        </div>
      </div>

      {/* Main Content Card Wrapper */}
      <div className="bg-white border-x-2 border-b-2 border-black overflow-hidden flex-1 flex flex-col min-h-0">

        {/* Integrated Search Bar & Filters */}
        <div className="px-4 py-2 bg-white border-b-2 border-neutral-200 flex-none shadow-sm z-10">
          <div className="flex flex-col xl:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.classes.searchPlaceholder') || "Search classes..."}
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

            {/* Filters */}
            <div className="flex gap-2 flex-wrap items-center">
              <Select
                placeholder={t('admin.classes.filters.status') || "Status"}
                allowClear
                value={status}
                onChange={handleStatusChange}
                className="industrial-select-compact"
                size="middle"
                style={{ width: 140 }}
              >
                <Option value="Draft">{t('common.classStatus.Draft') || "Draft"}</Option>
                <Option value="Open">{t('common.classStatus.Open') || "Open"}</Option>
                <Option value="Inprogress">{t('common.classStatus.Inprogress') || "In Progress"}</Option>
                <Option value="Completed">{t('common.classStatus.Completed') || "Completed"}</Option>
                <Option value="Cancelled">{t('common.classStatus.Cancelled') || "Cancelled"}</Option>
              </Select>

              <Select
                placeholder={t('admin.classes.filters.sortByDate') || "Sort Date"}
                value={`${sortBy}_${sortDirection}`}
                onChange={handleSortChange}
                className="industrial-select-compact"
                size="middle"
                style={{ width: 180 }}
              >
                <Option value="startDate_desc">{t('admin.classes.filters.startDateNewest') || "Latest Start Date"}</Option>
                <Option value="startDate_asc">{t('admin.classes.filters.startDateOldest') || "Earliest Start Date"}</Option>
                <Option value="endDate_desc">{t('admin.classes.filters.endDateNewest') || "Latest End Date"}</Option>
                <Option value="endDate_asc">{t('admin.classes.filters.endDateOldest') || "Earliest End Date"}</Option>
              </Select>

              {/* View Mode Toggle */}
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>
        </div>


        <style>{`
          .industrial-select .ant-select-selector {
            border: 2px solid #000 !important;
            height: 48px !important;
            border-radius: 0 !important;
          }
          .industrial-select .ant-select-selection-item,
          .industrial-select .ant-select-selection-placeholder {
            line-height: 44px !important;
            font-weight: 500 !important;
          }
          .industrial-select:hover .ant-select-selector {
            border-color: #000 !important;
          }
          .industrial-select.ant-select-focused .ant-select-selector {
            border-color: #000 !important;
            box-shadow: none !important;
          }
        `}</style>

        {/* Industrial Select Styles (Compact) */}
        <style>{`
          .industrial-select-compact .ant-select-selector {
            border: 1px solid #d4d4d4 !important;
            height: 36px !important;
            border-radius: 0 !important;
            background-color: #fafafa !important;
          }
          .industrial-select-compact .ant-select-selection-item,
          .industrial-select-compact .ant-select-selection-placeholder {
            line-height: 34px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #000 !important;
          }
          .industrial-select-compact:hover .ant-select-selector {
            border-color: #000 !important;
            background-color: #fff !important;
          }
          .industrial-select-compact.ant-select-focused .ant-select-selector {
            border-color: #000 !important;
            box-shadow: none !important;
            background-color: #fff !important;
          }
        `}</style>

        {/* Content Area */}
        <div className={`flex-1 ${viewMode === 'table' ? 'overflow-hidden' : 'overflow-y-auto'} bg-white relative`}>
          {loading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : classes.length === 0 ? (
            <Empty description={t('admin.classes.noClasses')} className="py-20" />
          ) : (
            <div className="">
              <ClassList
                classes={classes}
                viewMode={viewMode}
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
                onView={openView}
                onEdit={openEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
                scroll={{ x: 'max-content', y: 'calc(100vh - 330px)' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Industrial Drawer for Add Class */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        width={720}
        title={null}
        closable={false}
        destroyOnClose
        styles={{
          header: { display: 'none' },
          body: { padding: 0 },
        }}
      >
        {/* Custom Industrial Header */}
        <div className="sticky top-0 z-10">
          <div className="h-1.5 bg-yellow-400" />
          <div className="bg-black px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="text-lg font-black uppercase tracking-wider text-white m-0">
                  {t('admin.classes.createClass')}
                </span>
                <p className="text-neutral-400 text-xs m-0 mt-1">
                  {t('admin.classes.form.subtitle') || 'Fill in the class details'}
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="w-10 h-10 flex items-center justify-center border-2 border-white/50 hover:bg-yellow-400 hover:border-yellow-400 transition-all group"
            >
              <X className="w-5 h-5 text-white group-hover:text-black" />
            </button>
          </div>
          <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
        </div>

        {/* Content */}
        <div className="p-6">
          <AddClassForm
            embedded
            open={drawerOpen}
            onCancel={closeDrawer}
            onCreate={handleCreate}
            confirmLoading={submitting}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default PMClasses;