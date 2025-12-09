import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export default function UpdatePracticeForm({ initialValues, onUpdate, onCancel, visible, loading }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  
  useEffect(() => {
    // Only set form values when the modal becomes visible and initialValues are loaded
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form, visible]);

  const onFinish = (values) => {
    onUpdate(values);
  };

  return (
    <Modal
      title={t('instructor.practices.updatePractice.title')}
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true} // Important to reset form state on close
      footer={[
        <Button key="back" onClick={onCancel}>
          {t('instructor.practices.updatePractice.cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {t('instructor.practices.updatePractice.update')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="practiceName"
          label={t('instructor.practices.updatePractice.practiceName')}
          rules={[{ required: true, message: t('instructor.practices.updatePractice.practiceNameRequired') }]}
        >
          <Input placeholder={t('instructor.practices.updatePractice.practiceNamePlaceholder')} maxLength={200} />
        </Form.Item>
        <Form.Item
          name="practiceCode"
          label={t('instructor.practices.updatePractice.practiceCode')}
        >
          <Input placeholder={t('instructor.practices.updatePractice.practiceCodePlaceholder')} maxLength={50} />
        </Form.Item>
        <Form.Item
          name="practiceDescription"
          label={t('instructor.practices.updatePractice.description')}
        >
          <Input.TextArea rows={3} placeholder={t('instructor.practices.updatePractice.descriptionPlaceholder')} maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="estimatedDurationMinutes"
          label={t('instructor.practices.updatePractice.estimatedDuration')}
          rules={[{ type: 'number', min: 1, max: 600 }]}
        >
          <InputNumber min={1} max={600} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="difficultyLevel"
          label={t('instructor.practices.updatePractice.difficultyLevel')}
          rules={[{ required: true, message: t('instructor.practices.updatePractice.difficultyRequired') }]}
        >
          <Select placeholder={t('instructor.practices.updatePractice.selectLevel')}>
            <Option value="Entry">{t('instructor.practices.difficulty.entry')}</Option>
            <Option value="Intermediate">{t('instructor.practices.difficulty.intermediate')}</Option>
            <Option value="Advanced">{t('instructor.practices.difficulty.advanced')}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="maxAttempts"
          label={t('instructor.practices.updatePractice.maxAttempts')}
          rules={[{ type: 'number', min: 1, max: 10 }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="isActive"
          label={t('instructor.practices.updatePractice.status')}
        >
          <Select placeholder={t('instructor.practices.updatePractice.selectStatus')}>
            <Option value={true}>{t('instructor.practices.updatePractice.active')}</Option>
            <Option value={false}>{t('instructor.practices.updatePractice.inactive')}</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}