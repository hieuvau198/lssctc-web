import React from "react";
import { Form, Input, InputNumber, Switch, Button, Space } from "antd";

const ProgramCreateForm = ({ form, onFinish, onCancel, submitting }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        durationHours: 0,
        isActive: true,
      }}
    >
      <Form.Item
        name="name"
        label="Program Name"
        rules={[{ required: true, message: "Please enter program name" }]}
      >
        <Input maxLength={120} placeholder="Enter program name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter description" }]}
      >
        <Input.TextArea
          rows={4}
          maxLength={500}
          showCount
          placeholder="Enter program description"
        />
      </Form.Item>

      <Form.Item
        name="durationHours"
        label="Duration (hours)"
        rules={[{ required: true, message: "Please enter duration" }]}
      >
        <InputNumber
          min={0}
          max={1000}
          className="w-full"
          placeholder="Enter duration in hours"
        />
      </Form.Item>

      <Form.Item
        name="imageUrl"
        label="Image URL"
        rules={[
          { required: true, message: "Please enter image URL" },
          { type: "url", message: "Please enter a valid URL" },
        ]}
      >
        <Input maxLength={300} placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Status"
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            Create Program
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProgramCreateForm;