import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Switch, Button, Space, Image } from "antd";

const ProgramEditForm = ({ form, onFinish, onCancel, submitting }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    try {
      const v = form?.getFieldValue?.('imageUrl') || '';
      setPreview(v?.trim() ? v.trim() : null);
    } catch (err) {}
  }, [form]);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Program Name"
        rules={[{ required: true, message: "Please enter program name" }]}
      >
        <Input maxLength={120} showCount placeholder="Enter program name" />
      </Form.Item>

      {/* <Form.Item
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
      </Form.Item> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[
            { required: true, message: "Please enter image URL" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input
            maxLength={300}
            allowClear
            placeholder="https://example.com/image.jpg"
            onChange={(e) => {
              const v = e?.target?.value || '';
              setPreview(v.trim() ? v.trim() : null);
            }}
          />
        </Form.Item>

        <div>
          <div className="text-sm text-gray-600 mb-2">Image preview</div>
          <div className="w-32 h-32 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
            {preview ? (
              <Image src={preview} preview={{ mask: 'Click to preview' }} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
        </div>
      </div>

      {/* <Form.Item
        name="isActive"
        label="Status"
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item> */}
      
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter description" }]}
      >
        <Input.TextArea
          rows={3}
          maxLength={500}
          showCount
          placeholder="Enter program description"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            Update Program
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProgramEditForm;