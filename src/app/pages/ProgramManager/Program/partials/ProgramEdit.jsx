import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Spin, Alert, message } from "antd";
import {
  fetchProgramDetail,
  updateProgramBasic,
  updateProgramCourses,
  updateProgramEntryRequirements,
  fetchCourses,
} from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import ProgramBasicForm from "./ProgramBasicForm";
import ProgramCoursesForm from "./ProgramCoursesForm";
import ProgramEntryRequirementsForm from "./ProgramEntryRequirementsForm";

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
          (data.courses || []).map((c, idx) => ({
            courseId: c.coursesId || c.id,
            order: idx + 1,
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
    const filtered = programCourses.filter((c) => c.courseId !== courseId);
    setProgramCourses(
      filtered.map((c, idx) => ({
        ...c,
        order: idx + 1,
      }))
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

      // 2. Update courses (always use latest order)
      try {
        await updateProgramCourses(
          id,
          programCourses.map((c, idx) => ({
            courseId: c.courseId,
            order: idx + 1,
          }))
        );
      } catch (err) {
        setCoursesError(err.message);
        // Re-fetch program detail to reset programCourses to backend state
        const data = await fetchProgramDetail(id);
        setProgramCourses(
          (data.courses || []).map((c, idx) => ({
            courseId: c.coursesId || c.id,
            order: idx + 1,
            name: c.name,
          }))
        );
        setSaving(false);
        return;
      }

      // 3. Update entry requirements
      await updateProgramEntryRequirements(id, entryRequirements);
      const updated = await fetchProgramDetail(id);
      setProgram(updated);
      setEntryRequirements(
        (updated.entryRequirements || []).map((p) => ({
          name: p.name,
          description: p.description,
          documentUrl: p.documentUrl || "",
        }))
      );
      message.success("Program updated!");
      navigate(-1);
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
        <ProgramBasicForm form={form} loading={loading} />
        <ProgramCoursesForm
          programCourses={programCourses}
          setProgramCourses={setProgramCourses}
          handleRemoveCourse={handleRemoveCourse}
          coursesError={coursesError}
          courseSearch={courseSearch}
          setCourseSearch={setCourseSearch}
          courseList={courseList}
          courseLoading={courseLoading}
          handleAddCourse={handleAddCourse}
          coursePage={coursePage}
          setCoursePage={setCoursePage}
          coursePageSize={coursePageSize}
          setCoursePageSize={setCoursePageSize}
          courseTotal={courseTotal}
        />
        <ProgramEntryRequirementsForm
          entryRequirements={entryRequirements}
          handleEntryRequirementChange={handleEntryRequirementChange}
          handleRemoveEntryRequirement={handleRemoveEntryRequirement}
          handleAddEntryRequirement={handleAddEntryRequirement}
        />
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
