import { ArrowLeftOutlined, BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Space, message, App } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { updateMaterial, getMaterials } from '../../../../apis/Instructor/InstructorMaterialsApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function EditMaterials({ onSuccess }) {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const { id } = useParams();
  const query = useQuery();
  const sectionId = query.get('sectionId') || '';
  const classId = query.get('classId') || '';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);
        // Lấy nhiều materials để đảm bảo có material cần edit
        const res = await getMaterials({ page: 1, pageSize: 1000 });
        const materials = Array.isArray(res.items) ? res.items : [];
        const material = materials.find(m => Number(m.id) === Number(id));
        
        if (material) {
          console.log('Found material:', material);
          const typeId = material.learningMaterialType === 'Document' ? 1 : 2;
          form.setFieldsValue({
            title: material.name,
            description: material.description || '',
            url: material.url || material.materialUrl,
            typeId,
          });
        } else {
          console.log('Material not found. Materials:', materials);
          message.error('Material not found');
          navigate('/instructor/materials');
        }
      } catch (e) {
        console.error('Load material error', e);
        message.error('Failed to load material');
        navigate('/instructor/materials');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMaterial();
    }
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        name: values.title,
        description: values.description,
        materialUrl: values.url,
        learningMaterialType: values.typeId === 1 ? 'Document' : 'Video',
        sectionId: sectionId || undefined,
        classId: classId || undefined,
      };

      await updateMaterial(id, payload);
      
      modal.success({
        title: 'Success',
        content: 'Material updated successfully',
        okText: 'OK',
        centered: true,
        onOk: () => {
          // Always navigate back and let parent component refresh
          navigate('/instructor/materials', { replace: true });
        }
      });
    } catch (e) {
      console.error('Update material error', e);
      
      let errorMsg = e?.message || 'Failed to update material';
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
        title: 'Error Updating Material',
        content: errorMsg,
        okText: 'Close',
        centered: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => navigate(-1);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-4">
        <Card loading />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onCancel}
          className="p-0"
        />
        <span className="text-2xl">Edit Material</span>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Enter material title" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="typeId"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Radio.Group>
              <Radio value={1}>
                <BookOutlined className="mr-2" />
                Document
              </Radio>
              <Radio value={2}>
                <VideoCameraOutlined className="mr-2" />
                Video
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="URL"
            name="url"
            rules={[
              { required: true, message: 'Please enter URL' },
              { type: 'url', message: 'Please enter valid URL' },
            ]}
          >
            <Input placeholder="Enter material URL" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter material description (optional)"
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Update
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
