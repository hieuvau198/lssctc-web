import React from "react";
import { useTranslation } from 'react-i18next';
import { Drawer, Popconfirm } from "antd";
import { X, Edit, Trash2 } from "lucide-react";
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
  onSwitchToView,
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

  const renderTitle = () => (
    <div className="flex items-center gap-3">
      <div className="w-2 h-8 bg-yellow-400" />
      <span className="text-xl font-bold uppercase tracking-tight text-black">
        {getTitle()}
      </span>
    </div>
  );

  const renderExtra = () => {
    if (mode === 'view' && currentProgram) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToEdit}
            className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-100 text-black font-bold uppercase text-xs tracking-wider border-2 border-black hover:bg-yellow-400 transition-colors"
          >
            <Edit className="w-4 h-4" />
            {t('common.edit')}
          </button>
          <Popconfirm
            title={t('admin.programs.deleteConfirmTitle')}
            description={t('admin.programs.deleteConfirmDesc')}
            onConfirm={() => onDelete(currentProgram.id)}
            okButtonProps={{ loading: deletingId === currentProgram.id }}
          >
            <button
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 font-bold uppercase text-xs tracking-wider border-2 border-red-300 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('common.delete')}
            </button>
          </Popconfirm>
        </div>
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
      title={renderTitle()}
      extra={renderExtra()}
      closeIcon={
        <div className="w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-yellow-400 transition-colors">
          <X className="w-4 h-4" />
        </div>
      }
      styles={{
        header: {
          borderBottom: '2px solid #000',
          background: '#fafafa'
        },
        body: {
          background: '#fff'
        }
      }}
    >
      {/* Yellow accent bar */}
      <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />

      {renderContent()}
    </Drawer>
  );
};

export default ProgramDrawer;