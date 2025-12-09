import { ArrowLeftOutlined, BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Space, App, Drawer } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { updateMaterial, getMaterials } from '../../../../apis/Instructor/InstructorMaterialsApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function EditMaterials({ onSuccess, open, onClose, initialData = null, materialId = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const { id: paramId } = useParams();
  const id = materialId || paramId;
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
        if (initialData) {
          const material = initialData;
          let typeId;
          if (material.typeId) {
            typeId = Number(material.typeId);
          } else {
            const name = material.learningMaterialType || material.learningMaterialTypeName || material.typeName || '';
            const s = String(name).toLowerCase();
            if (s.includes('video')) typeId = 1; // video = 1
            else typeId = 2; // document = 2
          }
          form.setFieldsValue({
            title: material.name,
            description: material.description || '',
            url: material.url || material.materialUrl,
            typeId,
          });
          setLoading(false);
          return;
        }

        // Fallback: fetch materials list to find the material when no initialData provided
        const res = await getMaterials({ page: 1, pageSize: 1000 });
        const materials = Array.isArray(res.items) ? res.items : [];
        const material = materials.find(m => Number(m.id) === Number(id));
        
        if (material) {
          let typeId;
          if (material.typeId) typeId = Number(material.typeId);
          else {
            const name = material.learningMaterialType || material.learningMaterialTypeName || material.typeName || '';
            const s = String(name).toLowerCase();
            if (s.includes('video')) typeId = 1;
            else typeId = 2;
          }
          form.setFieldsValue({
            title: material.name,
            description: material.description || '',
            url: material.url || material.materialUrl,
            typeId,
          });
        } else {
          message.error(t('instructor.materials.messages.materialNotFound'));
          if (!open) navigate('/instructor/materials');
        }
      } catch (e) {
        console.error('Load material error', e);
        message.error(t('instructor.materials.messages.loadMaterialFailed'));
        if (!open) navigate('/instructor/materials');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMaterial();
    }
  }, [id, form, navigate, initialData, open]);

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
          if (typeof onSuccess === 'function') return onSuccess();
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

  const onCancel = () => {
    if (typeof onClose === 'function') return onClose();
    return navigate(-1);
  };

  const content = (
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
  );

  if (typeof open !== 'undefined') {
    return (
      <Drawer
        title={t('instructor.materials.editMaterial')}
        placement="right"
        width={720}
        onClose={onCancel}
        open={open}
        destroyOnClose
      >
        {loading ? <Card loading /> : content}
      </Drawer>
    );
  }

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
      {content}
    </div>
  );
}
