import { ArrowLeftOutlined, BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Space, message, App, Modal } from 'antd';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createMaterial } from '../../../../apis/Instructor/InstructorMaterialsApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddMaterials({ onSuccess }) {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const query = useQuery();
  const sectionId = query.get('sectionId') || '';
  const classId = query.get('classId') || '';

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const payload = {
        name: values.title,
        description: values.description,
        materialUrl: values.url,
        learningMaterialType: values.typeId === 1 ? 'Document' : 'Video',
        sectionId: sectionId || undefined,
        classId: classId || undefined,
      };

      await createMaterial(payload);
      
      modal.success({
        title: 'Success',
        content: 'Material created successfully',
        okText: 'OK',
        centered: true,
        onOk: () => {
          // Always navigate back and let parent component refresh
          navigate('/instructor/materials', { replace: true });
        }
      });
    } catch (e) {
      console.error('Create material error', e);
      
      let errorMsg = e?.message || 'Failed to create material';
      // Handle API error responses
      if (e?.response?.data) {
        const data = e.response.data;
        if (data.errors && typeof data.errors === 'object') {
          const errorList = [];
          for (const [field, messages] of Object.entries(data.errors)) {
            if (Array.isArray(messages)) {
              errorList.push(`${field}: ${messages[0]}`);
            }
          }
          if (errorList.length > 0) {
            errorMsg = errorList.join('\n');
          }
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.title) {
          errorMsg = data.title;
        }
      }
      
      modal.error({
        title: 'Error Creating Material',
        content: errorMsg,
        okText: 'Close',
        centered: true,
      });
    }
  };

  const onCancel = () => navigate(-1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
          Back
        </Button>
        <h1 className="text-2xl font-semibold m-0">Add Material</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ typeId: 1 }}
          onFinish={onFinish}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter title' }]}>
            <Input placeholder="Material title" />
          </Form.Item>

          <Form.Item label="Type" name="typeId">
            <Radio.Group>
              <Space direction="horizontal">
                <Radio value={1}><BookOutlined /> Document</Radio>
                <Radio value={2}><VideoCameraOutlined /> Video</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="URL" name="url" rules={[{ required: true, message: 'Please enter URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Optional description" />
          </Form.Item>

          <input type="hidden" value={sectionId} readOnly />
          <input type="hidden" value={classId} readOnly />

          <Form.Item>
            <Space>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
