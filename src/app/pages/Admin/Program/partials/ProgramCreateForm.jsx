import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Form, Input, Image } from "antd";
import { Plus, X, ImageIcon, FileImage, Layers, FileText } from "lucide-react";

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

    // Section Header Component
    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-neutral-200">
            <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center">
                <Icon className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-sm uppercase tracking-wider text-black">{title}</span>
        </div>
    );

    return (
        <>
            {/* Industrial Form Styles */}
            <style>{`
        .industrial-program-form .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #171717 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .industrial-program-form .ant-input,
        .industrial-program-form .ant-input-affix-wrapper {
          border-radius: 0 !important;
          border-width: 2px !important;
        }
        .industrial-program-form .ant-input:focus,
        .industrial-program-form .ant-input-affix-wrapper:focus,
        .industrial-program-form .ant-input-affix-wrapper-focused {
          border-color: #facc15 !important;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.25) !important;
        }
        .industrial-program-form textarea.ant-input {
          border-radius: 0 !important;
        }
        
        /* Image preview styles */
        .program-image-preview {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .program-image-preview:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: #facc15 !important;
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
                {/* Basic Information Section */}
                <SectionHeader icon={Layers} title={t('admin.programs.form.basicInfo') || "Basic Information"} />

                <Form.Item
                    name="name"
                    label={t('admin.programs.form.name')}
                    rules={[{ required: true, message: t('admin.programs.form.nameRequired') }]}
                >
                    <Input
                        maxLength={120}
                        showCount
                        placeholder={t('admin.programs.form.namePlaceholder')}
                        prefix={<Layers className="w-4 h-4 text-neutral-400" />}
                    />
                </Form.Item>

                {/* Images Section */}
                <SectionHeader icon={ImageIcon} title={t('admin.programs.form.images') || "Program Images"} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Main Image */}
                    <div className="border-2 border-neutral-200 p-4 bg-white hover:border-yellow-400 transition-colors">
                        <Form.Item
                            name="imageUrl"
                            label={t('admin.programs.form.imageUrl')}
                            rules={[
                                { required: true, message: t('admin.programs.form.imageUrlRequired') },
                                { type: "url", message: t('admin.programs.form.imageUrlInvalid') },
                            ]}
                            className="mb-3"
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

                        <div className="text-xs font-bold uppercase text-neutral-500 mb-2 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            {t('admin.programs.form.imagePreview')}
                        </div>
                        <div className="program-image-preview w-full h-40 flex items-center justify-center bg-neutral-100 border-2 border-neutral-200 cursor-pointer">
                            {preview ? (
                                <Image src={preview} preview={{ mask: t('common.clickToPreview') }} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-neutral-400">
                                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">{t('common.noImage')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Background Image */}
                    <div className="border-2 border-neutral-700 p-4 bg-neutral-900 hover:border-yellow-400 transition-colors">
                        <Form.Item
                            name="backgroundImageUrl"
                            label={<span className="text-white">{t('admin.programs.form.backgroundImageUrl') || "Background Image URL"}</span>}
                            rules={[
                                { type: "url", message: t('admin.programs.form.imageUrlInvalid') },
                            ]}
                            className="mb-3"
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

                        <div className="text-xs font-bold uppercase text-neutral-400 mb-2 flex items-center gap-1">
                            <FileImage className="w-3 h-3" />
                            {t('admin.programs.form.backgroundPreview') || "Background Preview"}
                        </div>
                        <div className="program-image-preview w-full h-40 flex items-center justify-center bg-neutral-800 border-2 border-neutral-700 cursor-pointer">
                            {bgPreview ? (
                                <Image src={bgPreview} preview={{ mask: t('common.clickToPreview') }} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-neutral-500">
                                    <FileImage className="w-10 h-10 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">{t('common.noBackground') || "No background"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <SectionHeader icon={FileText} title={t('admin.programs.form.description')} />

                <Form.Item
                    name="description"
                    rules={[{ required: true, message: t('admin.programs.form.descriptionRequired') }]}
                >
                    <Input.TextArea
                        rows={4}
                        maxLength={1000}
                        showCount
                        placeholder={t('admin.programs.form.descriptionPlaceholder')}
                    />
                </Form.Item>

                {/* Industrial Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-neutral-200 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-700 font-semibold text-sm border-2 border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all"
                    >
                        <X className="w-4 h-4" />
                        {t('common.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-bold text-sm border-2 border-black hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
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
