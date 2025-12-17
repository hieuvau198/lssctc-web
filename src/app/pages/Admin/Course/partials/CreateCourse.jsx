import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, Select, Image, message } from "antd";
import { fetchCourseCategories, fetchCourseLevels } from "../../../../apis/ProgramManager/CourseApi";
import { Plus, X, ImageIcon, FileImage, BookOpen, Tag, Clock, DollarSign, Layers, Code } from "lucide-react";

const { Option } = Select;

const CreateCourse = ({
  open,
  onCancel,
  onCreate,
  confirmLoading,
  categories = [],
  levels = [],
  embedded = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState("");
  const [bgImagePreview, setBgImagePreview] = useState("");
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localLevels, setLocalLevels] = useState(levels || []);
  const [catsLoading, setCatsLoading] = useState(false);
  const [lvlsLoading, setLvlsLoading] = useState(false);

  useEffect(() => {
    const init = form.getFieldValue("imageUrl");
    if (init) setImagePreview(init);
    const initBg = form.getFieldValue("backgroundImageUrl");
    if (initBg) setBgImagePreview(initBg);
  }, [form]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setCatsLoading(true);
      try {
        const data = await fetchCourseCategories();
        if (!mounted) return;
        const mapped = data.map((c) => ({ value: c.id, label: c.name }));
        setLocalCategories(mapped);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        if (mounted) setCatsLoading(false);
      }
    }

    async function loadLevels() {
      setLvlsLoading(true);
      try {
        const data = await fetchCourseLevels();
        if (!mounted) return;
        const mapped = data.map((l) => ({ value: l.id, label: l.name }));
        setLocalLevels(mapped);
      } catch (err) {
        console.error('Failed to load levels', err);
      } finally {
        if (mounted) setLvlsLoading(false);
      }
    }

    loadCategories();
    loadLevels();

    return () => { mounted = false; };
  }, []);

  const handleFinish = (values) => {
    onCreate(values);
  };

  const handleFinishFailed = (errorInfo) => {
    const errorMessages = errorInfo.errorFields.map(field => field.errors[0]).join(". ");
    message.error(`${t('common.reqField') || t('admin.courses.form.validationFailed')}: ${errorMessages}`);
  };

  const handleOk = () => {
    form.submit();
  };

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-neutral-200">
      <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center">
        <Icon className="w-4 h-4 text-black" />
      </div>
      <span className="font-bold text-sm uppercase tracking-wider text-black">{title}</span>
    </div>
  );

  const formContent = (
    <>
      <style>{`
        .industrial-course-form .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #171717 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .industrial-course-form .ant-input,
        .industrial-course-form .ant-input-affix-wrapper,
        .industrial-course-form .ant-input-number,
        .industrial-course-form .ant-select-selector {
          border-radius: 0 !important;
          border-width: 2px !important;
        }
        .industrial-course-form .ant-input:focus,
        .industrial-course-form .ant-input-affix-wrapper-focused,
        .industrial-course-form .ant-input-number-focused,
        .industrial-course-form .ant-select-focused .ant-select-selector {
          border-color: #facc15 !important;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.25) !important;
        }
        .industrial-course-form textarea.ant-input {
          border-radius: 0 !important;
        }
      `}</style>

      <Form
        form={form}
        layout="vertical"
        className="industrial-course-form"
        initialValues={{
          name: "",
          courseCode: "",
          description: "",
          categoryId: undefined,
          levelId: undefined,
          price: undefined,
          imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2sUcEWdSaINXf8E4hmy7obh3B1w0-l_T8Tw&s",
          backgroundImageUrl: "https://templates.framework-y.com/lightwire/images/wide-1.jpg",
          durationHours: undefined,
        }}
        disabled={confirmLoading}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        scrollToFirstError
      >
        {/* Basic Information Section */}
        <SectionHeader icon={BookOpen} title="Basic Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mb-6">
          <Form.Item
            label={t('admin.courses.form.name')}
            name="name"
            rules={[
              { required: true, message: t('admin.courses.form.nameRequired') },
              { min: 3, message: t('admin.courses.form.nameMin') },
              { max: 200, message: t('admin.courses.form.nameMax') }
            ]}
          >
            <Input showCount maxLength={200} placeholder={t('admin.courses.form.namePlaceholder')}
              prefix={<BookOpen className="w-4 h-4 text-neutral-400" />} />
          </Form.Item>

          <Form.Item
            label={t('admin.courses.form.courseCode')}
            name="courseCode"
            rules={[
              { required: true, message: t('admin.courses.form.courseCodeRequired') },
              { max: 50, message: t('admin.courses.form.courseCodeMax') }
            ]}
          >
            <Input showCount maxLength={50} placeholder={t('admin.courses.form.courseCodePlaceholder')}
              prefix={<Code className="w-4 h-4 text-neutral-400" />} />
          </Form.Item>
        </div>

        {/* Classification Section */}
        <SectionHeader icon={Tag} title="Classification" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mb-6">
          <Form.Item
            label={t('common.category')}
            name="categoryId"
            rules={[{ required: true, message: t('admin.courses.form.categoryRequired') }]}
          >
            <Select placeholder={t('admin.courses.form.categoryPlaceholder')} showSearch allowClear loading={catsLoading} optionFilterProp="children">
              {localCategories.map((cat) => (<Option key={cat.value} value={cat.value}>{cat.label}</Option>))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t('common.level')}
            name="levelId"
            rules={[{ required: true, message: t('admin.courses.form.levelRequired') }]}
          >
            <Select placeholder={t('admin.courses.form.levelPlaceholder')} showSearch allowClear loading={lvlsLoading} optionFilterProp="children">
              {localLevels.map((lvl) => (<Option key={lvl.value} value={lvl.value}>{lvl.label}</Option>))}
            </Select>
          </Form.Item>

          <Form.Item label={t('common.price')} name="price"
            rules={[{ type: 'number', min: 0, max: 1000000000, message: t('admin.courses.form.priceRange') }]}>
            <InputNumber step={0.01} style={{ width: "100%" }} prefix={<DollarSign className="w-4 h-4 text-neutral-400" />} />
          </Form.Item>

          <Form.Item label={t('admin.courses.form.durationHours')} name="durationHours"
            rules={[{ required: true, message: t('admin.courses.form.durationRequired') }]}>
            <InputNumber style={{ width: "100%" }} min={1} placeholder="e.g. 40" prefix={<Clock className="w-4 h-4 text-neutral-400" />} />
          </Form.Item>
        </div>

        {/* Images Section */}
        <SectionHeader icon={ImageIcon} title="Course Images" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Main Image */}
          <div className="border-2 border-neutral-200 p-4 bg-white hover:border-yellow-400 transition-colors">
            <Form.Item label={t('admin.courses.form.imageUrl')} name="imageUrl" className="mb-3"
              rules={[
                { required: true, message: t('admin.courses.form.imageUrlRequired') },
                { type: 'url', message: t('admin.courses.form.imageUrlInvalid') }
              ]}>
              <Input placeholder="https://example.com/image.jpg" onChange={(e) => setImagePreview(e.target.value)} />
            </Form.Item>
            <div className="text-xs font-bold uppercase text-neutral-500 mb-2 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> {t('admin.courses.form.preview')}
            </div>
            <div className="w-full h-40 flex items-center justify-center bg-neutral-100 border-2 border-neutral-200 overflow-hidden">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-neutral-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs font-medium">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Background Image */}
          <div className="border-2 border-neutral-700 p-4 bg-neutral-900 hover:border-yellow-400 transition-colors">
            <Form.Item label={<span className="text-white">Background Image URL</span>} name="backgroundImageUrl" className="mb-3"
              rules={[{ type: 'url', message: t('admin.courses.form.urlInvalid') }]}>
              <Input placeholder="https://example.com/bg-image.jpg" onChange={(e) => setBgImagePreview(e.target.value)} />
            </Form.Item>
            <div className="text-xs font-bold uppercase text-neutral-400 mb-2 flex items-center gap-1">
              <FileImage className="w-3 h-3" /> Background Preview
            </div>
            <div className="w-full h-40 flex items-center justify-center bg-neutral-800 border-2 border-neutral-700 overflow-hidden">
              {bgImagePreview ? (
                <Image src={bgImagePreview} alt="Background Preview" className="object-cover w-full h-full" />
              ) : (
                <div className="flex flex-col items-center text-neutral-500">
                  <FileImage className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs font-medium">No background</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <SectionHeader icon={Layers} title="Description" />
        <Form.Item name="description"
          rules={[
            { required: true, message: t('admin.courses.form.descriptionRequired') },
            { max: 1000, message: t('admin.courses.form.descriptionMax') }
          ]}>
          <Input.TextArea rows={4} showCount maxLength={1000} placeholder={t('admin.courses.form.descriptionPlaceholder')} />
        </Form.Item>

        {embedded && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-neutral-200 mt-6">
            <button type="button" onClick={onCancel}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-700 font-semibold text-sm border-2 border-neutral-300 hover:border-black transition-all">
              <X className="w-4 h-4" /> {t('common.cancel')}
            </button>
            <button type="submit" disabled={confirmLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-bold text-sm border-2 border-black hover:bg-yellow-500 transition-all disabled:opacity-50">
              {confirmLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
              {t('admin.courses.addCourse')}
            </button>
          </div>
        )}
      </Form>
    </>
  );

  if (embedded) return formContent;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      width={900}
      footer={null}
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
              <BookOpen className="w-7 h-7 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-white m-0">
                {t('admin.courses.addNewCourse')}
              </h3>
              <p className="text-neutral-400 text-sm m-0 mt-1">Fill in the course details below</p>
            </div>
          </div>
          <button onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center border-2 border-white/50 text-white hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
      </div>

      {/* Form Content */}
      <div className="p-6">{formContent}</div>

      {/* Custom Footer */}
      <div className="bg-neutral-100 border-t-2 border-black px-6 py-4 flex items-center justify-end gap-3">
        <button onClick={onCancel}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-700 font-semibold text-sm border-2 border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all">
          <X className="w-4 h-4" /> {t('common.cancel')}
        </button>
        <button onClick={handleOk} disabled={confirmLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-bold text-sm border-2 border-black hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5">
          {confirmLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          {t('admin.courses.addCourse')}
        </button>
      </div>
    </Modal>
  );
};

export default CreateCourse;