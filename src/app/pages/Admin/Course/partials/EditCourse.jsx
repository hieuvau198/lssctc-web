// hieuvau198/lssctc-web/lssctc-web-fix-v10/src/app/pages/Admin/Course/partials/EditCourse.jsx

import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, Select, Switch, Image } from "antd";
import { fetchCourseCategories, fetchCourseLevels } from "../../../../apis/ProgramManager/CourseApi";
import { Edit3, X } from 'lucide-react';

const { Option } = Select;

const EditCourse = ({
  open,
  onCancel,
  onUpdate,
  confirmLoading,
  course,
  categories = [],
  levels = [],
  embedded = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localLevels, setLocalLevels] = useState(levels || []);
  const [catsLoading, setCatsLoading] = useState(false);
  const [lvlsLoading, setLvlsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [bgImagePreview, setBgImagePreview] = useState("");

  useEffect(() => {
    if (course && localCategories.length > 0 && localLevels.length > 0) {
      const categoryId = course.categoryId || localCategories.find(c => c.label === course.category)?.value;
      const levelId = course.levelId || localLevels.find(l => l.label === course.level)?.value;

      form.setFieldsValue({
        name: course.name,
        description: course.description,
        categoryId: categoryId,
        levelId: levelId,
        isActive: course.isActive,
        imageUrl: course.imageUrl,
        durationHours: course.durationHours,
        courseCodeName: course.courseCodeName,
        backgroundImageUrl: course.backgroundImageUrl,
      });
      setImagePreview(course.imageUrl || "");
      setBgImagePreview(course.backgroundImageUrl || "");
    }
  }, [course, form, localCategories, localLevels]);

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

    return () => {
      mounted = false;
    };
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate({ ...values, price: 500000 });
      })
      .catch(() => { });
  };

  const formContent = (
    <>
      {/* Industrial Form Styles */}
      <style>{`
        .industrial-edit-form .ant-form-item-label > label {
          font-family: 'Inter', sans-serif !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
          color: #404040 !important;
        }
        .industrial-edit-form .ant-input,
        .industrial-edit-form .ant-input-number,
        .industrial-edit-form .ant-select-selector,
        .industrial-edit-form .ant-input-affix-wrapper {
          border-radius: 0 !important;
          border: 2px solid #e5e5e5 !important;
          font-weight: 500 !important;
        }
        .industrial-edit-form .ant-input:hover,
        .industrial-edit-form .ant-input:focus,
        .industrial-edit-form .ant-input-number:hover,
        .industrial-edit-form .ant-input-number-focused,
        .industrial-edit-form .ant-select-selector:hover,
        .industrial-edit-form .ant-select-focused .ant-select-selector,
        .industrial-edit-form .ant-input-affix-wrapper:hover,
        .industrial-edit-form .ant-input-affix-wrapper-focused {
          border-color: #facc15 !important;
        }
        .industrial-edit-form .ant-input-number {
          width: 100%;
        }
        .industrial-edit-form .ant-switch-checked {
          background: #facc15 !important;
        }
      `}</style>

      <Form
        form={form}
        layout="vertical"
        className={`industrial-edit-form ${embedded ? "grid grid-cols-1 md:grid-cols-2 gap-x-6" : ""}`}
        disabled={confirmLoading}
      >
        {!embedded && (
          <Form.Item
            label={t('admin.courses.form.name')}
            name="name"
            rules={[{ required: true, message: t('admin.courses.form.nameRequired', 'Name is required') }]}
          >
            <Input showCount placeholder={t('admin.courses.form.namePlaceholder')} />
          </Form.Item>
        )}

        {/* Category and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            label={t('common.category')}
            name="categoryId"
            rules={[{ required: true, message: t('admin.courses.form.categoryRequired', 'Category is required') }]}
          >
            <Select loading={catsLoading} placeholder={t('admin.courses.form.selectCategory', 'Select category')}>
              {localCategories.map((cat) => <Option key={cat.value} value={cat.value}>{cat.label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('common.level')}
            name="levelId"
            rules={[{ required: true, message: t('admin.courses.form.levelRequired', 'Level is required') }]}
          >
            <Select loading={lvlsLoading} placeholder={t('admin.courses.form.selectLevel', 'Select level')}>
              {localLevels.map((lvl) => <Option key={lvl.value} value={lvl.value}>{lvl.label}</Option>)}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">          
          <Form.Item
            label={t('admin.courses.form.durationHours')}
            name="durationHours"
            rules={[{ required: true, type: 'integer', message: t('admin.courses.form.durationRequired', 'Duration is required') }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-neutral-200 pt-4 mt-2">
          {/* Main Image */}
          <div>
            <Form.Item
              label={t('admin.courses.form.imageUrl')}
              name="imageUrl"
              rules={[{ required: true, type: 'url', message: t('admin.courses.form.imageUrlRequired', 'Valid image URL is required') }]}
            >
              <Input
                placeholder="https://..."
                onChange={(e) => {
                  const val = e.target.value;
                  form.setFieldsValue({ imageUrl: val });
                  setImagePreview(val);
                }}
              />
            </Form.Item>
            <div className="w-full h-32 flex items-center justify-center border-2 border-neutral-200 overflow-hidden bg-neutral-50 mb-4">
              {imagePreview ? <Image src={imagePreview} height={128} /> : <span className="text-neutral-400 text-xs uppercase">{t('common.noPreview', 'No Preview')}</span>}
            </div>
          </div>

          {/* Background Image */}
          <div>
            <Form.Item
              label={t('admin.courses.form.backgroundImageUrl', 'Background Image URL')}
              name="backgroundImageUrl"
              rules={[{ type: 'url', message: t('admin.courses.form.invalidUrl', 'Invalid URL') }]}
            >
              <Input
                placeholder="https://..."
                onChange={(e) => {
                  const val = e.target.value;
                  form.setFieldsValue({ backgroundImageUrl: val });
                  setBgImagePreview(val);
                }}
              />
            </Form.Item>
            <div className="w-full h-32 flex items-center justify-center border-2 border-neutral-200 overflow-hidden bg-neutral-50 mb-4">
              {bgImagePreview ?
                <Image src={bgImagePreview} className="object-cover w-full h-full" /> :
                <span className="text-neutral-400 text-xs uppercase">{t('common.noPreview', 'No Preview')}</span>}
            </div>
          </div>
        </div>

        <Form.Item label={t('common.status')} name="isActive" valuePropName="checked">
          <Switch checkedChildren={t('common.active')} unCheckedChildren={t('common.inactive')} />
        </Form.Item>

        <Form.Item
          label={t('common.description')}
          name="description"
          rules={[{ required: true, max: 1000, message: t('admin.courses.form.descriptionRequired', 'Description is required') }]}
        >
          <Input.TextArea rows={3} showCount />
        </Form.Item>

        {embedded && (
          <div className="md:col-span-2 mt-4 flex justify-end gap-3 pt-4 border-t-2 border-neutral-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={confirmLoading}
              className="px-5 py-2.5 bg-white border-2 border-neutral-300 text-neutral-600 font-bold uppercase tracking-wider hover:border-black hover:text-black transition-all text-xs"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleOk}
              disabled={confirmLoading}
              className="px-5 py-2.5 bg-yellow-400 border-2 border-yellow-400 text-black font-black uppercase tracking-wider hover:bg-yellow-500 hover:border-yellow-500 hover:shadow-md transition-all text-xs flex items-center gap-2"
            >
              {confirmLoading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {t('common.save')}
            </button>
          </div>
        )}
      </Form>
    </>
  );

  if (embedded) return formContent;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={false}
      destroyOnClose
      width={800}
      styles={{
        content: { padding: 0, borderRadius: 0 },
        body: { padding: 0 },
      }}
    >
      {/* Industrial Header */}
      <div className="bg-black p-4 flex items-center justify-between border-b-4 border-yellow-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-white font-black uppercase text-lg leading-none m-0">
              {t('admin.courses.editCourse')}
            </span>
            <p className="text-neutral-400 text-xs font-mono mt-1 m-0">
              {course?.name}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        {formContent}

        {/* Custom Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t-2 border-neutral-200 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirmLoading}
            className="px-5 py-2.5 bg-white border-2 border-neutral-300 text-neutral-600 font-bold uppercase tracking-wider hover:border-black hover:text-black transition-all text-xs"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleOk}
            disabled={confirmLoading}
            className="px-5 py-2.5 bg-yellow-400 border-2 border-yellow-400 text-black font-black uppercase tracking-wider hover:bg-yellow-500 hover:border-yellow-500 hover:shadow-md transition-all text-xs flex items-center gap-2"
          >
            {confirmLoading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            {t('admin.courses.updateCourse')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCourse;