// src\app\pages\SimManager\Settings\partials\UpdateComponent.jsx

import React, { useEffect, useState } from 'react';
import { updateComponent } from '../../../../apis/SimulationManager/SimulationManagerComponentApi';
import { Form, Input, Switch, Button, Space, Alert } from 'antd';

export default function UpdateComponent({ component, onUpdated, onCancel }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const [imgError, setImgError] = useState(false);

  const initialValues = {
    name: component.name,
    description: component.description,
    imageUrl: component.imageUrl,
    isActive: component.isActive,
  };

  const imageUrl = Form.useWatch('imageUrl', form);

  useEffect(() => {
    // reset image error when url changes
    setImgError(false);
  }, [imageUrl]);

  const onFinish = async (values) => {
    setSubmitting(true);
    setErr(null);
    try {
      await updateComponent(component.id, values);
      onUpdated && onUpdated();
    } catch (ex) {
      setErr(ex.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {err && <Alert className="mb-3" type="error" message={err} showIcon />}
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
              <Input placeholder="Component name" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea placeholder="Short description" rows={5} />
            </Form.Item>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Image URL" name="imageUrl">
              <Input placeholder="https://..." />
            </Form.Item>
            <div className="border rounded-lg bg-slate-50 p-2">
              <div className="text-xs text-slate-500 mb-1">Preview</div>
              <div className="w-full h-64 rounded-md bg-white flex items-center justify-center overflow-hidden">
                {imageUrl && !imgError ? (
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="max-h-full max-w-full object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-slate-400 text-sm">Paste an image URL to preview</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Update
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
}
