import React, { useEffect } from 'react';
import { Drawer, Form, Input, Space, Button, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { X, Save, Plus, Pencil, FileText } from 'lucide-react';

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

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  const getTitle = () => {
    if (isCreateMode) return t('simManager.tasks.drawer.createTitle');
    if (isEditMode) return t('simManager.tasks.drawer.editTitle');
    return t('simManager.tasks.drawer.viewTitle');
  };

  const getIcon = () => {
    if (isCreateMode) return <Plus className="w-5 h-5" />;
    if (isEditMode) return <Pencil className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
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
      open={visible}
      onClose={onClose}
      width={600}
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
            <button
              onClick={onSwitchToEdit}
              className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              {t('simManager.tasks.edit')}
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-black font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-all"
              >
                {t('simManager.tasks.drawer.cancel')}
              </button>
              <button
                onClick={onSubmit}
                className="px-6 py-2 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  isCreateMode ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />
                )}
                {isCreateMode ? t('simManager.tasks.drawer.create') : t('simManager.tasks.drawer.update')}
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
      {loading ? (
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          disabled={isViewMode}
          className="industrial-form"
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
              className="h-11"
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
              className="h-11"
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
              rows={3}
              placeholder={t('simManager.tasks.form.expectedResultPlaceholder')}
              maxLength={150}
              showCount
              className="resize-none"
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default DrawerForm;
