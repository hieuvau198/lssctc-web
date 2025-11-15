import { ArrowLeftOutlined, BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Space, message } from 'antd';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createMaterial } from '../../../../apis/Instructor/MaterialsApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddMaterials({ onSuccess }) {
  const navigate = useNavigate();
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
      message.success('Material created');
      
      // Call onSuccess callback if provided, otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/instructor/materials');
      }
    } catch (e) {
      console.error('Create material error', e);
      message.error(e?.message || 'Failed to create material');
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
