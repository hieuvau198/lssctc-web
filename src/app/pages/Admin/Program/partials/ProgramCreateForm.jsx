import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Space, Image } from "antd";

const ProgramCreateForm = ({ form, onFinish, onCancel, submitting }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [bgPreview, setBgPreview] = useState(null); // Added state for background preview

  useEffect(() => {
    try {
      const v = form?.getFieldValue?.('imageUrl') || '';
      setPreview(v?.trim() ? v.trim() : null);

      const bg = form?.getFieldValue?.('backgroundImageUrl') || '';
      setBgPreview(bg?.trim() ? bg.trim() : null);
    } catch (err) {}
  }, [form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        durationHours: 0,
        isActive: true,
        // Set default values matching your DTO
        imageUrl: "https://www-assets.liebherr.com/media/bu-media/lhbu-lwe/images/subhome/liebherr-ltm-1920x1920-1_w736.jpg",
        backgroundImageUrl: "https://templates.framework-y.com/lightwire/images/wide-1.jpg"
      }}
    >
      <Form.Item
        name="name"
        label={t('admin.programs.form.name')}
        rules={[{ required: true, message: t('admin.programs.form.nameRequired') }]}
      >
        <Input maxLength={120} showCount placeholder={t('admin.programs.form.namePlaceholder')} />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Main Image */}
        <div>
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
                placeholder="https://example.com/image.jpg"
                allowClear
                onChange={(e) => {
                const v = e?.target?.value || '';
                setPreview(v.trim() ? v.trim() : null);
                }}
            />
            </Form.Item>

            <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">{t('admin.programs.form.imagePreview')}</div>
            <div className="w-32 h-32 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100 border">
                {preview ? (
                <Image src={preview} preview={{ mask: t('common.clickToPreview') }} className="w-full h-full object-cover" />
                ) : (
                <div className="text-xs text-gray-400 p-2 text-center">{t('common.noImage')}</div>
                )}
            </div>
            </div>
        </div>

        {/* Background Image */}
        <div>
            <Form.Item
            name="backgroundImageUrl"
            label="Background Image URL" // Add translation key if needed: t('admin.programs.form.backgroundImageUrl')
            rules={[
                { type: "url", message: t('admin.programs.form.imageUrlInvalid') },
            ]}
            >
            <Input
                maxLength={300}
                placeholder="https://example.com/bg-image.jpg"
                allowClear
                onChange={(e) => {
                const v = e?.target?.value || '';
                setBgPreview(v.trim() ? v.trim() : null);
                }}
            />
            </Form.Item>

            <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Background Preview</div>
            <div className="w-full h-32 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100 border">
                {bgPreview ? (
                <Image src={bgPreview} preview={{ mask: t('common.clickToPreview') }} className="w-full h-full object-cover" />
                ) : (
                <div className="text-xs text-gray-400 p-2 text-center">No background</div>
                )}
            </div>
            </div>
        </div>
      </div>

      <Form.Item
        name="description"
        label={t('admin.programs.form.description')}
        rules={[{ required: true, message: t('admin.programs.form.descriptionRequired') }]}
      >
        <Input.TextArea
          rows={3}
          maxLength={1000} // Updated to 1000 to match DTO
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
            {t('admin.programs.createProgram')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProgramCreateForm;