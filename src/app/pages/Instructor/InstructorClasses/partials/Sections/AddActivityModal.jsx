import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { createActivity, assignActivityToSection } from '../../../../../apis/Instructor/InstructorSectionApi';

const { Option } = Select;
const { TextArea } = Input;

const AddActivityModal = ({ sectionId, isVisible, onClose, onActivityAdded }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create the activity
      const newActivity = await createActivity({
        activityTitle: values.title,
        activityDescription: values.description,
        activityType: values.type,
        estimatedDurationMinutes: values.duration,
      });

      // 2. Assign it to the section
      if (newActivity && newActivity.id) {
        await assignActivityToSection(sectionId, newActivity.id);
      }

      // 3. Close modal and trigger refresh
      onActivityAdded();
      form.resetFields();
    } catch (err) {
      setError(err.message || t('instructor.classes.addActivityModal.addFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setError(null);
    onClose();
  };

  return (
    <Modal
      title={t('instructor.classes.addActivityModal.title')}
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {t('instructor.classes.addActivityModal.cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {t('instructor.classes.addActivityModal.addActivity')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          type: 'Material',
          duration: 10,
        }}
      >
        {error && <Alert message={t('common.error')} description={error} type="error" showIcon closable className="mb-4" />}
        <Form.Item
          name="title"
          label={t('instructor.classes.addActivityModal.activityTitle')}
          rules={[{ required: true, message: t('instructor.classes.addActivityModal.activityTitleRequired') }]}
        >
          <Input placeholder={t('instructor.classes.addActivityModal.activityTitlePlaceholder')} />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('instructor.classes.addActivityModal.description')}
          rules={[{ required: true, message: t('instructor.classes.addActivityModal.descriptionRequired') }]}
        >
          <TextArea rows={3} placeholder={t('instructor.classes.addActivityModal.descriptionPlaceholder')} />
        </Form.Item>
        <Form.Item
          name="type"
          label={t('instructor.classes.addActivityModal.activityType')}
          rules={[{ required: true, message: t('instructor.classes.addActivityModal.activityTypeRequired') }]}
        >
          <Select>
            <Option value="Material">{t('instructor.classes.addActivityModal.typeMaterial')}</Option>
            <Option value="Quiz">{t('instructor.classes.addActivityModal.typeQuiz')}</Option>
            <Option value="Practice">{t('instructor.classes.addActivityModal.typePractice')}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="duration"
          label={t('instructor.classes.addActivityModal.duration')}
          rules={[{ required: true, message: t('instructor.classes.addActivityModal.durationRequired') }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddActivityModal;