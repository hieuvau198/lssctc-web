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
  const {message} = App.useApp();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    const params = {
      pageNumber,
      pageSize,
      searchTerm,
      categoryId,
      levelId,
      isActive: isActive === undefined ? undefined : String(isActive).toLowerCase(),
    };

    // Remove undefined values
    Object.keys(params).forEach((key) =>
      params[key] === undefined || params[key] === null ? delete params[key] : null
    );

    fetchCourses(params)
      .then((data) => {
        setCourses(data.items || []);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageNumber, pageSize, searchTerm, categoryId, levelId, isActive]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const handlePageChange = (page, size) => {
    setPageNumber(page);
    setPageSize(size);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await deleteCourse(id);
      message.success((res && res.message) || 'Course deleted successfully');
      // Refresh list after delete
      const params = {
        pageNumber,
        pageSize,
        searchTerm,
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
      message.error(err.message || 'Delete failed');
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

  const openView = async (course) => {
    setDrawerMode('view');
    setCurrentCourse(course);
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const detail = await fetchCourseDetail(course.id);
      setCurrentCourse(detail);
    } catch (err) {
      message.error(err.message || 'Failed to load course detail');
    } finally {
      setDetailLoading(false);
    }
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
      message.error(err.message || 'Failed to load course detail');
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
      message.success((res && res.message) || 'Course created successfully');
      // Refresh list
      const params = {
        pageNumber,
        pageSize,
        searchTerm,
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
      message.error(err.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values) => {
    if (!currentCourse) return;
    setSubmitting(true);
    try {
      const res = await updateCourse(currentCourse.id, values);
      message.success((res && res.message) || 'Course updated successfully');
      // Refresh list
      const params = {
        pageNumber,
        pageSize,
        searchTerm,
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
      // Update current course
      const updated = data.items.find(c => c.id === currentCourse.id);
      setCurrentCourse(updated || null);
      setDrawerMode('view');
    } catch (err) {
      message.error(err.message || 'Update failed');
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">Course Management</span>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-3">
            <Input.Search
              placeholder="Search courses..."
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              className="w-full md:w-80"
            />
          </div>
          <div className="col-span-2 flex flex-wrap gap-2">
            <Select
              placeholder="All Categories"
              allowClear
              style={{ width: 150 }}
              value={categoryId}
              onChange={setCategoryId}
              loading={metaLoading}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="All Levels"
              allowClear
              style={{ width: 120 }}
              value={levelId}
              onChange={setLevelId}
              loading={metaLoading}
            >
              {levels.map((level) => (
                <Option key={level.id} value={level.id}>
                  {level.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="All Status"
              allowClear
              style={{ width: 100 }}
              value={isActive}
              onChange={setIsActive}
            >
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Add Course
          </Button>
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {/* Content */}
      {courses.length === 0 ? (
        <Empty description="No courses found." className="mt-16" />
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
            ? 'Create Course'
            : drawerMode === 'edit'
              ? 'Edit Course'
              : currentCourse?.name || 'Course Detail'
        }
        extra={
          drawerMode === 'view' && currentCourse ? (
            <Space>
              <Button onClick={switchToEdit}>Edit</Button>
              <Popconfirm
                title="Delete course?"
                description="Are you sure you want to delete this course?"
                onConfirm={() => handleDelete(currentCourse.id)}
                okButtonProps={{ loading: deletingId === currentCourse.id }}
              >
                <Button danger loading={deletingId === currentCourse.id}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          ) : null
        }
      >
        {drawerMode === 'view' && currentCourse && (
          detailLoading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <CourseDetail embedded course={currentCourse} />
          )
        )}
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
