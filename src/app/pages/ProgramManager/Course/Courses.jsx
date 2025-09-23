import React, { useEffect, useState } from "react";
import {
  fetchCourses,
  addCourse,
  updateCourse,
} from "../../../apis/ProgramManager/CourseApi";
import { Spin, Alert, message } from "antd";
import CourseDetail from "./partials/CourseDetail";
import CreateCourse from "./partials/CreateCourse";
import EditCourse from "./partials/EditCourse";
import CourseFilters from "./partials/CourseFilters";
import CourseList from "./partials/CourseList";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState(undefined);
  const [levelId, setLevelId] = useState(undefined);
  const [isActive, setIsActive] = useState(undefined);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const handleAddCourse = async (values) => {
    setAdding(true);
    try {
      await addCourse(values);
      message.success("Course added successfully!");
      setModalOpen(false);
      // Refresh data
      fetchCourses().then((data) => setCourses(data.items));
    } catch (err) {
      message.error(err.message || "Failed to add course");
    } finally {
      setAdding(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setEditModalOpen(true);
  };

  const handleUpdateCourse = async (values) => {
    setUpdating(true);
    try {
      await updateCourse(editingCourse.id, values);
      message.success("Course updated successfully!");
      setEditModalOpen(false);
      setEditingCourse(null);
      // Refresh data
      fetchCourses().then((data) => setCourses(data.items));
    } catch (err) {
      message.error(err.message || "Failed to update course");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading courses..." />
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );

  if (selectedCourse)
    return (
      <CourseDetail
        id={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
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
        onAddCourse={() => setModalOpen(true)}
      />
      <CourseList
        courses={filtered}
        onView={setSelectedCourse}
        onEdit={handleEditCourse}
      />
      <CreateCourse
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onCreate={handleAddCourse}
        confirmLoading={adding}
      />
      <EditCourse
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingCourse(null);
        }}
        onUpdate={handleUpdateCourse}
        confirmLoading={updating}
        course={editingCourse}
      />
    </div>
  );
};

export default Courses;
