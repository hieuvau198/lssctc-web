// src\app\pages\SimManager\Settings\partials\UpdateComponent.jsx

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateComponent } from '../../../../apis/SimulationManager/SimulationManagerComponentApi';
import { Form, Input, Switch, Button, Space, Alert } from 'antd';

export default function UpdateComponent({ component, onUpdated, onCancel }) {
  const { t } = useTranslation();
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
      setErr(ex.message || t('simManager.settings.updateComponentForm.updateFailed'));
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
            <Form.Item label={t('simManager.settings.updateComponentForm.name')} name="name" rules={[{ required: true, message: t('simManager.settings.updateComponentForm.nameRequired') }]}>
              <Input placeholder={t('simManager.settings.updateComponentForm.namePlaceholder')} />
            </Form.Item>
            <Form.Item label={t('simManager.settings.updateComponentForm.description')} name="description">
              <Input.TextArea placeholder={t('simManager.settings.updateComponentForm.descriptionPlaceholder')} rows={5} />
            </Form.Item>
            <Form.Item label={t('simManager.settings.updateComponentForm.active')} name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
          <div>
            <Form.Item label={t('simManager.settings.updateComponentForm.imageUrl')} name="imageUrl">
              <Input placeholder={t('simManager.settings.updateComponentForm.imageUrlPlaceholder')} />
            </Form.Item>
            <div className="border rounded-lg bg-slate-50 p-2">
              <div className="text-xs text-slate-500 mb-1">{t('simManager.settings.updateComponentForm.preview')}</div>
              <div className="w-full h-64 rounded-md bg-white flex items-center justify-center overflow-hidden">
                {imageUrl && !imgError ? (
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="max-h-full max-w-full object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-slate-400 text-sm">{t('simManager.settings.updateComponentForm.pasteImageUrl')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {t('simManager.settings.updateComponentForm.updateButton')}
            </Button>
            <Button onClick={onCancel}>{t('common.cancel')}</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
}
