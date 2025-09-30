import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Alert,
} from "antd";
import { createClass } from "../../../../apis/ProgramManager/ClassApi";
import dayjs from "dayjs";

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {number|string} props.programCourseId
 * @param {Function} props.onCreated
 */
const AddClassForm = ({ open, onClose, programCourseId, onCreated }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleFinish = async (values) => {
    setSaving(true);
    setError(null);
    try {
      await createClass({
        classCode: values.classCode,
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        capacity: values.capacity,
        programCourseId,
        description: values.description,
      });
      form.resetFields();
      onCreated?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to create class"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add Class"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {error && (
        <Alert type="error" message={error} showIcon className="mb-2" />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          capacity: 10,
          startDate: dayjs(),
          endDate: dayjs().add(1, "month"),
        }}
      >
        <Form.Item
          label="Class Code"
          name="classCode"
          rules={[{ required: true, message: "Please enter class code" }]}
        >
          <Input placeholder="Class code" />
        </Form.Item>
        <Form.Item
          label="Class Name"
          name="name"
          rules={[{ required: true, message: "Please enter class name" }]}
        >
          <Input placeholder="Class name" />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select end date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: "Capacity must be at least 1",
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={2} placeholder="Description" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} block>
            Add Class
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClassForm;
