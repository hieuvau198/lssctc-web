// src/app/pages/Admin/Course/partials/Sections/AddSectionModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import { createSection, addSectionToCourse } from '../../../../../apis/ProgramManager/SectionApi';

const AddSectionModal = ({ visible, onCancel, onSuccess, courseId }) => {
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

      message.success('Section created and added successfully');
      form.resetFields();
      onSuccess(); // Trigger refresh in parent
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Section"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="sectionTitle"
          label="Section Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="e.g. Introduction to Safety" />
        </Form.Item>

        <Form.Item
          name="sectionDescription"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Brief description of this section" />
        </Form.Item>

        <Form.Item
          name="estimatedDurationMinutes"
          label="Duration (Minutes)"
          initialValue={60}
          rules={[{ required: true, message: 'Please enter duration' }]}
        >
          <InputNumber min={1} max={1000} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSectionModal;