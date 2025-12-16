import {
  Alert,
  App,
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  Popconfirm,
  Select,
  Skeleton,
  Space
} from "antd";
import { Plus } from "lucide-react";
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

const { Search } = Input;
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

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton.Button style={{ width: 200, height: 32 }} active />
        </div>

        {/* Search and Controls Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Skeleton.Input style={{ width: 320, height: 40 }} active />
          <div className="flex gap-2">
            <Skeleton.Button style={{ width: 120, height: 40 }} active />
            <Skeleton.Button style={{ width: 80, height: 40 }} active />
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton.Input style={{ width: 150, height: 32 }} active />
          <Skeleton.Input style={{ width: 120, height: 32 }} active />
          <Skeleton.Input style={{ width: 100, height: 32 }} active />
        </div>

        {/* Content Skeleton - Table format */}
        <div className="bg-white rounded-lg shadow p-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-b-0">
              <Skeleton.Avatar size={48} shape="square" active />
              <div className="flex-1">
                <Skeleton.Input style={{ width: '60%', height: 20, marginBottom: 8 }} active />
                <Skeleton.Input style={{ width: '40%', height: 16 }} active />
              </div>
              <div className="flex gap-2">
                <Skeleton.Button size="small" active />
                <Skeleton.Button size="small" active />
                <Skeleton.Button size="small" active />
              </div>
            </div>
          ))}
        </div>
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
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{t('admin.courses.title')}</span>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-1 gap-2 w-full md:w-auto">
          <Input.Search
            placeholder={t('admin.courses.searchPlaceholder') || "Search courses..."}
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            className="w-full md:w-80"
          />
          <Select
            placeholder={t('admin.courses.sortBy') || "Sort by"}
            value={sortOrder}
            onChange={handleSortChange}
            style={{ width: 180 }}
            allowClear
          >
            <Option value="price_asc">{t('admin.courses.priceLowToHigh') || "Price: Low to High"}</Option>
            <Option value="price_desc">{t('admin.courses.priceHighToLow') || "Price: High to Low"}</Option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            {t('admin.courses.addCourse')}
          </Button>
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {/* Content */}
      {courses.length === 0 ? (
        <Empty description={t('admin.courses.noCourses')} className="mt-16" />
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