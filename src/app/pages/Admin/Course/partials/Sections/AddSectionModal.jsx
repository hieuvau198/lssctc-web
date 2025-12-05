// src/app/pages/Admin/Course/partials/Sections/AddSectionModal.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import { createSection, addSectionToCourse } from '../../../../../apis/ProgramManager/SectionApi';

const AddSectionModal = ({ visible, onCancel, onSuccess, courseId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 1. Create the section
      const newSection = await createSection({
        sectionTitle: values.sectionTitle,
        sectionDescription: values.sectionDescription,
        estimatedDurationMinutes: values.estimatedDurationMinutes
      });

      // 2. Link it to the course
      await addSectionToCourse(courseId, newSection.id);

      message.success(t('admin.courses.sections.addSuccess'));
      form.resetFields();
      onSuccess(); // Trigger refresh in parent
    } catch (error) {
      message.error(error.response?.data?.message || t('admin.courses.sections.addError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t('admin.courses.sections.addNewSection')}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="sectionTitle"
          label={t('admin.courses.sections.form.title')}
          rules={[{ required: true, message: t('admin.courses.sections.form.titleRequired') }]}
        >
          <Input placeholder={t('admin.courses.sections.form.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="sectionDescription"
          label={t('common.description')}
        >
          <Input.TextArea rows={3} placeholder={t('admin.courses.sections.form.descriptionPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="estimatedDurationMinutes"
          label={t('admin.courses.sections.form.durationMinutes')}
          initialValue={60}
          rules={[{ required: true, message: t('admin.courses.sections.form.durationRequired') }]}
        >
          <InputNumber min={1} max={1000} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSectionModal;