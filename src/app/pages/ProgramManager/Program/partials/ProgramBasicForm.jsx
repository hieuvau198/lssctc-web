import React from "react";
import { Form, Input, Switch, Tooltip } from "antd";

const ProgramBasicForm = ({ form, loading }) => (
  <>
    <Form.Item
      label="Program Name"
      name="name"
      rules={[{ required: true, message: "Please enter the program name" }]}
      tooltip="Enter a clear, descriptive name for the program."
    >
      <Input
        disabled={loading}
        placeholder="e.g. Mobile Crane Operator Certificate Program"
        maxLength={100}
        showCount
      />
    </Form.Item>
    <Form.Item
      label="Description"
      name="description"
      rules={[{ required: true, message: "Please enter a description" }]}
      tooltip="Describe the program's purpose and content."
    >
      <Input.TextArea
        rows={4}
        disabled={loading}
        placeholder="Briefly describe what this program covers and its objectives."
        maxLength={500}
        showCount
      />
    </Form.Item>
    <Form.Item
      label="Image URL"
      name="imageUrl"
      tooltip="Paste a link to an image representing the program."
    >
      <Input
        disabled={loading}
        placeholder="https://example.com/image.jpg"
        maxLength={300}
      />
    </Form.Item>
    <Form.Item
      label={
        <Tooltip title="Toggle to activate or deactivate this program">
          Active
        </Tooltip>
      }
      name="isActive"
      valuePropName="checked"
    >
      <Switch
        disabled={loading}
        checkedChildren="Active"
        unCheckedChildren="Inactive"
      />
    </Form.Item>
  </>
);

export default ProgramBasicForm;
