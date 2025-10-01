// src\app\pages\ProgramManager\Course\Courses.jsx

import React, { useEffect, useState } from "react";
import { fetchCourses, addCourse, updateCourse, fetchCourseDetail, fetchCourseCategories, fetchCourseLevels } from "../../../apis/ProgramManager/CourseApi";
import { Skeleton, Alert, message, Drawer, Button } from "antd";
import CourseFilters from "./partials/CourseFilters";
import CourseList from "./partials/CourseList";
import CreateCourse from "./partials/CreateCourse";
import EditCourse from "./partials/EditCourse";
import CourseDetail from "./partials/CourseDetail";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState(undefined);
  const [levelId, setLevelId] = useState(undefined);
  const [isActive, setIsActive] = useState(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'view' | 'create' | 'edit'
  const [currentCourse, setCurrentCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);

  // Fetch categories & levels once
  useEffect(() => {
    let mounted = true;
    setMetaLoading(true);
    Promise.allSettled([fetchCourseCategories(), fetchCourseLevels()])
      .then(([catRes, lvlRes]) => {
        if (!mounted) return;
        if (catRes.status === 'fulfilled') {
          // Normalize to array of { value, label }
            const mapped = (Array.isArray(catRes.value) ? catRes.value : []).map(c => ({
              value: c.id ?? c.Id ?? c.categoryId ?? c.CategoryId,
              label: c.name ?? c.Name ?? c.categoryName ?? c.CategoryName,
            })).filter(c => c.value !== undefined && c.label);
            setCategories(mapped);
        }
        if (lvlRes.status === 'fulfilled') {
            const mapped = (Array.isArray(lvlRes.value) ? lvlRes.value : []).map(l => ({
              value: l.id ?? l.Id ?? l.levelId ?? l.LevelId,
              label: l.name ?? l.Name ?? l.levelName ?? l.LevelName,
            })).filter(l => l.value !== undefined && l.label);
            setLevels(mapped);
        }
      })
      .finally(() => mounted && setMetaLoading(false));
    return () => { mounted = false; };
  }, []);

  // Fetch data when filters change (including search)
  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: 1,
      pageSize: 12,
      categoryId,
      levelId,
      isActive:
        isActive === undefined ? undefined : String(isActive).toLowerCase(),
    };

    // Only remove keys if value is undefined or null (not false or 0)
    Object.keys(params).forEach((key) =>
      params[key] === undefined || params[key] === null
        ? delete params[key]
        : null
    );
    fetchCourses(params)
      .then((data) => {
        setCourses(data.items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [categoryId, levelId, isActive]);

  // Real-time search effect (client-side)
  useEffect(() => {
    const val = searchValue.trim().toLowerCase();
    if (!val) {
      setFiltered(courses);
      return;
    }
    setFiltered(courses.filter((c) => c.name.toLowerCase().includes(val)));
  }, [searchValue, courses]);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchCourses()
      .then((data) => {
        setCourses(data.items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const openView = (course) => {
    setMode('view');
    setCurrentCourse(course);
    setDrawerOpen(true);
  };

  const openCreate = () => {
    setMode('create');
    setCurrentCourse(null);
    setDrawerOpen(true);
  };

  const openEdit = async () => {
    if (!currentCourse) return;
    setEditLoading(true);
    try {
      const detail = await fetchCourseDetail(currentCourse.id);
      // Normalize possible backend casing / alternative field names
      const normalized = {
        ...detail,
        price: detail.price ?? detail.Price ?? detail.coursePrice,
        durationHours: detail.durationHours ?? detail.DurationHours ?? detail.duration ?? detail.Duration,
        imageUrl: detail.imageUrl ?? detail.ImageUrl ?? detail.ImageURL,
        isActive: (detail.isActive ?? detail.IsActive ?? detail.active) ?? false,
        courseCodeName: detail.courseCodeName ?? detail.courseCode ?? detail.code ?? '',
      };
      setCurrentCourse(normalized);
      setMode('edit');
    } catch (err) {
      message.error(err.message || 'Failed to load course detail');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (values) => {
    setSubmitting(true);
    try {
      await addCourse(values);
      message.success('Course created');
      const data = await fetchCourses();
      setCourses(data.items);
      setFiltered(data.items);
      // Attempt to set currentCourse to newly created (simple heuristic by name match)
      const created = data.items.find(c => c.name === values.name && c.courseCodeName === values.courseCodeName);
      setCurrentCourse(created || null);
      setMode('view');
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
      await updateCourse(currentCourse.id, values);
      message.success('Course updated');
      const data = await fetchCourses();
      setCourses(data.items);
      setFiltered(data.items);
      const updated = data.items.find(c => c.id === currentCourse.id);
      setCurrentCourse(updated || null);
      setMode('view');
    } catch (err) {
      message.error(err.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setMode(null);
    setCurrentCourse(null);
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Course Management</h2>
        <div className="mb-6">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow">
              <div className="w-full h-36 overflow-hidden rounded-t-lg">
                <Skeleton.Image active className="!w-full !h-36" />
              </div>
              <div className="p-4">
                <Skeleton active title paragraph={{ rows: 2 }} />
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
      <h2 className="text-2xl font-bold mb-6">Course Management</h2>
      <CourseFilters
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        levelId={levelId}
        setLevelId={setLevelId}
        isActive={isActive}
        setIsActive={setIsActive}
        onAddCourse={openCreate}
      />
      <CourseList courses={filtered} onSelect={openView} />

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        width={720}
        title={
          mode === 'create'
            ? 'Add Course'
            : mode === 'edit'
            ? 'Edit Course'
            : currentCourse?.name || 'Course Detail'
        }
        extra={
          mode === 'view' && currentCourse ? (
            <Button type="primary" onClick={openEdit}>
              Edit
            </Button>
          ) : null
        }
      >
        {mode === 'view' && currentCourse && (
          <CourseDetail embedded course={currentCourse} />
        )}
        {mode === 'create' && (
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
        {mode === 'edit' && (
          editLoading ? (
            <div className="space-y-4">
              <Skeleton active title paragraph={{ rows: 6 }} />
            </div>
          ) : (
            currentCourse && (
              <EditCourse
                embedded
                open
                course={currentCourse}
                onCancel={() => setMode('view')}
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
