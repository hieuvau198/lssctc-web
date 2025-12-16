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
import { useTranslation } from 'react-i18next';
import { createClass } from "../../../../apis/ProgramManager/ClassApi";
import { fetchAvailablePrograms } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { fetchAvailableCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";

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
  const { t } = useTranslation();
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
      fetchAvailablePrograms()
        .then((data) => {
          setPrograms(data || []);
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
        fetchAvailableCoursesByProgram(initialProgram)
          .then((data) => setCourses(data || []))
          .catch((err) => console.error('Failed to fetch courses:', err))
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
    fetchAvailableCoursesByProgram(programId)
      .then((data) => {
        setCourses(data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
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
        err?.response?.data?.message || err?.message || t('admin.classes.createError')
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
          label={t('admin.classes.form.className')}
          name="name"
          rules={[{ required: true, message: t('admin.classes.form.classNameRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder={t('admin.classes.form.classNamePlaceholder')} showCount maxLength={120} allowClear />
        </Form.Item>

        <Form.Item
          label={t('admin.classes.form.classCode')}
          name="classCode"
          rules={[{ required: true, message: t('admin.classes.form.classCodeRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder={t('admin.classes.form.classCodePlaceholder')} showCount allowClear maxLength={50} />
        </Form.Item>

        {/* Program Selection */}
        <Form.Item
          label={t('admin.classes.form.program')}
          name="programId"
          rules={[{ required: true, message: t('admin.classes.form.programRequired') }]}
          className={embedded ? 'md:col-span-1' : undefined}
        >
          <Select
            placeholder={t('admin.classes.form.programPlaceholder')}
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
            label={t('admin.classes.form.course')}
            name="courseId"
            rules={[{ required: true, message: t('admin.classes.form.courseRequired') }]}
            className={embedded ? "md:col-span-1" : undefined}
          >
            <Select
              placeholder={t('admin.classes.form.coursePlaceholder')}
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
                  {course.name} ({course.level})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label={t('admin.classes.form.startDate')}
          name="startDate"
          rules={[{ required: true, message: t('admin.classes.form.startDateRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label={t('admin.classes.form.endDate')}
          name="endDate"
          rules={[
            { required: true, message: t('admin.classes.form.endDateRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue('startDate');
                if (!value || !start) return Promise.resolve();
                if (value.isAfter(start)) return Promise.resolve();
                return Promise.reject(new Error(t('admin.classes.form.endDateAfterStart')));
              }
            })
          ]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        
        <Form.Item
          label={t('admin.classes.columns.capacity')}
          name="capacity"
          rules={[
            {
              required: true,
              type: "number",
              min: 10,
              max: 50,
              message: t('admin.classes.form.capacityRequired'),
            },
          ]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <InputNumber min={1} max={50} className="w-full" />
        </Form.Item>

        <Form.Item label={t('common.description')} name="description" className={embedded ? "md:col-span-2" : undefined}>
          <Input.TextArea rows={3} placeholder={t('common.description')} showCount maxLength={500} allowClear />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={onCancel || onClose}>{t('common.cancel')}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={embedded ? confirmLoading : saving}
            >
              {embedded ? t('admin.classes.createClass') : t('admin.classes.addClass')}
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
      title={t('admin.classes.addClass')}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {formContent}
    </Modal>
  );
};

export default AddClassForm;