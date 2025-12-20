import {
  Alert,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { createClass } from "../../../../apis/ProgramManager/ClassApi";
import { fetchAvailablePrograms } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { fetchAvailableCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";
import { Plus, X, Users, Code, Calendar, BookOpen, Layers, FileText } from "lucide-react";

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
      const apiError = err?.response?.data;
      setError(
        (typeof apiError === 'string' ? apiError : apiError?.message) ||
        err?.message ||
        t('admin.classes.createError')
      );
    } finally {
      setSaving(false);
    }
  };

  const disabledStartDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue('startDate');
    if (current && current < dayjs().startOf('day')) {
      return true;
    }
    if (startDate) {
      return current && current <= startDate.endOf('day');
    }
    return false;
  };

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-neutral-200 col-span-2">
      <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center">
        <Icon className="w-4 h-4 text-black" />
      </div>
      <span className="font-bold text-sm uppercase tracking-wider text-black">{title}</span>
    </div>
  );

  const formContent = (
    <>
      {/* Industrial Form Styles */}
      <style>{`
        .industrial-class-form .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #171717 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .industrial-class-form .ant-input,
        .industrial-class-form .ant-input-affix-wrapper,
        .industrial-class-form .ant-input-number,
        .industrial-class-form .ant-select-selector,
        .industrial-class-form .ant-picker {
          border-radius: 0 !important;
          border-width: 2px !important;
        }
        .industrial-class-form .ant-input:focus,
        .industrial-class-form .ant-input-affix-wrapper-focused,
        .industrial-class-form .ant-input-number-focused,
        .industrial-class-form .ant-select-focused .ant-select-selector,
        .industrial-class-form .ant-picker-focused {
          border-color: #facc15 !important;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.25) !important;
        }
        .industrial-class-form textarea.ant-input {
          border-radius: 0 !important;
        }
      `}</style>

      {error && (
        <Alert type="error" message={error} showIcon className="mb-4" />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="industrial-class-form grid grid-cols-1 md:grid-cols-2 gap-x-6"
        initialValues={{
          capacity: 10,
          startDate: dayjs(),
          endDate: dayjs().add(1, "month"),
          courseId: programCourseId,
        }}
      >
        {/* Basic Information Section */}
        <SectionHeader icon={Users} title={t('admin.classes.form.basicInfo') || "Basic Information"} />

        <Form.Item
          label={t('admin.classes.form.className')}
          name="name"
          rules={[{ required: true, message: t('admin.classes.form.classNameRequired') }]}
        >
          <Input
            placeholder={t('admin.classes.form.classNamePlaceholder')}
            showCount
            maxLength={120}
            allowClear
            prefix={<Users className="w-4 h-4 text-neutral-400" />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.classes.form.classCode')}
          name="classCode"
          rules={[{ required: true, message: t('admin.classes.form.classCodeRequired') }]}
        >
          <Input
            placeholder={t('admin.classes.form.classCodePlaceholder')}
            showCount
            allowClear
            maxLength={50}
            prefix={<Code className="w-4 h-4 text-neutral-400" />}
          />
        </Form.Item>

        {/* Program & Course Section */}
        <SectionHeader icon={BookOpen} title={t('admin.classes.form.programCourse') || "Program & Course"} />

        {/* Program Selection */}
        <Form.Item
          label={t('admin.classes.form.program')}
          name="programId"
          rules={[{ required: true, message: t('admin.classes.form.programRequired') }]}
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
            suffixIcon={<Layers className="w-4 h-4 text-neutral-400" />}
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

        {/* Schedule Section */}
        <SectionHeader icon={Calendar} title={t('admin.classes.form.schedule') || "Schedule"} />

        <Form.Item
          label={t('admin.classes.form.startDate')}
          name="startDate"
          rules={[{ required: true, message: t('admin.classes.form.startDateRequired') }]}
        >
          <DatePicker className="w-full" disabledDate={disabledStartDate} />
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
        >
          <DatePicker className="w-full" disabledDate={disabledEndDate} />
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
        >
          <InputNumber min={1} max={50} className="w-full" />
        </Form.Item>

        {/* Keep empty space for grid alignment */}
        <div className="hidden md:block" />

        {/* Description Section */}
        <SectionHeader icon={FileText} title={t('common.description')} />

        <Form.Item name="description" className="col-span-2">
          <Input.TextArea rows={4} placeholder={t('common.description')} showCount maxLength={500} allowClear />
        </Form.Item>

        {/* Buttons */}
        <div className="col-span-2 flex items-center justify-end gap-3 pt-4 border-t-2 border-neutral-200 mt-2">
          <button
            type="button"
            onClick={onCancel || onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-700 font-semibold text-sm border-2 border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all"
          >
            <X className="w-4 h-4" />
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={embedded ? confirmLoading : saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-bold text-sm border-2 border-black hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
          >
            {(embedded ? confirmLoading : saving) ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {embedded ? t('admin.classes.createClass') : t('admin.classes.addClass')}
          </button>
        </div>
      </Form>
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Modal
      open={open}
      title={null}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
      closable={false}
      styles={{
        content: { borderRadius: 0, border: '3px solid #000', padding: 0, overflow: 'hidden' },
        body: { padding: 0 },
      }}
    >
      {/* Custom Header */}
      <div className="relative">
        <div className="h-1.5 bg-yellow-400" />
        <div className="bg-black px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white m-0">
                {t('admin.classes.addClass')}
              </h3>
              <p className="text-neutral-400 text-sm m-0 mt-1">{t('admin.classes.form.subtitle') || 'Fill in the class details'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border-2 border-white/50 hover:bg-yellow-400 hover:border-yellow-400 transition-all group"
          >
            <X className="w-5 h-5 text-white group-hover:text-black" />
          </button>
        </div>
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
      </div>

      {/* Form Content */}
      <div className="p-6">
        {formContent}
      </div>
    </Modal>
  );
};

export default AddClassForm;