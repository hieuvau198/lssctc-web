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
              <GraduationCap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('admin.classes.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {total} {t('admin.classes.totalClasses') || 'classes'}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('admin.classes.addClass')}
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />

        {/* Search Bar - Industrial Theme */}
        <div className="px-6 py-4 bg-neutral-50 border-b-2 border-neutral-200">
          <div className="flex flex-col xl:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.classes.searchPlaceholder') || "Search classes..."}
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

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select
                placeholder={t('admin.classes.filters.status') || "Status"}
                allowClear
                value={status}
                onChange={handleStatusChange}
                className="industrial-select"
                size="large"
                style={{ width: 150 }}
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
                className="industrial-select"
                size="large"
                style={{ width: 200 }}
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

        {/* Industrial Select Styles */}
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

        {/* Content Area */}
        <div className="p-6">
          {classes.length === 0 ? (
            <Empty description={t('admin.classes.noClasses')} className="py-16" />
          ) : (
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
            />
          )}
        </div>
      </div>

      {/* Drawer for Add Class */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        width={720}
        title={t('admin.classes.createClass')}
        destroyOnClose
      >
        <AddClassForm
          embedded
          open={drawerOpen}
          onCancel={closeDrawer}
          onCreate={handleCreate}
          confirmLoading={submitting}
        />
      </Drawer>
    </div>
  );
};

export default PMClasses;