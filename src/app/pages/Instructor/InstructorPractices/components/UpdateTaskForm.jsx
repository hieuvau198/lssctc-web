import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

export default function UpdateTaskForm({ initialValues, onUpdate, onCancel, visible, loading }) {
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
      title={t('instructor.practices.updateTask.titleWithName', { name: initialValues?.taskName || '' })}
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true} // Important to reset form state on close
      footer={[
        <Button key="back" onClick={onCancel}>
          {t('instructor.practices.updateTask.cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {t('instructor.practices.updateTask.updateTask')}
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
          name="taskName"
          label={t('instructor.practices.updateTask.taskName')}
          rules={[{ required: true, message: t('instructor.practices.updateTask.taskNameRequired') }]}
        >
          <Input placeholder={t('instructor.practices.updateTask.taskNamePlaceholder')} maxLength={200} />
        </Form.Item>
        <Form.Item
          name="taskCode"
          label={t('instructor.practices.updateTask.taskCode')}
        >
          <Input placeholder={t('instructor.practices.updateTask.taskCodePlaceholder')} maxLength={50} />
        </Form.Item>
        <Form.Item
          name="taskDescription"
          label={t('instructor.practices.updateTask.taskDescription')}
          rules={[{ required: true, message: t('instructor.practices.updateTask.taskDescriptionRequired') }]}
        >
          <Input.TextArea rows={3} placeholder={t('instructor.practices.updateTask.taskDescriptionPlaceholder')} maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="expectedResult"
          label={t('instructor.practices.updateTask.expectedResult')}
          rules={[{ required: true, message: t('instructor.practices.updateTask.expectedResultRequired') }]}
        >
          <Input.TextArea rows={3} placeholder={t('instructor.practices.updateTask.expectedResultPlaceholder')} maxLength={1000} />
        </Form.Item>
      </Form>
    </Modal>
  );
}