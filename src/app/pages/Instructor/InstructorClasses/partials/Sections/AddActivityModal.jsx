import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Alert } from 'antd';
import { createActivity, assignActivityToSection } from '../../../../../apis/Instructor/InstructorSectionApi';

const { Option } = Select;
const { TextArea } = Input;

const AddActivityModal = ({ sectionId, isVisible, onClose, onActivityAdded }) => {
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
      setError(err.message || 'Failed to add activity. Please try again.');
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
      title="Add New Activity"
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Add Activity
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
        {error && <Alert message="Error" description={error} type="error" showIcon closable className="mb-4" />}
        <Form.Item
          name="title"
          label="Activity Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="e.g., Introduction to Safety" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea rows={3} placeholder="Describe the activity" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Activity Type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Select>
            <Option value="Material">Material</Option>
            <Option value="Quiz">Quiz</Option>
            <Option value="Practice">Practice</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="duration"
          label="Estimated Duration (minutes)"
          rules={[{ required: true, message: 'Please enter a duration' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddActivityModal;