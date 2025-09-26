import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Spin,
  Alert,
  Switch,
  Form,
  message,
  Pagination,
  Modal,
} from "antd";
import {
  fetchProgramDetail,
  updateProgramBasic,
  updateProgramCourses,
  updateProgramEntryRequirements,
  fetchCourses,
} from "../../../../apis/ProgramManager/ProgramManagerCourseApi";

const ProgramEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [program, setProgram] = useState(null);

  // Courses selection
  const [courseSearch, setCourseSearch] = useState("");
  const [coursePage, setCoursePage] = useState(1);
  const [coursePageSize, setCoursePageSize] = useState(10);
  const [courseList, setCourseList] = useState([]);
  const [courseTotal, setCourseTotal] = useState(0);
  const [courseLoading, setCourseLoading] = useState(false);

  // Courses in program
  const [programCourses, setProgramCourses] = useState([]);
  // Entry requirements
  const [entryRequirements, setEntryRequirements] = useState([]);
  // Error for courses update
  const [coursesError, setCoursesError] = useState(null);

  // Fetch program detail
  useEffect(() => {
    setLoading(true);
    fetchProgramDetail(id)
      .then((data) => {
        setProgram(data);
        setProgramCourses(
          (data.courses || []).map((c) => ({
            courseId: c.coursesId || c.id,
            order: c.courseOrder || 1,
            name: c.name,
          }))
        );
        setEntryRequirements(
          (data.entryRequirements || []).map((p) => ({
            name: p.name,
            description: p.description,
            documentUrl: p.documentUrl || "",
          }))
        );
        form.setFieldsValue({
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
          isActive: data.isActive,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [id]);

  // Fetch courses for selection
  useEffect(() => {
    setCourseLoading(true);
    fetchCourses({
      pageNumber: coursePage,
      pageSize: coursePageSize,
      searchTerm: courseSearch,
      isActive: true,
    })
      .then((data) => {
        setCourseList(data.items);
        setCourseTotal(data.totalCount || 0);
        setCourseLoading(false);
      })
      .catch(() => setCourseLoading(false));
  }, [coursePage, coursePageSize, courseSearch]);

  // Add course to program
  const handleAddCourse = (course) => {
    if (programCourses.some((c) => c.courseId === course.id)) return;
    setProgramCourses([
      ...programCourses,
      {
        courseId: course.id,
        order: programCourses.length + 1,
        name: course.name,
      },
    ]);
  };

  // Remove course from program
  const handleRemoveCourse = (courseId) => {
    setProgramCourses(programCourses.filter((c) => c.courseId !== courseId));
  };

  // Change course order
  const handleOrderChange = (courseId, order) => {
    setProgramCourses(
      programCourses.map((c) =>
        c.courseId === courseId ? { ...c, order: Number(order) } : c
      )
    );
  };

  // Entry requirement handlers
  const handleAddEntryRequirement = () => {
    setEntryRequirements([
      ...entryRequirements,
      { name: "", description: "", documentUrl: "" },
    ]);
  };
  const handleRemoveEntryRequirement = (idx) => {
    setEntryRequirements(entryRequirements.filter((_, i) => i !== idx));
  };
  const handleEntryRequirementChange = (idx, field, value) => {
    setEntryRequirements(
      entryRequirements.map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      )
    );
  };

  // Submit update
  const handleSubmit = async (values) => {
    setSaving(true);
    setCoursesError(null);
    try {
      // 1. Update basic info
      await updateProgramBasic(id, {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl,
        isActive: values.isActive,
      });

      // 2. Update courses
      try {
        await updateProgramCourses(
          id,
          programCourses.map((c) => ({
            courseId: c.courseId,
            order: c.order,
          }))
        );
      } catch (err) {
        setCoursesError(err.message);
        setSaving(false);
        return;
      }

      // 3. Update entry requirements
      await updateProgramEntryRequirements(id, entryRequirements);
      const updated = await fetchProgramDetail(id);
      setProgram(updated);
      setEntryRequirements(
        (updated.prerequisites || []).map((p) => ({
          name: p.name,
          description: p.description,
          documentUrl: p.documentUrl || "",
        }))
      );
      message.success("Program updated!");
      // navigate(-1);
    } catch (err) {
      message.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin className="block mx-auto my-16" />;
  if (error) return <Alert type="error" message={error} className="my-8" />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Program</h1>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Image URL" name="imageUrl">
          <Input />
        </Form.Item>
        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* Courses in program */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Courses in Program</h2>
          {programCourses.length === 0 && (
            <div className="text-gray-500 mb-2">No courses added.</div>
          )}
          {programCourses.map((c, idx) => (
            <div key={c.courseId} className="flex items-center gap-2 mb-2">
              <span className="w-6 text-right">{idx + 1}.</span>
              <span className="flex-1">{c.name}</span>
              <Input
                type="number"
                min={1}
                value={c.order}
                onChange={(e) => handleOrderChange(c.courseId, e.target.value)}
                style={{ width: 60 }}
              />
              <Button
                danger
                size="small"
                onClick={() => handleRemoveCourse(c.courseId)}
              >
                Remove
              </Button>
            </div>
          ))}
          {coursesError && (
            <Alert
              type="error"
              message={coursesError}
              className="mb-2"
              showIcon
            />
          )}
        </div>

        {/* Course selection */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Add Course</h2>
          <Input.Search
            placeholder="Search courses"
            value={courseSearch}
            onChange={(e) => {
              setCourseSearch(e.target.value);
              setCoursePage(1);
            }}
            style={{ maxWidth: 300, marginBottom: 8 }}
            allowClear
          />
          <div className="border rounded p-2 bg-gray-50">
            {courseLoading ? (
              <Spin />
            ) : (
              courseList.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between py-1 border-b last:border-b-0"
                >
                  <span>
                    {course.name}{" "}
                    <span className="text-xs text-gray-500">
                      ({course.categoryName} - {course.levelName})
                    </span>
                  </span>
                  <Button
                    size="small"
                    onClick={() => handleAddCourse(course)}
                    disabled={programCourses.some(
                      (c) => c.courseId === course.id
                    )}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
            <div className="flex justify-center mt-2">
              <Pagination
                current={coursePage}
                pageSize={coursePageSize}
                total={courseTotal}
                onChange={(page, size) => {
                  setCoursePage(page);
                  setCoursePageSize(size);
                }}
                showSizeChanger
                pageSizeOptions={["5", "10", "20"]}
              />
            </div>
          </div>
        </div>

        {/* Entry Requirements */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Entry Requirements</h2>
          {entryRequirements.map((pre, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <Input
                placeholder="Name"
                value={pre.name}
                onChange={(e) =>
                  handleEntryRequirementChange(idx, "name", e.target.value)
                }
                style={{ width: 120 }}
              />
              <Input
                placeholder="Description"
                value={pre.description}
                onChange={(e) =>
                  handleEntryRequirementChange(
                    idx,
                    "description",
                    e.target.value
                  )
                }
                style={{ flex: 1 }}
              />
              <Input
                placeholder="Document URL"
                value={pre.documentUrl}
                onChange={(e) =>
                  handleEntryRequirementChange(
                    idx,
                    "documentUrl",
                    e.target.value
                  )
                }
                style={{ width: 180 }}
              />
              <Button
                danger
                size="small"
                onClick={() => handleRemoveEntryRequirement(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button size="small" onClick={handleAddEntryRequirement}>
            + Add Entry Requirement
          </Button>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Update Program
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProgramEdit;
