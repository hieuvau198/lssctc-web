import React from 'react';
import { Drawer, Form, Input, Button, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const BrandModelDrawerForm = ({
  visible = false,
  mode = 'create', // 'create', 'edit', 'view'
  loading = false,
  form,
  onClose = () => {},
  onSubmit = () => {},
  onSwitchToEdit = () => {},
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
      title={title}
      placement="right"
      width={520}
      onClose={onClose}
      open={visible}
      footer={
        <div className="flex justify-end gap-2">
          {isViewMode ? (
            <>
              <Button onClick={onClose}>{t('simManager.brandModel.drawer.close')}</Button>
              <Button type="primary" onClick={onSwitchToEdit}>
                {t('simManager.brandModel.edit')}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onClose}>{t('simManager.brandModel.drawer.cancel')}</Button>
              <Button type="primary" onClick={onSubmit} loading={loading}>
                {mode === 'create' ? t('simManager.brandModel.drawer.create') : t('simManager.brandModel.drawer.update')}
              </Button>
            </>
          )}
        </div>
      }
    >
      <Form form={form} layout="vertical" disabled={isViewMode}>
        <Form.Item
          name="name"
          label={t('simManager.brandModel.form.name')}
          rules={[
            { required: true, message: t('simManager.brandModel.form.nameRequired') },
            { max: 100, message: t('simManager.brandModel.form.nameMax') },
          ]}
        >
          <Input placeholder={t('simManager.brandModel.form.namePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('simManager.brandModel.form.description')}
          rules={[{ max: 500, message: t('simManager.brandModel.form.descriptionMax') }]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t('simManager.brandModel.form.descriptionPlaceholder')}
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
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default BrandModelDrawerForm;
