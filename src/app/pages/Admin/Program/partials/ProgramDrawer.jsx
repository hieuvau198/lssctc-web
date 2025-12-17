import React from "react";
import { useTranslation } from 'react-i18next';
import { Drawer, Popconfirm } from "antd";
import { X, Edit, Trash2, Layers } from "lucide-react";
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

  const getSubtitle = () => {
    switch (mode) {
      case 'create':
        return t('admin.programs.form.subtitle') || 'Fill in the program details';
      case 'edit':
        return t('admin.programs.form.editSubtitle') || 'Update program information';
      default:
        return t('admin.programs.form.viewSubtitle') || 'Program details';
    }
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
      title={null}
      closable={false}
      styles={{
        header: { display: 'none' },
        body: { padding: 0 },
      }}
    >
      {/* Custom Industrial Header */}
      <div className="sticky top-0 z-10">
        <div className="h-1.5 bg-yellow-400" />
        <div className="bg-black px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center shadow-lg">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white m-0">
                {getTitle()}
              </h3>
              <p className="text-neutral-400 text-xs m-0 mt-1">
                {getSubtitle()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Buttons */}
            {mode === 'view' && currentProgram && (
              <>
                <button
                  onClick={onSwitchToEdit}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-transparent text-white font-bold uppercase text-xs tracking-wider border-2 border-white/50 hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-all"
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
                    className="inline-flex items-center gap-2 px-3 py-2 bg-transparent text-red-500 font-bold uppercase text-xs tracking-wider border-2 border-red-500/50 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('common.delete')}
                  </button>
                </Popconfirm>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border-2 border-white/50 hover:bg-yellow-400 hover:border-yellow-400 transition-all group"
            >
              <X className="w-5 h-5 text-white group-hover:text-black" />
            </button>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </Drawer>
  );
};

export default ProgramDrawer;
