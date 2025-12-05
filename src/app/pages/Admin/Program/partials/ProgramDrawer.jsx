import React from "react";
import { useTranslation } from 'react-i18next';
import { Drawer, Space, Button, Popconfirm } from "antd";
import ProgramCreateForm from "./ProgramCreateForm";
import ProgramEditForm from "./ProgramEditForm";
import ProgramDetailView from "./ProgramDetailView";

const ProgramDrawer = ({
  open,
  mode, // 'create' | 'view' | 'edit'
  currentProgram,
  createForm,
  editForm,
  submitting,
  detailLoading,
  deletingId,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onSwitchToEdit,
  onSwitchToView, // Add this prop
}) => {
  const { t } = useTranslation();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return t('admin.programs.createProgram');
      case 'edit':
        return t('admin.programs.editProgram');
      default:
        return currentProgram?.name || t('admin.programs.programDetail');
    }
  };

  const getExtra = () => {
    if (mode === 'view' && currentProgram) {
      return (
        <Space>
          <Button onClick={onSwitchToEdit}>{t('common.edit')}</Button>
          <Popconfirm
            title={t('admin.programs.deleteConfirmTitle')}
            description={t('admin.programs.deleteConfirmDesc')}
            onConfirm={() => onDelete(currentProgram.id)}
            okButtonProps={{ loading: deletingId === currentProgram.id }}
          >
            <Button danger loading={deletingId === currentProgram.id}>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (mode) {
      case 'create':
        return (
          <ProgramCreateForm
            form={createForm}
            onFinish={onCreate}
            onCancel={onClose}
            submitting={submitting}
          />
        );
      case 'edit':
        return (
          <ProgramEditForm
            form={editForm}
            onFinish={onUpdate}
            onCancel={onSwitchToView}
            submitting={submitting}
          />
        );
      case 'view':
        return (
          <ProgramDetailView
            program={currentProgram}
            loading={detailLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      title={getTitle()}
      extra={getExtra()}
    >
      {renderContent()}
    </Drawer>
  );
};

export default ProgramDrawer;