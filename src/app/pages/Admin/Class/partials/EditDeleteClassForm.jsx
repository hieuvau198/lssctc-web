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
import {
  Save,
  X,
  Trash2,
  Calendar,
  Users,
  Layers,
  FileText,
  Image as ImageIcon
} from "lucide-react";

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

  // --- HELPER TO SAFELY EXTRACT ERROR MESSAGE ---
  const getErrorMessage = (err, fallbackKey) => {
    const data = err?.response?.data;
    if (typeof data === 'string') {
      return data;
    }
    // Try to find common error fields if data is an object
    if (data && typeof data === 'object') {
      return data.message || data.error || data.title || JSON.stringify(data);
    }
    return err?.message || t(fallbackKey);
  };
  // ----------------------------------------------

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
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        capacity: values.capacity,
        description: values.description,
        classCode: values.classCode,
        programId: values.programId,
        courseId: values.courseId,
        backgroundImageUrl: values.backgroundImageUrl,
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      // FIX: Safely extract string message
      setError(getErrorMessage(err, 'admin.classes.updateError'));
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
      // FIX: Safely extract string message
      setDeleteError(getErrorMessage(err, 'admin.classes.deleteError'));
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
        backgroundImageUrl: classItem?.backgroundImageUrl || "",
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

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-neutral-200">
      <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center border-2 border-black">
        <Icon className="w-4 h-4 text-black" />
      </div>
      <span className="font-bold text-sm uppercase tracking-wider text-black">{title}</span>
    </div>
  );

  const formContent = (
    <>
      {/* Industrial Form Styles */}
      <style>{`
        .industrial-form .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #171717 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .industrial-form .ant-input,
        .industrial-form .ant-input-number,
        .industrial-form .ant-picker,
        .industrial-form .ant-select-selector {
          border-radius: 0 !important;
          border-width: 2px !important;
          border-color: #d4d4d4 !important;
          transition: all 0.3s ease !important;
        }
        .industrial-form .ant-input:hover,
        .industrial-form .ant-input-number:hover,
        .industrial-form .ant-picker:hover,
        .industrial-form .ant-select-selector:hover {
          border-color: #000 !important;
        }
        .industrial-form .ant-input:focus,
        .industrial-form .ant-input-focused,
        .industrial-form .ant-input-number-focused,
        .industrial-form .ant-picker-focused,
        .industrial-form .ant-select-focused .ant-select-selector {
          border-color: #facc15 !important;
          box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.2) !important;
        }
        /* Buttons container in modal */
        .industrial-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 2px solid #e5e5e5;
        }
      `}</style>

      {error && (
        <Alert type="error" message={error} showIcon className="mb-4 border-2 border-red-200 bg-red-50 text-red-800 rounded-none" />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className={`industrial-form ${embedded ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2" : ""}`}
      >
        {/* Basic Info */}
        <div className={embedded ? "md:col-span-2" : ""}>
          <SectionHeader icon={FileText} title={t('admin.classes.form.basicInfo')} />
        </div>

        <Form.Item
          label={t('admin.classes.form.className')}
          name="name"
          rules={[{ required: true, message: t('admin.classes.validation.classNameRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input placeholder={t('admin.classes.placeholders.className')} allowClear showCount maxLength={120} />
        </Form.Item>

        <Form.Item
          label={t('admin.classes.form.classCode')}
          name="classCode"
          className={embedded ? "md:col-span-1" : undefined}
        >
          <Input disabled placeholder={t('admin.classes.placeholders.classCode')} className="bg-neutral-100" />
        </Form.Item>

        {/* Program & Course */}
        <div className={embedded ? "md:col-span-2 mt-2" : "mt-2"}>
          <SectionHeader icon={Layers} title={t('admin.classes.form.programAndCourse')} />
        </div>

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
            disabled={!isDraft}
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
            disabled={!selectedProgram || !isDraft}
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

        {/* Schedule & Capacity */}
        <div className={embedded ? "md:col-span-2 mt-2" : "mt-2"}>
          <SectionHeader icon={Calendar} title={t('admin.classes.form.scheduleAndCapacity')} />
        </div>

        <Form.Item
          label={t('admin.classes.form.startDate')}
          name="startDate"
          rules={[{ required: true, message: t('admin.classes.validation.startDateRequired') }]}
          className={embedded ? "md:col-span-1" : undefined}
        >
          <DatePicker className="w-full" format="DD-MM-YYYY" disabled={!isDraft} />
        </Form.Item>

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
          <DatePicker className="w-full" format="DD-MM-YYYY" disabled={!isDraft} />
        </Form.Item>

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
          <InputNumber min={1} className="w-full" disabled={!isDraft} prefix={<Users className="w-4 h-4 text-neutral-400 mr-1" />} />
        </Form.Item>

        {/* Visuals */}
        <div className={embedded ? "md:col-span-2 mt-2" : "mt-2"}>
          <SectionHeader icon={ImageIcon} title={t('admin.classes.visuals.title')} />
        </div>

        <Form.Item
          label={t('admin.classes.visuals.backgroundImageUrl')}
          name="backgroundImageUrl"
          className={embedded ? "md:col-span-2" : undefined}
        >
          <Input placeholder={t('admin.classes.visuals.placeholder')} allowClear prefix={<ImageIcon className="w-4 h-4 text-neutral-400" />} />
        </Form.Item>

        <Form.Item label={t('admin.classes.form.description')} name="description" className={embedded ? "md:col-span-2" : undefined}>
          <Input.TextArea rows={4} placeholder={t('admin.classes.placeholders.description')} showCount maxLength={500} allowClear />
        </Form.Item>

        {/* Actions */}
        <Form.Item className={embedded ? 'md:col-span-2' : undefined}>
          <div className="industrial-footer">
            <button
              type="button"
              onClick={() => {
                if (onCancel) return onCancel();
                if (onClose) return onClose();
                navigate(-1);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-700 font-semibold text-sm border-2 border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all uppercase tracking-wider h-10"
            >
              <X className="w-4 h-4" />
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={embedded ? confirmLoading : saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-bold text-sm border-2 border-black hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg uppercase tracking-wider h-10"
            >
              <Save className="w-4 h-4" />
              {t('admin.classes.buttons.updateClass')}
            </button>
          </div>
        </Form.Item>
      </Form>

      {!embedded && showDelete && (
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="bg-red-50 border-2 border-red-100 p-4">
            <h4 className="text-red-800 font-bold uppercase tracking-wide text-xs mb-2">{t('admin.classes.dangerZone.title')}</h4>
            <p className="text-red-600 text-sm mb-4">{t('admin.classes.dangerZone.description')}</p>
            {deleteError && (
              <Alert type="error" message={deleteError} showIcon className="mb-2" />
            )}
            <Popconfirm
              title={t('admin.classes.popconfirm.deleteClass')}
              onConfirm={handleDelete}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 font-bold text-sm border-2 border-red-200 hover:border-red-600 hover:bg-red-50 transition-all uppercase tracking-wider">
                <Trash2 className="w-4 h-4" />
                {t('admin.classes.buttons.deleteClass')}
              </button>
            </Popconfirm>
          </div>
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
      title={null}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
      className="industrial-modal"
      styles={{
        content: {
          borderRadius: 0,
          border: '2px solid #000',
          padding: 0,
          overflow: 'hidden'
        }
      }}
    >
      {/* Modal Header */}
      <div className="bg-black py-4 px-6 flex items-center justify-between">
        <h3 className="text-white font-bold uppercase tracking-wider text-lg m-0 flex items-center gap-2">
          <Layers className="w-5 h-5 text-yellow-400" />
          {t('admin.classes.modal.editClass')}
        </h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {formContent}
      </div>
    </Modal>
  );
};

export default EditDeleteClassForm;