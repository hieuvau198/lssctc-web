import React, { useEffect } from 'react';
import { Drawer, Form, Input, Space, Button, Skeleton } from 'antd';

const DrawerForm = ({
  visible,
  mode, // 'create', 'edit', 'view'
  loading,
  form,
  onClose,
  onSubmit,
  onSwitchToEdit,
}) => {
  return (
    <Drawer
      title={
        mode === 'create'
          ? 'Create Task'
          : mode === 'edit'
          ? 'Edit Task'
          : 'Task Details'
      }
      open={visible}
      onClose={onClose}
      width={600}
      extra={
        <Space>
          {mode === 'view' && (
            <Button type="primary" onClick={onSwitchToEdit}>
              Edit
            </Button>
          )}
          {mode !== 'view' && (
            <>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={onSubmit} loading={loading}>
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </>
          )}
        </Space>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Form
          form={form}
          layout="vertical"
          disabled={mode === 'view'}
        >
          <Form.Item
            name="taskName"
            label="Task Name"
            rules={[
              { required: true, message: 'Task name is required' },
              { max: 100, message: 'Task name cannot exceed 100 characters' }
            ]}
          >
            <Input 
              placeholder="Enter task name" 
              maxLength={100}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="taskCode"
            label="Task Code"
            rules={[
              { required: true, message: 'Task code is required' },
              { max: 50, message: 'Task code cannot exceed 50 characters' }
            ]}
          >
            <Input 
              placeholder="Enter task code" 
              maxLength={50}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="taskDescription"
            label="Task Description"
            rules={[
              { max: 500, message: 'Task description cannot exceed 500 characters' }
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter task description" 
              maxLength={500}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="expectedResult"
            label="Expected Result"
            rules={[
              { max: 100, message: 'Expected result cannot exceed 100 characters' }
            ]}
          >
            <Input.TextArea 
              rows={2} 
              placeholder="Enter expected result" 
              maxLength={150}
              showCount
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default DrawerForm;
