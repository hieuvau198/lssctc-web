import { ArrowLeftOutlined, BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Space, message, App } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { updateMaterial, getMaterials } from '../../../../apis/Instructor/InstructorMaterialsApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function EditMaterials({ onSuccess }) {
  const { t } = useTranslation();
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
          message.error(t('instructor.materials.messages.materialNotFound'));
          navigate('/instructor/materials');
        }
      } catch (e) {
        console.error('Load material error', e);
        message.error(t('instructor.materials.messages.loadMaterialFailed'));
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
        title: t('instructor.materials.modal.success'),
        content: t('instructor.materials.messages.updateSuccess'),
        okText: t('instructor.materials.modal.ok'),
        centered: true,
        onOk: () => {
          // Always navigate back and let parent component refresh
          navigate('/instructor/materials', { replace: true });
        }
      });
    } catch (e) {
      console.error('Update material error', e);
      
      let errorMsg = e?.message || t('instructor.materials.messages.updateFailed');
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
        title: t('instructor.materials.messages.updateError'),
        content: errorMsg,
        okText: t('instructor.materials.modal.close'),
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
        <span className="text-2xl">{t('instructor.materials.editMaterial')}</span>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label={t('instructor.materials.form.title')}
            name="title"
            rules={[{ required: true, message: t('instructor.materials.form.titleRequired') }]}
          >
            <Input placeholder={t('instructor.materials.form.titlePlaceholderEdit')} />
          </Form.Item>

          <Form.Item
            label={t('instructor.materials.form.type')}
            name="typeId"
            rules={[{ required: true, message: t('instructor.materials.form.typeRequired') }]}
          >
            <Radio.Group>
              <Radio value={1}>
                <BookOutlined className="mr-2" />
                {t('instructor.materials.document')}
              </Radio>
              <Radio value={2}>
                <VideoCameraOutlined className="mr-2" />
                {t('instructor.materials.video')}
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={t('instructor.materials.form.url')}
            name="url"
            rules={[
              { required: true, message: t('instructor.materials.form.urlRequired') },
              { type: 'url', message: t('instructor.materials.form.urlInvalid') },
            ]}
          >
            <Input placeholder={t('instructor.materials.form.urlPlaceholderEdit')} />
          </Form.Item>

          <Form.Item
            label={t('instructor.materials.form.description')}
            name="description"
          >
            <Input.TextArea
              rows={4}
              placeholder={t('instructor.materials.form.descriptionPlaceholderEdit')}
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {t('instructor.materials.buttons.update')}
            </Button>
            <Button onClick={onCancel}>{t('instructor.materials.buttons.cancel')}</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
