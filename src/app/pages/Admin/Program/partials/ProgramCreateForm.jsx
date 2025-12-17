import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Form, Input, Image } from "antd";
import { Plus, X, ImageIcon, FileImage } from "lucide-react";

const ProgramCreateForm = ({ form, onFinish, onCancel, submitting }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [bgPreview, setBgPreview] = useState(null);

  useEffect(() => {
    try {
      const v = form?.getFieldValue?.('imageUrl') || '';
      setPreview(v?.trim() ? v.trim() : null);

      const bg = form?.getFieldValue?.('backgroundImageUrl') || '';
      setBgPreview(bg?.trim() ? bg.trim() : null);
    } catch (err) { }
  }, [form]);

  return (
    <>
      {/* Industrial Form Styles with Effects */}
      <style>{`
        .industrial-program-form .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #171717 !important;
          transition: color 0.2s ease !important;
        }
        .industrial-program-form .ant-form-item:hover .ant-form-item-label > label {
          color: #ca8a04 !important;
        }
        .industrial-program-form .ant-input,
        .industrial-program-form .ant-input-affix-wrapper {
          border-radius: 0 !important;
          transition: all 0.3s ease !important;
        }
        .industrial-program-form .ant-input:hover,
        .industrial-program-form .ant-input-affix-wrapper:hover {
          border-color: #facc15 !important;
        }
        .industrial-program-form .ant-input:focus,
        .industrial-program-form .ant-input-affix-wrapper:focus,
        .industrial-program-form .ant-input-affix-wrapper-focused {
          border-color: #facc15 !important;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2) !important;
        }
        .industrial-program-form textarea.ant-input {
          border-radius: 0 !important;
        }
        
        /* Image preview hover effects */
        .image-preview-container {
          transition: all 0.3s ease;
        }
        .image-preview-container:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .image-preview-container img {
          transition: transform 0.5s ease;
        }
        .image-preview-container:hover img {
          transform: scale(1.1);
        }
        
        /* Button animations */
        .industrial-btn {
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .industrial-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }
        .industrial-btn:active::after {
          width: 200px;
          height: 200px;
        }
        .industrial-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .industrial-btn:active {
          transform: translateY(0);
        }
        .industrial-btn-primary:hover {
          box-shadow: 0 4px 16px rgba(250, 204, 21, 0.4);
        }
      `}</style>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="industrial-program-form"
        initialValues={{
          durationHours: 0,
          isActive: true,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              {t('admin.programs.form.imagePreview')}
            </div>
            <div className="image-preview-container w-32 h-32 flex items-center justify-center overflow-hidden bg-neutral-100 border border-neutral-300 cursor-pointer">
              {preview ? (
                <Image src={preview} preview={{ mask: t('common.clickToPreview') }} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-neutral-400">
                  <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                  <span className="text-xs">{t('common.noImage')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Background Image */}
          <div>
            <Form.Item
              name="backgroundImageUrl"
              label="Background Image URL"
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

            <div className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-1">
              <FileImage className="w-3 h-3" />
              Background Preview
            </div>
            <div className="image-preview-container w-full h-32 flex items-center justify-center overflow-hidden bg-neutral-800 border border-neutral-700 cursor-pointer">
              {bgPreview ? (
                <Image src={bgPreview} preview={{ mask: t('common.clickToPreview') }} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-neutral-500">
                  <FileImage className="w-8 h-8 mb-1 opacity-50" />
                  <span className="text-xs">No background</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Form.Item
          name="description"
          label={t('admin.programs.form.description')}
          rules={[{ required: true, message: t('admin.programs.form.descriptionRequired') }]}
          className="mt-6"
        >
          <Input.TextArea
            rows={4}
            maxLength={1000}
            showCount
            placeholder={t('admin.programs.form.descriptionPlaceholder')}
          />
        </Form.Item>

        {/* Industrial Buttons with Effects */}
        <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="industrial-btn inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-700 font-medium text-sm border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400"
          >
            <X className="w-4 h-4" />
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="industrial-btn industrial-btn-primary inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-semibold text-sm border border-yellow-500 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {t('admin.programs.createProgram')}
          </button>
        </div>
      </Form>
    </>
  );
};

export default ProgramCreateForm;