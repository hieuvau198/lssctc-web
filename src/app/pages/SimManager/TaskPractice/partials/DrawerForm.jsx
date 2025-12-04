import React, { useEffect } from 'react';
import { Drawer, Form, Input, Space, Button, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';

const DrawerForm = ({
  visible,
  mode, // 'create', 'edit', 'view'
  loading,
  form,
  onClose,
  onSubmit,
  onSwitchToEdit,
}) => {
  const { t } = useTranslation();

  return (
    <Drawer
      title={
        mode === 'create'
          ? t('simManager.tasks.drawer.createTitle')
          : mode === 'edit'
          ? t('simManager.tasks.drawer.editTitle')
          : t('simManager.tasks.drawer.viewTitle')
      }
      open={visible}
      onClose={onClose}
      width={600}
      extra={
        <Space>
          {mode === 'view' && (
            <Button type="primary" onClick={onSwitchToEdit}>
              {t('simManager.tasks.edit')}
            </Button>
          )}
          {mode !== 'view' && (
            <>
              <Button onClick={onClose}>{t('simManager.tasks.drawer.cancel')}</Button>
              <Button type="primary" onClick={onSubmit} loading={loading}>
                {mode === 'create' ? t('simManager.tasks.drawer.create') : t('simManager.tasks.drawer.update')}
              </Button>
            </>
          )}
        </Space>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Form
          form={form}
          layout="vertical"
          disabled={mode === 'view'}
        >
          <Form.Item
            name="taskName"
            label={t('simManager.tasks.form.taskName')}
            rules={[
              { required: true, message: t('simManager.tasks.form.taskNameRequired') },
              { max: 100, message: t('simManager.tasks.form.taskNameMax') }
            ]}
          >
            <Input 
              placeholder={t('simManager.tasks.form.taskNamePlaceholder')} 
              maxLength={100}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="taskCode"
            label={t('simManager.tasks.form.taskCode')}
            rules={[
              { required: true, message: t('simManager.tasks.form.taskCodeRequired') },
              { max: 50, message: t('simManager.tasks.form.taskCodeMax') }
            ]}
          >
            <Input 
              placeholder={t('simManager.tasks.form.taskCodePlaceholder')} 
              maxLength={50}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="taskDescription"
            label={t('simManager.tasks.form.taskDescription')}
            rules={[
              { max: 500, message: t('simManager.tasks.form.taskDescriptionMax') }
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder={t('simManager.tasks.form.taskDescriptionPlaceholder')} 
              maxLength={500}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="expectedResult"
            label={t('simManager.tasks.form.expectedResult')}
            rules={[
              { max: 100, message: t('simManager.tasks.form.expectedResultMax') }
            ]}
          >
            <Input.TextArea 
              rows={2} 
              placeholder={t('simManager.tasks.form.expectedResultPlaceholder')} 
              maxLength={150}
              showCount
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default DrawerForm;
