import React from 'react';
import { Drawer, Form, Input, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

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
  const title = mode === 'create'
    ? t('simManager.brandModel.drawer.createTitle')
    : mode === 'edit'
      ? t('simManager.brandModel.drawer.editTitle')
      : t('simManager.brandModel.drawer.viewTitle');

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-yellow-400" />
          <span className="font-black uppercase tracking-wider">{title}</span>
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
      open={visible}
      styles={{
        header: {
          borderBottom: '2px solid #171717',
        },
        body: {
          padding: '24px',
        },
        footer: {
          borderTop: '2px solid #171717',
          padding: '16px 24px',
        }
      }}
      footer={
        <div className="flex justify-end gap-3">
          {isViewMode ? (
            <>
              <button
                onClick={onClose}
                className="h-10 px-6 border-2 border-neutral-300 text-neutral-700 font-bold uppercase tracking-wider hover:border-neutral-900 transition-all"
              >
                {t('simManager.brandModel.drawer.close')}
              </button>
              <button
                onClick={onSwitchToEdit}
                className="h-10 px-6 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-all"
              >
                {t('simManager.brandModel.edit')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="h-10 px-6 border-2 border-neutral-300 text-neutral-700 font-bold uppercase tracking-wider hover:border-neutral-900 transition-all"
              >
                {t('simManager.brandModel.drawer.cancel')}
              </button>
              <button
                onClick={onSubmit}
                disabled={loading}
                className="h-10 px-6 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                {mode === 'create' ? t('simManager.brandModel.drawer.create') : t('simManager.brandModel.drawer.update')}
              </button>
            </>
          )}
        </div>
      }
    >
      <Form form={form} layout="vertical" disabled={isViewMode}>
        <Form.Item
          name="name"
          label={
            <span className="font-bold uppercase tracking-wider text-neutral-700">
              {t('simManager.brandModel.form.name')}
            </span>
          }
          rules={[
            { required: true, message: t('simManager.brandModel.form.nameRequired') },
            { max: 100, message: t('simManager.brandModel.form.nameMax') },
          ]}
        >
          <Input
            placeholder={t('simManager.brandModel.form.namePlaceholder')}
            className="h-11 border-2 border-neutral-300 hover:border-yellow-400 focus:border-yellow-400"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <span className="font-bold uppercase tracking-wider text-neutral-700">
              {t('simManager.brandModel.form.description')}
            </span>
          }
          rules={[{ max: 500, message: t('simManager.brandModel.form.descriptionMax') }]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t('simManager.brandModel.form.descriptionPlaceholder')}
            className="border-2 border-neutral-300 hover:border-yellow-400 focus:border-yellow-400"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label={
            <span className="font-bold uppercase tracking-wider text-neutral-700">
              {t('simManager.brandModel.form.activeStatus')}
            </span>
          }
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
