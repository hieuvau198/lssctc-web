import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import {
  deleteClass,
  updateClass,
} from "../../../../apis/ProgramManager/ClassApi";
import { fetchCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";
import { fetchPrograms } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { getClassStatus } from "../../../../utils/classStatus";

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
 * @param {boolean} props.showDelete
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
  showDelete = true,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Check if class is in Draft status
  const isDraft = classItem ? getClassStatus(classItem.status).key === 'Draft' : true;

  const handleFinish = async (values) => {
    // If onUpdate is provided, let the parent handle it
    if (onUpdate) {
      onUpdate(values);
      return;
    }

    // Default internal logic
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
        programId: values.programId,
        courseId: values.courseId,
        backgroundImageUrl: values.backgroundImageUrl, // Added field
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data || err?.message || t('admin.classes.messages.updateFailed')
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
        err?.response?.data || err?.message || t('admin.classes.messages.deleteFailed')
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
        programId: classItem?.programId || null,
        courseId:
          classItem?.programCourseId || classItem?.courseId || classItem?.course?.id || classItem?.programCourse?.id || null,
        backgroundImageUrl: classItem?.backgroundImageUrl || "", // Initialize field
      });
    }
  }, [classItem, form]);

  useEffect(() => {
    const shouldFetchPrograms = open || embedded;
    if (shouldFetchPrograms) {
      setLoadingPrograms(true);
      fetchPrograms({ pageNumber: 1, pageSize: 200 })
        .then((data) => setPrograms(data.items || []))
        .catch((err) => console.error('Failed to fetch programs', err))
        .finally(() => setLoadingPrograms(false));
    }

    const pid = classItem?.programId || null;
    if (pid) {
      setSelectedProgram(pid);
      setLoadingCourses(true);
      fetchCoursesByProgram(pid)
        .then((data) => setCourses(data.items || []))
        .catch((err) => {
          console.error('Failed to fetch courses by program', err);
          setCourses([]);
        })
        .finally(() => setLoadingCourses(false));
    } else {
      setCourses([]);
    }
  }, [open, classItem, embedded]);

  const handleProgramChange = (programId) => {
    setSelectedProgram(programId || null);
    form.setFieldsValue({ courseId: undefined });
    if (!programId) {
      setCourses([]);
      return;
    }
    setLoadingCourses(true);
    fetchCoursesByProgram(programId)
      .then((data) => setCourses(data.items || []))
      .catch((err) => {
        console.error('Failed to fetch courses by program', err);
        setCourses([]);
      })
      .finally(() => setLoadingCourses(false));
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
        className={embedded ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2" : undefined}
      >
        <Form.Item
          label={t('admin.classes.form.className')}
          name="name"
          rules={[{ required: true, message: t('admin.classes.validation.classNameRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder={t('admin.classes.placeholders.className')} allowClear showCount maxLength={120} />
        </Form.Item>
        
        {/* Class Code - Disabled */}
        <Form.Item
          label={t('admin.classes.form.classCode')}
          name="classCode"
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input disabled placeholder={t('admin.classes.placeholders.classCode')} />
        </Form.Item>

        <Form.Item
          label={t('admin.classes.form.program')}
          name="programId"
          rules={[{ required: true, message: t('admin.classes.validation.programRequired') }]}
          className={embedded ? 'md:col-span-1' : undefined}
        >
          <Select
            placeholder={t('admin.classes.placeholders.selectProgram')}
            loading={loadingPrograms}
            showSearch
            allowClear
            optionFilterProp="children"
            onChange={handleProgramChange}
            disabled={!isDraft} // Prevent changing structure if not draft
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

        <Form.Item
          label={t('admin.classes.form.course')}
          name="courseId"
          rules={[{ required: true, message: t('admin.classes.validation.courseRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Select
            placeholder={t('admin.classes.placeholders.selectCourse')}
            loading={loadingCourses}
            disabled={!selectedProgram || !isDraft} // Prevent changing structure if not draft
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {courses.map((course) => (
              <Select.Option key={course.id} value={course.id}>
                {course.name} ({course.level})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Start Date - Disabled unless Draft */}
        <Form.Item
          label={t('admin.classes.form.startDate')}
          name="startDate"
          rules={[{ required: true, message: t('admin.classes.validation.startDateRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <DatePicker className="w-full" disabled={!isDraft} />
        </Form.Item>
        
        {/* End Date - Disabled unless Draft */}
        <Form.Item
          label={t('admin.classes.form.endDate')}
          name="endDate"
          rules={[
            { required: true, message: t('admin.classes.validation.endDateRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue('startDate');
                if (!value || !start) return Promise.resolve();
                if (value.isAfter(start)) return Promise.resolve();
                return Promise.reject(new Error(t('admin.classes.validation.endDateAfterStart')));
              }
            })
          ]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <DatePicker className="w-full" disabled={!isDraft} />
        </Form.Item>

        {/* Capacity - Disabled unless Draft */}
        <Form.Item
          label={t('admin.classes.form.capacity')}
          name="capacity"
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: t('admin.classes.validation.capacityMin'),
            },
          ]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <InputNumber min={1} className="w-full" disabled={!isDraft} />
        </Form.Item>

        {/* Background Image URL - New Field */}
        <Form.Item
          label="Background Image URL"
          name="backgroundImageUrl"
          className={embedded ? "md:col-span-2" : undefined}
        >
          <Input placeholder="Enter image URL" allowClear />
        </Form.Item>

        <Form.Item label={t('admin.classes.form.description')} name="description" className={embedded ? "md:col-span-2" : undefined}>
          <Input.TextArea rows={3} placeholder={t('admin.classes.placeholders.description')} showCount maxLength={500} allowClear />
        </Form.Item>
        <Form.Item className={embedded ? 'md:col-span-2' : undefined}>
          <Space className="flex justify-end">
            <Button onClick={() => {
              if (onCancel) return onCancel();
              if (onClose) return onClose();
              navigate(-1);
            }}>{t('common.cancel')}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={embedded ? confirmLoading : saving}
            >
              {t('admin.classes.buttons.updateClass')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      {!embedded && showDelete && (
        <div className="mt-4">
          {deleteError && (
            <Alert type="error" message={deleteError} showIcon className="mb-2" />
          )}
          <Popconfirm
            title={t('admin.classes.popconfirm.deleteClass')}
            onConfirm={handleDelete}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger loading={deleting} block>
              {t('admin.classes.buttons.deleteClass')}
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
      title={t('admin.classes.modal.editClass')}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {formContent}
    </Modal>
  );
};

export default EditDeleteClassForm;