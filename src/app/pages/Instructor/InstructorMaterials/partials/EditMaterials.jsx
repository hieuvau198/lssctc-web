import { ArrowLeft, FileText, Video, Save } from 'lucide-react';
import { Form, Input, Radio, App, Drawer, Skeleton } from 'antd';
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
          const learningMaterialType = material.learningMaterialType || material.learningMaterialTypeName || material.typeName || '';
          form.setFieldsValue({
            title: material.name,
            description: material.description || '',
            url: material.url || material.materialUrl,
            learningMaterialType,
          });
          setLoading(false);
          return;
        }

        const res = await getMaterials({ page: 1, pageSize: 1000 });
        const materials = Array.isArray(res.items) ? res.items : [];
        const material = materials.find(m => Number(m.id) === Number(id));

        if (material) {
          const learningMaterialType = material.learningMaterialType || material.learningMaterialTypeName || material.typeName || '';
          form.setFieldsValue({
            title: material.name,
            description: material.description || '',
            url: material.url || material.materialUrl,
            learningMaterialType,
          });
        } else {
          if (!open) navigate('/instructor/materials');
        }
      } catch (e) {
        console.error('Load material error', e);
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
        learningMaterialType: values.learningMaterialType,
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
          navigate('/instructor/materials', { replace: true });
        }
      });
    } catch (e) {
      console.error('Update material error', e);

      let errorMsg = e?.message || t('instructor.materials.messages.updateFailed');
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

  const content = loading ? (
    <div className="bg-white border-2 border-black p-6">
      <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  ) : (
    <div className="space-y-6">
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />
        <div className="p-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label={<span className="font-bold uppercase text-sm tracking-wider">{t('instructor.materials.form.title')}</span>}
              name="title"
              rules={[{ required: true, message: t('instructor.materials.form.titleRequired') }]}
            >
              <Input
                placeholder={t('instructor.materials.form.titlePlaceholderEdit')}
                className="border-2 border-black focus:border-yellow-400 h-11"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-bold uppercase text-sm tracking-wider">{t('instructor.materials.form.type')}</span>}
              name="learningMaterialType"
              rules={[{ required: true, message: t('instructor.materials.form.typeRequired') }]}
            >
              <Radio.Group className="flex gap-4">
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-black cursor-pointer transition-all hover:bg-neutral-50">
                  <Radio value="Document" />
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-yellow-400">
                    <FileText className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-bold">{t('instructor.materials.document')}</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-black cursor-pointer transition-all hover:bg-neutral-50">
                  <Radio value="Video" />
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-black">
                    <Video className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="font-bold">{t('instructor.materials.video')}</span>
                </label>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<span className="font-bold uppercase text-sm tracking-wider">{t('instructor.materials.form.url')}</span>}
              name="url"
              rules={[
                { required: true, message: t('instructor.materials.form.urlRequired') },
                { type: 'url', message: t('instructor.materials.form.urlInvalid') },
              ]}
            >
              <Input
                placeholder={t('instructor.materials.form.urlPlaceholderEdit')}
                className="border-2 border-black focus:border-yellow-400 h-11"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-bold uppercase text-sm tracking-wider">{t('instructor.materials.form.description')}</span>}
              name="description"
            >
              <Input.TextArea
                rows={4}
                placeholder={t('instructor.materials.form.descriptionPlaceholderEdit')}
                className="border-2 border-black focus:border-yellow-400"
              />
            </Form.Item>

            <Form.Item className="mb-0 pt-4 border-t-2 border-neutral-200">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-neutral-100 transition-all"
                >
                  {t('instructor.materials.buttons.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t('instructor.materials.buttons.update')}
                </button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );

  if (typeof open !== 'undefined') {
    return (
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
              <Save className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="font-black text-black uppercase tracking-tight">{t('instructor.materials.editMaterial')}</span>
          </div>
        }
        placement="right"
        width={720}
        onClose={onCancel}
        open={open}
        destroyOnClose
        styles={{
          header: {
            borderBottom: '2px solid #000',
            padding: '16px 24px',
          },
          body: {
            padding: 24,
            background: '#f5f5f5',
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">{t('instructor.materials.editMaterial')}</h1>
      </div>
      {content}
    </div>
  );
}
