import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { createClass } from "../../../../apis/ProgramManager/ClassApi";
import { fetchCourses, fetchPrograms } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { fetchCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";

const AddClassForm = ({
  open,
  onClose,
  onCancel,
  onCreate,
  confirmLoading,
  embedded = false,
  programCourseId,
  onCreated
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Fetch programs on open. Courses are loaded after choosing a program.
  useEffect(() => {
    if (open) {
      setLoadingPrograms(true);
      fetchPrograms({ pageNumber: 1, pageSize: 100 })
        .then((data) => {
          setPrograms(data.items || []);
        })
        .catch((err) => {
          console.error('Failed to fetch programs:', err);
        })
        .finally(() => {
          setLoadingPrograms(false);
        });

      // If there is an initial program selected in the form, load its courses
      const initialProgram = form.getFieldValue('programId');
      if (initialProgram) {
        setSelectedProgram(initialProgram);
        setLoadingCourses(true);
        fetchCoursesByProgram(initialProgram)
          .then((data) => setCourses(data.items || []))
          .catch((err) => console.error('Failed to fetch courses by program:', err))
          .finally(() => setLoadingCourses(false));
      }
    }
  }, [open]);

  const handleProgramChange = (programId) => {
    setSelectedProgram(programId || null);
    // clear selected course when program changes
    form.setFieldsValue({ courseId: undefined });
    if (!programId) {
      setCourses([]);
      return;
    }

    setLoadingCourses(true);
    fetchCoursesByProgram(programId)
      .then((data) => {
        setCourses(data.items || []);
      })
      .catch((err) => {
        console.error('Failed to fetch courses by program:', err);
        setCourses([]);
      })
      .finally(() => setLoadingCourses(false));
  };

  const handleFinish = async (values) => {
    if (embedded && onCreate) {
      // Use the parent's handler
      onCreate(values);
      return;
    }

    // Original modal logic
    setSaving(true);
    setError(null);
    try {
      await createClass({
        classCode: values.classCode,
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        capacity: values.capacity,
        programId: values.programId,
        courseId: values.courseId || programCourseId, // Send courseId (use programCourseId as fallback)
        description: values.description,
      });
      form.resetFields();
      onCreated?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to create class"
      );
    } finally {
      setSaving(false);
    }
  };

  const formContent = (
    <>
      {error && (
        <Alert type="error" message={error} showIcon className="mb-2" />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className={embedded ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" : undefined}
        initialValues={{
          capacity: 10,
          startDate: dayjs(),
          endDate: dayjs().add(1, "month"),
          courseId: programCourseId, // Set default courseId if programCourseId is provided
        }}
      >
        <Form.Item
          label="Class Name"
          name="name"
          rules={[{ required: true, message: "Please enter class name" }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder="Class name" showCount maxLength={120} allowClear />
        </Form.Item>

        <Form.Item
          label="Class Code"
          name="classCode"
          rules={[{ required: true, message: "Please enter class code" }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder="Class code" showCount allowClear maxLength={50} />
        </Form.Item>

        {/* Program Selection */}
        <Form.Item
          label="Program"
          name="programId"
          rules={[{ required: true, message: 'Please select a program' }]}
          className={embedded ? 'md:col-span-1' : undefined}
        >
          <Select
            placeholder="Select a program"
            loading={loadingPrograms}
            showSearch
            allowClear
            optionFilterProp="children"
            onChange={handleProgramChange}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {programs.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Course Selection - only show if not in program context */}
        {!programCourseId && (
          <Form.Item
            label="Course"
            name="courseId"
            rules={[{ required: true, message: "Please select a course" }]}
            className={embedded ? "md:col-span-1" : undefined}
          >
            <Select
              placeholder="Select a course"
              loading={loadingCourses}
              disabled={!selectedProgram}
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {courses.map((course) => (
                <Select.Option key={course.id} value={course.id}>
                  {course.name} ({course.courseCodeName})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select start date" }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[
            { required: true, message: "Please select end date" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue('startDate');
                if (!value || !start) return Promise.resolve();
                if (value.isAfter(start)) return Promise.resolve();
                return Promise.reject(new Error('End date must be after start date'));
              }
            })
          ]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        
        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[
            {
              required: true,
              type: "number",
              min: 10,
              max: 50,
              message: "Capacity must be at least 10",
            },
          ]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <InputNumber min={1} max={50} className="w-full" />
        </Form.Item>

        <Form.Item label="Description" name="description" className={embedded ? "md:col-span-2" : undefined}>
          <Input.TextArea rows={3} placeholder="Description" showCount maxLength={500} allowClear />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={onCancel || onClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={embedded ? confirmLoading : saving}
            >
              {embedded ? "Create Class" : "Add Class"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Modal
      open={open}
      title="Add Class"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {formContent}
    </Modal>
  );
};

export default AddClassForm;
