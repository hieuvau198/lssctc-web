// src/app/pages/Admin/Course/partials/Sections/AddSectionModal.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, message, Alert } from 'antd';
import { createSectionForCourse } from '../../../../../apis/ProgramManager/SectionApi';
import { FilePlus, X } from 'lucide-react';

const AddSectionModal = ({ visible, onCancel, onSuccess, courseId, courseDurationMinutes = 0, existingSections = [] }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isDurationValid, setIsDurationValid] = useState(true);

  // Watch duration field changes
  const durationValue = Form.useWatch('estimatedDurationMinutes', form);

  // Calculate used and remaining duration
  const usedDuration = existingSections.reduce((sum, section) => sum + (section.estimatedDurationMinutes || 0), 0);
  const remainingDuration = courseDurationMinutes - usedDuration;

  // Validate duration in real-time when durationValue changes
  useEffect(() => {
    if (courseDurationMinutes > 0) {
      const isValid = durationValue && durationValue >= 1 && durationValue <= remainingDuration;
      setIsDurationValid(isValid);
    } else {
      // If no course duration limit, just check if value is valid
      setIsDurationValid(durationValue && durationValue >= 1);
    }
  }, [durationValue, remainingDuration, courseDurationMinutes]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setIsDurationValid(true);
    }
  }, [visible]);

  // Hide create button when duration is invalid
  const shouldHideCreateButton = !isDurationValid || (courseDurationMinutes > 0 && remainingDuration <= 0);

  // Custom validator for duration field
  const validateDuration = (_, value) => {
    if (!value || value < 1) {
      return Promise.reject(new Error(t('admin.courses.sections.form.durationRequired')));
    }
    if (courseDurationMinutes > 0 && value > remainingDuration) {
      return Promise.reject(
        new Error(
          t('admin.courses.sections.form.durationExceedsLimit', {
            remaining: remainingDuration,
            courseDuration: courseDurationMinutes,
            usedDuration: usedDuration
          })
        )
      );
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    // Extra validation before submit
    if (courseDurationMinutes > 0 && values.estimatedDurationMinutes > remainingDuration) {
      message.error(t('admin.courses.sections.form.durationExceedsLimit', {
        remaining: remainingDuration,
        courseDuration: courseDurationMinutes,
        usedDuration: usedDuration
      }));
      return;
    }

    setLoading(true);
    try {
      await createSectionForCourse(courseId, {
        sectionTitle: values.sectionTitle,
        sectionDescription: values.sectionDescription,
        estimatedDurationMinutes: values.estimatedDurationMinutes
      });

      message.success(t('admin.courses.sections.addSuccess'));
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || t('admin.courses.sections.addError'));
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
            <FilePlus className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-white font-black uppercase text-lg leading-none m-0">
            {t('admin.courses.sections.addNewSection')}
          </h3>
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
          {/* Duration info message */}
          {courseDurationMinutes > 0 && (
            <Alert
              message={t('admin.courses.sections.form.durationInfo', {
                remaining: remainingDuration,
                courseDuration: courseDurationMinutes,
                usedDuration: usedDuration
              })}
              type={remainingDuration <= 0 ? 'warning' : 'info'}
              showIcon
              className="mb-4"
            />
          )}

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
            initialValue={60}
            rules={[{ validator: validateDuration }]}
            className="industrial-form-item"
          >
            <InputNumber
              min={1}
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
            {/* Only show Create button when duration is valid */}
            {!shouldHideCreateButton && (
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-yellow-400 border-2 border-yellow-400 text-black font-black uppercase tracking-wider hover:bg-yellow-500 hover:border-yellow-500 hover:shadow-md transition-all text-xs flex items-center gap-2"
              >
                {loading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                {t('common.create')}
              </button>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddSectionModal;
