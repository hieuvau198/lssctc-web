import React from 'react';
import { Drawer, Form, Input, Button, Space, Switch } from 'antd';

const BrandModelDrawerForm = ({
  visible = false,
  mode = 'create', // 'create', 'edit', 'view'
  loading = false,
  form,
  onClose = () => {},
  onSubmit = () => {},
  onSwitchToEdit = () => {},
}) => {
  const isViewMode = mode === 'view';
  const title = mode === 'create' ? 'Create Brand Model' : mode === 'edit' ? 'Edit Brand Model' : 'Brand Model Details';

  return (
    <Drawer
      title={title}
      placement="right"
      width={520}
      onClose={onClose}
      open={visible}
      footer={
        <div className="flex justify-end gap-2">
          {isViewMode ? (
            <>
              <Button onClick={onClose}>Close</Button>
              <Button type="primary" onClick={onSwitchToEdit}>
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={onSubmit} loading={loading}>
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </>
          )}
        </div>
      }
    >
      <Form form={form} layout="vertical" disabled={isViewMode}>
        <Form.Item
          name="name"
          label="Brand Model Name"
          rules={[
            { required: true, message: 'Please input brand model name' },
            { max: 100, message: 'Name cannot exceed 100 characters' },
          ]}
        >
          <Input placeholder="Enter brand model name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter description"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Active Status"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default BrandModelDrawerForm;
