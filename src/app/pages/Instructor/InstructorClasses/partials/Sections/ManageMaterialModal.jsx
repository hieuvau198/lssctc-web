import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Select, Spin, Empty, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  getMaterials,
  getMaterialsByActivityId,
  assignMaterialToActivity,
  removeMaterialFromActivity,
} from '../../../../../apis/Instructor/InstructorMaterialsApi';

const { Title, Text } = Typography;
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

      // 2. Fetch all available materials
      const library = await getMaterials({ page: 1, pageSize: 1000 });
      setMaterialLibrary(library.items || []);
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
      return <div className="text-center p-8"><Spin size="large" /></div>;
    }

    if (assignedMaterial) {
      return (
        <div>
          <Title level={5}>{t('instructor.classes.manageMaterialModal.assignedMaterial')}</Title>
          <div className="p-4 border rounded-md bg-gray-50 flex justify-between items-center">
            <div>
              <Text strong>{assignedMaterial.name}</Text>
              <br />
              <Tag>{assignedMaterial.type}</Tag>
            </div>
            <Button
              type="primary"
              danger
              loading={isSubmitting}
              onClick={handleRemove}
            >
              {t('instructor.classes.manageMaterialModal.remove')}
            </Button>
          </div>
        </div>
      );
    }

    // No material assigned, show assignment UI
    return (
      <div>
        <Title level={5}>{t('instructor.classes.manageMaterialModal.assignMaterial')}</Title>
        <Text type="secondary" className="block mb-2">
          {t('instructor.classes.manageMaterialModal.assignMaterialDesc')}
        </Text>
        <div className="flex space-x-2">
          <Select
            showSearch
            placeholder={t('instructor.classes.manageMaterialModal.searchPlaceholder')}
            style={{ width: '100%' }}
            onChange={(value) => setSelectedMaterialId(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {materialLibrary.map((mat) => (
              <Option key={mat.id} value={mat.id}>
                {mat.name} ({mat.type})
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={handleAssign}
            disabled={!selectedMaterialId}
          >
            {t('instructor.classes.manageMaterialModal.assign')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={t('instructor.classes.manageMaterialModal.title', { title: activity?.title || '' })}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('instructor.classes.manageMaterialModal.close')}
        </Button>,
      ]}
    >
      {error && <Alert message={t('common.error')} description={error} type="error" showIcon closable className="mb-4" />}
      {renderContent()}
    </Modal>
  );
};

export default ManageMaterialModal;