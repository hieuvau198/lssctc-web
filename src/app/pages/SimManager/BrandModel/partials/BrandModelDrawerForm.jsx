import React from 'react';
import { Drawer, Form, Input, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { X, Save, Plus, Pencil, Truck } from 'lucide-react';

const BrandModelDrawerForm = ({
  visible = false,
  mode = 'create',
  loading = false,
  form,
  onClose = () => { },
  onSubmit = () => { },
  onSwitchToEdit = () => { },
}) => {
  const { t } = useTranslation();
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  const getTitle = () => {
    if (isCreateMode) return t('simManager.brandModel.drawer.createTitle');
    if (isEditMode) return t('simManager.brandModel.drawer.editTitle');
    return t('simManager.brandModel.drawer.viewTitle');
  };

  const getIcon = () => {
    if (isCreateMode) return <Plus className="w-5 h-5" />;
    if (isEditMode) return <Pencil className="w-5 h-5" />;
    return <Truck className="w-5 h-5" />;
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {getIcon()}
          </span>
          <span className="font-black uppercase tracking-tight text-xl">
            {getTitle()}
          </span>
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
      open={visible}
      closeIcon={
        <div className="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-black transition-all">
          <X className="w-5 h-5" />
        </div>
      }
      styles={{
        header: {
          borderBottom: '2px solid #000',
          padding: '1.25rem',
        },
        body: {
          padding: '1.5rem',
          backgroundColor: '#fff',
        },
        footer: {
          borderTop: '2px solid #000',
          padding: '1rem',
          backgroundColor: '#f5f5f5', // neutral-100
        }
      }}
      footer={
        <div className="flex justify-end gap-3">
          {isViewMode ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-black font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-all"
              >
                {t('simManager.brandModel.drawer.close')}
              </button>
              <button
                onClick={onSwitchToEdit}
                className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                {t('simManager.brandModel.edit')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-black font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-all"
              >
                {t('simManager.brandModel.drawer.cancel')}
              </button>
              <button
                onClick={onSubmit}
                disabled={loading}
                className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  isCreateMode ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />
                )}
                {isCreateMode ? t('simManager.brandModel.drawer.create') : t('simManager.brandModel.drawer.update')}
              </button>
            </>
          )}
        </div>
      }
    >
      <style>{`
            .industrial-form .ant-form-item-label label {
                font-weight: 700 !important;
                text-transform: uppercase !important;
                font-size: 0.75rem !important;
                letter-spacing: 0.05em !important;
            }
            .industrial-form .ant-input,
            .industrial-form .ant-input-textarea {
                border: 2px solid #e5e5e5 !important;
                border-radius: 0 !important;
                font-weight: 500 !important;
                padding: 8px 12px !important;
            }
            .industrial-form .ant-input:focus,
            .industrial-form .ant-input-textarea:focus,
            .industrial-form .ant-input:hover,
            .industrial-form .ant-input-textarea:hover {
                border-color: #000 !important;
                box-shadow: none !important;
            }
        `}</style>
      <Form form={form} layout="vertical" disabled={isViewMode} className="industrial-form">
        <Form.Item
          name="name"
          label={t('simManager.brandModel.form.name')}
          rules={[
            { required: true, message: t('simManager.brandModel.form.nameRequired') },
            { max: 100, message: t('simManager.brandModel.form.nameMax') },
          ]}
        >
          <Input
            placeholder={t('simManager.brandModel.form.namePlaceholder')}
            maxLength={100}
            showCount
            className="h-11"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('simManager.brandModel.form.description')}
          rules={[{ max: 500, message: t('simManager.brandModel.form.descriptionMax') }]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t('simManager.brandModel.form.descriptionPlaceholder')}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label={t('simManager.brandModel.form.activeStatus')}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch
            checkedChildren={t('simManager.brandModel.form.active')}
            unCheckedChildren={t('simManager.brandModel.form.inactive')}
            className="bg-neutral-300 [&.ant-switch-checked]:bg-yellow-400"
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default BrandModelDrawerForm;
