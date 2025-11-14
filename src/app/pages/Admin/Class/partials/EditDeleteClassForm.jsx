import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Alert,
  Popconfirm,
  Space,
  Select,
} from "antd";
import dayjs from "dayjs";
import {
  updateClass,
  deleteClass,
} from "../../../../apis/ProgramManager/ClassApi";

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Function} props.onCancel
 * @param {Function} props.onUpdate
 * @param {boolean} props.confirmLoading
 * @param {boolean} props.embedded
 * @param {Object} props.classItem
 * @param {Function} props.onUpdated
 * @param {Function} props.onDeleted
 */
const EditDeleteClassForm = ({
  open,
  onClose,
  onCancel,
  onUpdate,
  confirmLoading,
  embedded = false,
  classItem,
  onUpdated,
  onDeleted,
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const handleFinish = async (values) => {
    if (embedded && onUpdate) {
      // Use the parent's handler
      onUpdate(values);
      return;
    }

    // Original modal logic
    setSaving(true);
    setError(null);
    try {
      await updateClass(classItem.id, {
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        capacity: values.capacity,
        description: values.description,
        classCode: values.classCode,
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to update class"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteClass(classItem.id);
      onDeleted?.();
      onClose();
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || err?.message || "Failed to delete class"
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (classItem) {
      form.setFieldsValue({
        name: classItem?.name,
        startDate: classItem?.startDate ? dayjs(classItem.startDate) : null,
        endDate: classItem?.endDate ? dayjs(classItem.endDate) : null,
        capacity: classItem?.capacity,
        description: classItem?.description,
        classCode: classItem?.classCode?.name || classItem?.classCode || "",
        courseId:
          classItem?.programCourseId || classItem?.courseId || classItem?.course?.id || classItem?.programCourse?.id || null,
      });
    }
  }, [classItem, form]);

  useEffect(() => {
    let mounted = true;
    async function loadCourses() {
      setLoadingCourses(true);
      try {
        const data = await (await import('../../../../apis/ProgramManager/ProgramManagerCourseApi')).fetchCourses({ pageNumber: 1, pageSize: 200 });
        if (!mounted) return;
        setCourses(data.items || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    }
    loadCourses();
    return () => { mounted = false; };
  }, []);

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
      >
        <Form.Item
          label="Class Name"
          name="name"
          rules={[{ required: true, message: "Please enter class name" }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder="Class name" />
        </Form.Item>
        <Form.Item
          label="Class Code"
          name="classCode"
          rules={[{ required: true, message: "Please enter class code" }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder="Class code" />
        </Form.Item>

        <Form.Item
          label="Course"
          name="courseId"
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Select
            placeholder="Course"
            loading={loadingCourses}
            disabled
            showSearch
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

        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: "Capacity must be at least 1",
            },
          ]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
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
        <Form.Item label="Description" name="description" className={embedded ? "md:col-span-2" : undefined}>
          <Input.TextArea rows={3} placeholder="Description" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={onCancel || onClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={embedded ? confirmLoading : saving}
            >
              Update Class
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {!embedded && (
        <div className="mt-4">
          {deleteError && (
            <Alert type="error" message={deleteError} showIcon className="mb-2" />
          )}
          <Popconfirm
            title="Are you sure to delete this class?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={deleting} block>
              Delete Class
            </Button>
          </Popconfirm>
        </div>
      )}
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Modal
      open={open}
      title="Edit Class"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {formContent}
    </Modal>
  );
};

export default EditDeleteClassForm;
