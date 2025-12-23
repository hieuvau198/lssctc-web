import {
  App,
  Drawer,
  Empty,
  Form,
  Skeleton
} from "antd";
import { BookOpen, Plus, AlertCircle, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  addCourse,
  deleteCourse,
  fetchCourseCategories,
  fetchCourseDetail,
  fetchCourseLevels,
  fetchCourses,
  updateCourse,
} from "../../../apis/ProgramManager/CourseApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import CourseList from "./partials/CourseList";
import CreateCourse from "./partials/CreateCourse";
import EditCourse from "./partials/EditCourse";

const Courses = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search State
  const [searchValue, setSearchValue] = useState(searchParams.get('searchTerm') || "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || "");
  
  // Sort State
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || undefined);
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') || undefined);

  // Pagination State
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [total, setTotal] = useState(0);
  
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'

  // Filter states (kept for future use or if passed to API)
  const [categoryId, setCategoryId] = useState(undefined);
  const [levelId, setLevelId] = useState(undefined);
  const [isActive, setIsActive] = useState(undefined);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null); // 'view' | 'create' | 'edit'
  const [currentCourse, setCurrentCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Metadata
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch categories & levels once
  useEffect(() => {
    let mounted = true;
    setMetaLoading(true);
    Promise.allSettled([fetchCourseCategories(), fetchCourseLevels()])
      .then(([catRes, lvlRes]) => {
        if (!mounted) return;
        if (catRes.status === 'fulfilled') {
          setCategories(catRes.value || []);
        } else {
          console.error('Failed to fetch categories:', catRes.reason);
        }
        if (lvlRes.status === 'fulfilled') {
          setLevels(lvlRes.value || []);
        } else {
          console.error('Failed to fetch levels:', lvlRes.reason);
        }
      })
      .finally(() => mounted && setMetaLoading(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCourses({ pageNumber, pageSize, searchTerm, sortBy, sortDirection })
      .then((data) => {
        setCourses(data.items || []);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageNumber, pageSize, searchTerm, sortBy, sortDirection]);

  // Handle Table Changes (Sorting)
  const handleTableChange = (pagination, filters, sorter) => {
    const field = Array.isArray(sorter) ? undefined : sorter.field;
    const order = Array.isArray(sorter) ? undefined : sorter.order;

    let newSortDirection = undefined;
    if (order === 'ascend') newSortDirection = 'asc';
    else if (order === 'descend') newSortDirection = 'desc';

    setSortBy(field);
    setSortDirection(newSortDirection);
    setPageNumber(1); // Reset to first page on sort change

    // Update URL params
    const params = {
      page: '1',
      pageSize: pageSize.toString(),
      searchTerm: searchTerm || ""
    };
    if (field) params.sortBy = field;
    if (newSortDirection) params.sortDirection = newSortDirection;
    
    setSearchParams(params);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
    setSearchParams({
      page: '1',
      pageSize: pageSize.toString(),
      searchTerm: value || "",
      sortBy: sortBy || "",
      sortDirection: sortDirection || ""
    });
  };

  const handlePageChange = (page, size) => {
    setPageNumber(page);
    setPageSize(size);
    setSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      searchTerm: searchTerm || "",
      sortBy: sortBy || "",
      sortDirection: sortDirection || ""
    });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await deleteCourse(id);
      message.success((res && res.message) || t('admin.courses.deleteSuccess'));
      // Refresh list after delete
      const data = await fetchCourses({ 
        pageNumber, 
        pageSize, 
        searchTerm, 
        sortBy, 
        sortDirection 
      });
      setCourses(data.items || []);
      setTotal(data.totalCount || 0);
      closeDrawer();
    } catch (err) {
      message.error(err?.response?.data || err?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  // Drawer handlers
  const openCreate = () => {
    setDrawerMode('create');
    setCurrentCourse(null);
    createForm.resetFields();
    setDrawerOpen(true);
  };

  const openView = (course) => {
    navigate(`/admin/courses/${course.id}`);
  };

  const openEdit = async (course) => {
    setDrawerMode('edit');
    setCurrentCourse(course);
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const detail = await fetchCourseDetail(course.id);
      setCurrentCourse(detail);
      editForm.setFieldsValue({
        name: detail.name,
        description: detail.description,
        categoryId: detail.categoryId,
        levelId: detail.levelId,
        durationHours: detail.durationHours,
        imageUrl: detail.imageUrl,
        isActive: detail.isActive,
      });
    } catch (err) {
      message.error(err.message || t('admin.courses.loadDetailError'));
    } finally {
      setDetailLoading(false);
    }
  };

  const switchToEdit = () => {
    setDrawerMode('edit');
    if (currentCourse) {
      editForm.setFieldsValue({
        name: currentCourse.name,
        description: currentCourse.description,
        categoryId: currentCourse.categoryId,
        levelId: currentCourse.levelId,
        durationHours: currentCourse.durationHours,
        imageUrl: currentCourse.imageUrl,
        isActive: currentCourse.isActive,
      });
    }
  };

  const switchToView = () => {
    setDrawerMode('view');
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode(null);
    setCurrentCourse(null);
    createForm.resetFields();
    editForm.resetFields();
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      const res = await addCourse(values);
      message.success((res && res.message) || t('admin.courses.createSuccess'));
      // Refresh list
      const data = await fetchCourses({ pageNumber, pageSize, searchTerm, sortBy, sortDirection });
      setCourses(data.items || []);
      setTotal(data.totalCount || 0);
      closeDrawer();
    } catch (err) {
      if (err.message && err.message.includes("Internal Server Error")) {
        message.error("Operation failed. Please check for duplicate course codes or invalid data.");
      } else {
        message.error(err.message || t('admin.courses.createError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values) => {
    if (!currentCourse) return;
    setSubmitting(true);
    try {
      const res = await updateCourse(currentCourse.id, values);
      message.success((res && res.message) || t('admin.courses.updateSuccess'));
      // Refresh list
      const data = await fetchCourses({ pageNumber, pageSize, searchTerm, sortBy, sortDirection });
      setCourses(data.items || []);
      setTotal(data.totalCount || 0);
      // Update current course
      const updated = data.items.find(c => c.id === currentCourse.id);
      setCurrentCourse(updated || null);
      setDrawerMode('view');
    } catch (err) {
      message.error(err.message || t('admin.courses.updateError'));
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
      <div className="bg-neutral-800 border-2 border-black px-4 py-3 mb-0 flex-none z-10">
        <div className="h-1 bg-yellow-400 -mx-4 -mt-3 mb-3" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight leading-none block">
                {t('admin.courses.title')}
              </span>
              <p className="text-yellow-400 text-xs mt-0.5 font-bold">
                {total} {t('admin.courses.totalCourses') || 'courses'}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('admin.courses.addCourse')}
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
                placeholder={t('admin.courses.searchPlaceholder') || "Search courses..."}
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

        {/* Content Area */}
        <div className={`flex-1 ${viewMode === 'table' ? 'overflow-hidden' : 'overflow-y-auto'} bg-white relative`}>
          {loading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : courses.length === 0 ? (
            <Empty description={t('admin.courses.noCourses')} className="py-20" />
          ) : (
            <div className="p-6">
              <CourseList
                courses={courses}
                viewMode={viewMode}
                pageNumber={pageNumber}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
                onSelect={openView}
                onEdit={openEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
                // Sorting props
                sortBy={sortBy}
                sortDirection={sortDirection}
                onTableChange={handleTableChange}
                // Scroll settings
                scroll={{ x: 'max-content', y: 'calc(100vh - 380px)' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Industrial Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        width={720}
        title={null}
        closable={false}
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
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white m-0">
                  {drawerMode === 'create'
                    ? t('admin.courses.createCourse')
                    : drawerMode === 'edit'
                      ? t('admin.courses.editCourse')
                      : currentCourse?.name || t('admin.courses.courseDetail')}
                </h3>
                <p className="text-neutral-400 text-xs m-0 mt-1">
                  {drawerMode === 'create'
                    ? t('admin.courses.createCourseSubtitle')
                    : t('admin.courses.editCourseSubtitle')}
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
          {drawerMode === 'create' && (
            <CreateCourse
              embedded
              open
              onCancel={closeDrawer}
              onCreate={handleCreate}
              confirmLoading={submitting}
              categories={categories}
              levels={levels}
            />
          )}
          {drawerMode === 'edit' && (
            detailLoading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              currentCourse && (
                <EditCourse
                  embedded
                  open
                  course={currentCourse}
                  onCancel={switchToView}
                  onUpdate={handleUpdate}
                  confirmLoading={submitting}
                  categories={categories}
                  levels={levels}
                />
              )
            )
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Courses;