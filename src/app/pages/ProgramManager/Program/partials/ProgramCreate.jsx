import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { createProgram } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";

const ProgramCreate = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setSaving(true);
    setError(null);
    try {
      await createProgram({
        name: values.name,
        description: values.description,
        durationHours: values.durationHours,
        imageUrl: values.imageUrl,
      });
      navigate("/programManager/programs");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create program"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Program</h1>
      {error && (
        <Alert
          type="error"
          message="Error"
          description={error}
          showIcon
          className="mb-4"
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ durationHours: 0 }}
      >
        <Form.Item
          label="Program Name"
          name="name"
          rules={[{ required: true, message: "Please enter program name" }]}
        >
          <Input placeholder="Program name" maxLength={100} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Program description"
            maxLength={500}
            showCount
          />
        </Form.Item>
        <Form.Item
          label="Duration (hours)"
          name="durationHours"
          rules={[
            { required: true, message: "Please enter duration" },
            { type: "number", min: 0, max: 1000 },
          ]}
        >
          <InputNumber
            min={0}
            max={1000}
            className="w-full"
            placeholder="Duration in hours"
          />
        </Form.Item>
        <Form.Item
          label="Image URL"
          name="imageUrl"
          rules={[{ required: true, message: "Please enter image URL" }]}
        >
          <Input placeholder="https://example.com/image.jpg" maxLength={300} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            className="w-full"
          >
            Create Program
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProgramCreate;
