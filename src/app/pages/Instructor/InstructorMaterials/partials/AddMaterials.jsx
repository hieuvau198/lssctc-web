import { ArrowLeft, FileText, Video, Plus } from 'lucide-react';
import { Form, Input, Radio, Space, App, Drawer } from 'antd';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createMaterial } from '../../../../apis/Instructor/InstructorMaterialsApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddMaterials({ onSuccess, open, onClose, initialSectionId = '', initialClassId = '' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const query = useQuery();
  const sectionId = initialSectionId || query.get('sectionId') || '';
  const classId = initialClassId || query.get('classId') || '';

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
        title: t('instructor.materials.modal.success'),
        content: t('instructor.materials.messages.createSuccess'),
        okText: t('instructor.materials.modal.ok'),
        centered: true,
        onOk: () => {
          if (typeof onSuccess === 'function') return onSuccess();
          navigate('/instructor/materials', { replace: true });
        }
      });
    } catch (e) {
      console.error('Create material error', e);

      let errorMsg = e?.message || t('instructor.materials.messages.createFailed');
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
        title: t('instructor.materials.messages.createError'),
        content: errorMsg,
        okText: t('instructor.materials.modal.close'),
        centered: true,
      });
    }
  };

  const onCancel = () => {
    if (typeof onClose === 'function') return onClose();
    return navigate(-1);
  };

  const content = (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />
        <div className="p-6">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ typeId: 1 }}
            onFinish={onFinish}
          >
            <Form.Item
              label={<span className="font-bold uppercase text-sm tracking-wider">{t('instructor.materials.form.title')}</span>}
              name="title"
              rules={[{ required: true, message: t('instructor.materials.form.titleRequired') }]}
            >
              <Input
                placeholder={t('instructor.materials.form.titlePlaceholder')}
                className="border-2 border-black focus:border-yellow-400 h-11"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-bold uppercase text-sm tracking-wider">{t('instructor.materials.form.type')}</span>}
              name="typeId"
            >
              <Radio.Group className="flex gap-4">
                <label className={`flex items-center gap-3 px-4 py-3 border-2 border-black cursor-pointer transition-all ${form.getFieldValue('typeId') === 1 ? 'bg-yellow-400' : 'bg-white hover:bg-neutral-50'}`}>
                  <Radio value={1} className="hidden" />
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-yellow-400">
                    <FileText className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-bold">{t('instructor.materials.document')}</span>
                </label>
                <label className={`flex items-center gap-3 px-4 py-3 border-2 border-black cursor-pointer transition-all ${form.getFieldValue('typeId') === 2 ? 'bg-black text-yellow-400' : 'bg-white hover:bg-neutral-50'}`}>
                  <Radio value={2} className="hidden" />
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
              rules={[{ required: true, message: t('instructor.materials.form.urlRequired') }]}
            >
              <Input
                placeholder={t('instructor.materials.form.urlPlaceholder')}
                className="border-2 border-black focus:border-yellow-400 h-11"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-bold uppercase text-sm tracking-wider">{t('instructor.materials.form.description')}</span>}
              name="description"
            >
              <Input.TextArea
                rows={4}
                placeholder={t('instructor.materials.form.descriptionPlaceholder')}
                className="border-2 border-black focus:border-yellow-400"
              />
            </Form.Item>

            <input type="hidden" value={sectionId} readOnly />
            <input type="hidden" value={classId} readOnly />

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
                  className="px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('instructor.materials.buttons.create')}
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
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Plus className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-black uppercase tracking-tight">{t('instructor.materials.addMaterial')}</span>
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
        <h1 className="text-2xl font-black uppercase tracking-tight">{t('instructor.materials.addMaterial')}</h1>
      </div>
      {content}
    </div>
  );
}
