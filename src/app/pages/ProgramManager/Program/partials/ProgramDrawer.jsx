import React from "react";
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
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create Program';
      case 'edit':
        return 'Edit Program';
      default:
        return currentProgram?.name || 'Program Detail';
    }
  };

  const getExtra = () => {
    if (mode === 'view' && currentProgram) {
      return (
        <Space>
          <Button onClick={onSwitchToEdit}>Edit</Button>
          <Popconfirm
            title="Delete program?"
            description="Are you sure you want to delete this program?"
            onConfirm={() => onDelete(currentProgram.id)}
            okButtonProps={{ loading: deletingId === currentProgram.id }}
          >
            <Button danger loading={deletingId === currentProgram.id}>
              Delete
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