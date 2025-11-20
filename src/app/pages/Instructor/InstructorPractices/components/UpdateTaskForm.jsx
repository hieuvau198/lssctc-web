import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

export default function UpdateTaskForm({ initialValues, onUpdate, onCancel, visible, loading }) {
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
      title={`Update Task: ${initialValues?.taskName || ''}`}
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true} // Important to reset form state on close
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Update Task
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
          label="Task Name"
          rules={[{ required: true, message: 'Task name is required.' }]}
        >
          <Input placeholder="Task Name" maxLength={200} />
        </Form.Item>
        <Form.Item
          name="taskCode"
          label="Task Code"
        >
          <Input placeholder="Task Code" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="taskDescription"
          label="Task Description"
          rules={[{ required: true, message: 'Task description is required.' }]}
        >
          <Input.TextArea rows={3} placeholder="Task Description" maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="expectedResult"
          label="Expected Result"
          rules={[{ required: true, message: 'Expected result is required.' }]}
        >
          <Input.TextArea rows={3} placeholder="Expected Result" maxLength={1000} />
        </Form.Item>
      </Form>
    </Modal>
  );
}