// src/app/pages/Admin/Course/partials/Sections/EditSectionModal.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import { updateSection } from '../../../../../apis/ProgramManager/SectionApi';
import { FileEdit, X } from 'lucide-react';

const EditSectionModal = ({ visible, onCancel, onSuccess, section }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && section) {
      form.setFieldsValue({
        sectionTitle: section.sectionTitle,
        sectionDescription: section.sectionDescription,
        estimatedDurationMinutes: section.estimatedDurationMinutes
      });
    } else {
      form.resetFields();
    }
  }, [visible, section, form]);

  const handleSubmit = async (values) => {
    if (!section?.id) return;
    setLoading(true);
    try {
      await updateSection(section.id, {
        sectionTitle: values.sectionTitle,
        sectionDescription: values.sectionDescription,
        estimatedDurationMinutes: values.estimatedDurationMinutes
      });

      message.success(t('admin.courses.sections.updateSuccess') || "Section updated successfully");
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || t('admin.courses.sections.updateError') || "Failed to update section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={600}
      styles={{
        content: { padding: 0, borderRadius: 0 },
        body: { padding: 0 },
      }}
    >
      {/* Industrial Header */}
      <div className="bg-black p-4 flex items-center justify-between border-b-4 border-yellow-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
            <FileEdit className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-lg leading-none m-0">
              {t('admin.courses.sections.editSection')}
            </h3>
            <p className="text-neutral-400 text-xs font-mono mt-1 m-0">
              ID: {section?.id}
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
        {/* Industrial Form Styles */}
        <style>{`
            .industrial-form-item .ant-form-item-label > label {
                font-family: 'Inter', sans-serif !important;
                text-transform: uppercase !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                letter-spacing: 0.05em !important;
                color: #404040 !important;
            }
            .industrial-input, .ant-input-number-input {
                border-radius: 0 !important;
                border: 2px solid #e5e5e5 !important;
                font-weight: 500 !important;
            }
            .industrial-input:hover, .industrial-input:focus, .ant-input-number:hover, .ant-input-number-focused {
                border-color: #facc15 !important;
            }
            .ant-input-number {
                border-radius: 0 !important;
                border: 2px solid #e5e5e5 !important; 
                width: 100%;
            }
            .ant-input-number-handler-wrap {
                display: none;
            }
        `}</style>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="sectionTitle"
            label={t('admin.courses.sections.form.title')}
            rules={[{ required: true, message: t('admin.courses.sections.form.titleRequired') }]}
            className="industrial-form-item"
          >
            <Input
              placeholder={t('admin.courses.sections.form.titlePlaceholder')}
              className="industrial-input h-10"
            />
          </Form.Item>

          <Form.Item
            name="sectionDescription"
            label={t('common.description')}
            className="industrial-form-item"
          >
            <Input.TextArea
              rows={4}
              placeholder={t('admin.courses.sections.form.descriptionPlaceholder')}
              className="industrial-input"
            />
          </Form.Item>

          <Form.Item
            name="estimatedDurationMinutes"
            label={t('admin.courses.sections.form.durationMinutes')}
            rules={[{ required: true, message: t('admin.courses.sections.form.durationRequired') }]}
            className="industrial-form-item"
          >
            <InputNumber
              min={1}
              max={1000}
              className="industrial-input h-10 flex items-center"
            />
          </Form.Item>

          {/* Custom Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-white border-2 border-neutral-300 text-neutral-600 font-bold uppercase tracking-wider hover:border-black hover:text-black transition-all text-xs"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-yellow-400 border-2 border-yellow-400 text-black font-black uppercase tracking-wider hover:bg-yellow-500 hover:border-yellow-500 hover:shadow-md transition-all text-xs flex items-center gap-2"
            >
              {loading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {t('common.save')}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditSectionModal;