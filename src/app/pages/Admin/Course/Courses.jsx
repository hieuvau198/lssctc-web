import {
  App,
  Drawer,
  Empty,
  Form,
  Select,
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
import CourseDetail from "./partials/CourseDetail";
import CourseList from "./partials/CourseList";
import CreateCourse from "./partials/CreateCourse";
import EditCourse from "./partials/EditCourse";

const { Option } = Select;

const Courses = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get('searchTerm') || "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || undefined);
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'

  // Filter states
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
    const [sortBy, sortDirection] = sortOrder ? sortOrder.split('_') : [undefined, undefined];
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
  }, [pageNumber, pageSize, searchTerm, sortOrder]);

  const handleSortChange = (value) => {
    setSortOrder(value);
    setPageNumber(1);
    setSearchParams({
      page: '1',
      pageSize: pageSize.toString(),
      searchTerm: searchTerm || "",
      sortOrder: value || ""
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
    setSearchParams({
      page: '1',
      pageSize: pageSize.toString(),
      searchTerm: value || "",
      sortOrder: sortOrder || ""
    });
  };

  const handlePageChange = (page, size) => {
    setPageNumber(page);
    setPageSize(size);
    setSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      searchTerm: searchTerm || "",
      sortOrder: sortOrder || ""
    });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await deleteCourse(id);
      message.success((res && res.message) || t('admin.courses.deleteSuccess'));
      // Refresh list after delete
      const params = {
        pageNumber,
        pageSize,
        searchTerm,
        sortOrder,
        categoryId,
        levelId,
        isActive: isActive === undefined ? undefined : String(isActive).toLowerCase(),
      };
      Object.keys(params).forEach((key) =>
        params[key] === undefined || params[key] === null ? delete params[key] : null
      );
      const data = await fetchCourses(params);
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
    // Navigate to the detail page instead of opening drawer
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
      const [sortBy, sortDirection] = sortOrder ? sortOrder.split('_') : [undefined, undefined];
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
      const [sortBy, sortDirection] = sortOrder ? sortOrder.split('_') : [undefined, undefined];
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
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('admin.courses.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {total} {t('admin.courses.totalCourses') || 'courses'}
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('admin.courses.addCourse')}
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />

        {/* Search Bar - Industrial Theme */}
        <div className="px-6 py-4 bg-neutral-50 border-b-2 border-neutral-200">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.courses.searchPlaceholder') || "Search courses..."}
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

            {/* Sort Filter */}
            <Select
              placeholder={t('admin.courses.sortBy') || "Sort by"}
              value={sortOrder}
              onChange={handleSortChange}
              style={{ width: 180 }}
              allowClear
              className="industrial-select"
              size="large"
            >
              <Option value="price_asc">{t('admin.courses.priceLowToHigh') || "Price: Low to High"}</Option>
              <Option value="price_desc">{t('admin.courses.priceHighToLow') || "Price: High to Low"}</Option>
            </Select>

            {/* View Mode Toggle */}
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
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
          {courses.length === 0 ? (
            <Empty description={t('admin.courses.noCourses')} className="py-16" />
          ) : (
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
            />
          )}
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        width={720}
        title={
          drawerMode === 'create'
            ? t('admin.courses.createCourse')
            : drawerMode === 'edit'
              ? t('admin.courses.editCourse')
              : currentCourse?.name || t('admin.courses.courseDetail')
        }
        extra={
          // Removed View controls since we now navigate to page
          drawerMode === 'view' && currentCourse ? null : null
        }
      >
        {/* Removed drawerMode === 'view' logic since it's handled by page now */}

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
      </Drawer>
    </div>
  );
};

export default Courses;