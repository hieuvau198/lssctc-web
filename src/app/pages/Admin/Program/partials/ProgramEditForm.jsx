import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Form, Input, InputNumber, Switch, Button, Space, Image } from "antd";

const ProgramEditForm = ({ form, onFinish, onCancel, submitting }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    try {
      const v = form?.getFieldValue?.('imageUrl') || '';
      setPreview(v?.trim() ? v.trim() : null);
    } catch (err) {}
  }, [form]);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label={t('admin.programs.form.name')}
        rules={[{ required: true, message: t('admin.programs.form.nameRequired') }]}
      >
        <Input maxLength={120} showCount placeholder={t('admin.programs.form.namePlaceholder')} />
      </Form.Item>

      {/* <Form.Item
        name="durationHours"
        label="Duration (hours)"
        rules={[{ required: true, message: "Please enter duration" }]}
      >
        <InputNumber
          min={0}
          max={1000}
          className="w-full"
          placeholder="Enter duration in hours"
        />
      </Form.Item> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Form.Item
          name="imageUrl"
          label={t('admin.programs.form.imageUrl')}
          rules={[
            { required: true, message: t('admin.programs.form.imageUrlRequired') },
            { type: "url", message: t('admin.programs.form.imageUrlInvalid') },
          ]}
        >
          <Input
            maxLength={300}
            allowClear
            placeholder="https://example.com/image.jpg"
            onChange={(e) => {
              const v = e?.target?.value || '';
              setPreview(v.trim() ? v.trim() : null);
            }}
          />
        </Form.Item>

        <div>
          <div className="text-sm text-gray-600 mb-2">{t('admin.programs.form.imagePreview')}</div>
          <div className="w-32 h-32 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
            {preview ? (
              <Image src={preview} preview={{ mask: t('common.clickToPreview') }} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">{t('common.noImage')}</div>
            )}
          </div>
        </div>
      </div>

      {/* <Form.Item
        name="isActive"
        label="Status"
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item> */}
      
      <Form.Item
        name="description"
        label={t('admin.programs.form.description')}
        rules={[{ required: true, message: t('admin.programs.form.descriptionRequired') }]}
      >
        <Input.TextArea
          rows={3}
          maxLength={500}
          showCount
          placeholder={t('admin.programs.form.descriptionPlaceholder')}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            {t('admin.programs.updateProgram')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProgramEditForm;