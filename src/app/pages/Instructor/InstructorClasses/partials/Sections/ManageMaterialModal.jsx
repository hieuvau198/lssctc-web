import React, { useState, useEffect } from 'react';
import { Modal, Alert, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { FileText, Trash2, Link, X } from 'lucide-react';
import {
  getMaterialsByInstructorId,
  getMaterialsByActivityId,
  assignMaterialToActivity,
  removeMaterialFromActivity,
} from '../../../../../apis/Instructor/InstructorMaterialsApi';

const { Option } = Select;

const ManageMaterialModal = ({ activity, isVisible, onClose, onUpdate }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedMaterial, setAssignedMaterial] = useState(null);
  const [materialLibrary, setMaterialLibrary] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    if (!activity) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch currently assigned materials
      const assigned = await getMaterialsByActivityId(activity.id);
      setAssignedMaterial(assigned[0] || null); // Assuming one material per activity

      // 2. Fetch all available materials for the current instructor
      // No ID needed, backend handles context via token
      const library = await getMaterialsByInstructorId();
      setMaterialLibrary(library || []);

    } catch (err) {
      setError(err.message || t('instructor.classes.manageMaterialModal.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
    } else {
      // Reset state on close
      setAssignedMaterial(null);
      setMaterialLibrary([]);
      setSelectedMaterialId(null);
      setError(null);
    }
  }, [isVisible, activity]);

  const handleAssign = async () => {
    if (!selectedMaterialId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await assignMaterialToActivity(activity.id, selectedMaterialId);
      onUpdate();
    } catch (err) {
      setError(err.message || t('instructor.classes.manageMaterialModal.assignFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!assignedMaterial) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Use learningMaterialId (the ID in the library) not the assignment ID
      await removeMaterialFromActivity(activity.id, assignedMaterial.learningMaterialId);
      onUpdate();
    } catch (err) {
      setError(err.message || t('instructor.classes.manageMaterialModal.removeFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin mb-3"></div>
          <p className="text-neutral-600 font-medium text-sm">{t('common.loading')}</p>
        </div>
      );
    }

    if (assignedMaterial) {
      return (
        <div>
          <h3 className="text-sm font-black text-black uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <FileText className="w-3 h-3 text-black" />
            </div>
            {t('instructor.classes.manageMaterialModal.assignedMaterial')}
          </h3>
          <div className="p-4 border-2 border-neutral-200 bg-neutral-50 flex justify-between items-center">
            <div>
              <p className="font-bold text-neutral-800">{assignedMaterial.name}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-400 border border-yellow-600 text-xs font-bold uppercase text-black">
                {assignedMaterial.type}
              </span>
            </div>
            <button
              onClick={handleRemove}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-500 border-2 border-red-700 text-white font-bold uppercase text-xs tracking-wider hover:bg-red-600 hover:shadow-[3px_3px_0px_0px_rgba(185,28,28,1)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <Trash2 className="w-3 h-3" />
              {t('instructor.classes.manageMaterialModal.remove')}
            </button>
          </div>
        </div>
      );
    }

    // No material assigned, show assignment UI
    return (
      <div>
        <h3 className="text-sm font-black text-black uppercase tracking-wider mb-2 flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 border-2 border-black flex items-center justify-center">
            <Link className="w-3 h-3 text-black" />
          </div>
          {t('instructor.classes.manageMaterialModal.assignMaterial')}
        </h3>
        <p className="text-sm text-neutral-500 mb-3">
          {t('instructor.classes.manageMaterialModal.assignMaterialDesc')}
        </p>
        <div className="flex gap-3">
          <Select
            showSearch
            placeholder={t('instructor.classes.manageMaterialModal.searchPlaceholder')}
            style={{ flex: 1 }}
            onChange={(value) => setSelectedMaterialId(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            className="industrial-select"
          >
            {materialLibrary.map((mat) => (
              <Option key={mat.id} value={mat.id}>
                {mat.name} ({mat.type})
              </Option>
            ))}
          </Select>
          <button
            onClick={handleAssign}
            disabled={!selectedMaterialId || isSubmitting}
            className="px-5 py-2 bg-yellow-400 border-2 border-black text-black font-black uppercase text-xs tracking-wider hover:bg-yellow-500 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            {t('instructor.classes.manageMaterialModal.assign')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Industrial Modal Styles */}
      <style>{`
        .industrial-modal .ant-modal-content {
          border-radius: 0 !important;
          border: 2px solid #171717 !important;
          overflow: hidden;
        }
        .industrial-modal .ant-modal-header {
          background: linear-gradient(to right, #facc15, #fbbf24, #facc15) !important;
          border-bottom: 2px solid #171717 !important;
          border-radius: 0 !important;
          padding: 16px 24px !important;
        }
        .industrial-modal .ant-modal-title {
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.025em !important;
          color: #171717 !important;
          font-size: 14px !important;
        }
        .industrial-modal .ant-modal-close-x {
          color: #171717 !important;
          font-weight: bold;
        }
        .industrial-modal .ant-modal-body {
          padding: 20px 24px !important;
        }
        .industrial-modal .ant-modal-footer {
          border-top: 2px solid #e5e5e5 !important;
          padding: 12px 24px !important;
        }
        .industrial-select .ant-select-selector {
          border-radius: 0 !important;
          border: 2px solid #e5e5e5 !important;
          height: 40px !important;
        }
        .industrial-select .ant-select-selector:hover,
        .industrial-select.ant-select-focused .ant-select-selector {
          border-color: #facc15 !important;
          box-shadow: none !important;
        }
        .industrial-select .ant-select-selection-search-input {
          height: 36px !important;
        }
        .industrial-select .ant-select-selection-placeholder,
        .industrial-select .ant-select-selection-item {
          line-height: 36px !important;
        }
      `}</style>

      <Modal
        title={t('instructor.classes.manageMaterialModal.title', { title: activity?.title || '' })}
        visible={isVisible}
        onCancel={onClose}
        wrapClassName="industrial-modal"
        footer={[
          <button
            key="close"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-100 border-2 border-neutral-300 text-neutral-700 font-bold uppercase text-xs tracking-wider hover:border-black hover:text-black transition-all flex items-center gap-2"
          >
            <X className="w-3 h-3" />
            {t('instructor.classes.manageMaterialModal.close')}
          </button>,
        ]}
      >
        {error && <Alert message={t('common.error')} description={error} type="error" showIcon closable className="mb-4" />}
        {renderContent()}
      </Modal>
    </>
  );
};

export default ManageMaterialModal;
