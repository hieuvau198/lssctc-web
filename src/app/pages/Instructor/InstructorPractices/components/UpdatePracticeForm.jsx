import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';

const { Option } = Select;

export default function UpdatePracticeForm({ initialValues, onUpdate, onCancel, visible, loading }) {
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
      title="Update Practice"
      visible={visible}
      onCancel={onCancel}
      destroyOnClose={true} // Important to reset form state on close
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Update
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
          label="Practice Name"
          rules={[{ required: true, message: 'Practice name is required.' }]}
        >
          <Input placeholder="Practice Name" maxLength={200} />
        </Form.Item>
        <Form.Item
          name="practiceCode"
          label="Practice Code"
        >
          <Input placeholder="Practice Code" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="practiceDescription"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Practice Description" maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="estimatedDurationMinutes"
          label="Estimated Duration (Minutes)"
          rules={[{ type: 'number', min: 1, max: 600 }]}
        >
          <InputNumber min={1} max={600} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="difficultyLevel"
          label="Difficulty Level"
          rules={[{ required: true, message: 'Please select a difficulty level.' }]}
        >
          <Select placeholder="Select level">
            <Option value="Entry">Entry</Option>
            <Option value="Intermediate">Intermediate</Option>
            <Option value="Advanced">Advanced</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="maxAttempts"
          label="Max Attempts"
          rules={[{ type: 'number', min: 1, max: 10 }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Status"
        >
          <Select placeholder="Select status">
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}