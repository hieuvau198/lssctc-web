// src\app\pages\Instructor\InstructorClasses\partials\Sections\ManagePracticeModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Select, Spin, Empty, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { getPractices } from '../../../../../apis/Instructor/InstructorPractice';
import { 
  getPracticesByActivityId, 
  assignPracticeToActivity,
  removePracticeFromActivity // <-- IMPORT NEW FUNCTION
} from '../../../../../apis/Instructor/InstructorSectionApi';

const { Title, Text } = Typography;
const { Option } = Select;

const ManagePracticeModal = ({ activity, isVisible, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedPractice, setAssignedPractice] = useState(null);
  const [practiceLibrary, setPracticeLibrary] = useState([]);
  const [selectedPracticeId, setSelectedPracticeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false); // <-- STATE FOR REMOVE BUTTON

  const fetchData = async () => {
    // ... (no changes)
    if (!activity) return;
    setLoading(true);
    setError(null);
    try {
      const assigned = await getPracticesByActivityId(activity.id);
      setAssignedPractice(assigned[0] || null); 

      const library = await getPractices({ page: 1, pageSize: 10 });
      setPracticeLibrary(library.items || []);
    } catch (err) {
      setError(err.message || t('instructor.classes.managePracticeModal.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
    } else {
      // Reset state on close
      setAssignedPractice(null);
      setPracticeLibrary([]);
      setSelectedPracticeId(null);
      setError(null);
      setIsSubmitting(false);
      setIsRemoving(false); // <-- RESET STATE
    }
  }, [isVisible, activity]);

  const handleAssign = async () => {
    // ... (no changes)
    if (!selectedPracticeId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await assignPracticeToActivity(activity.id, selectedPracticeId);
      onUpdate(); 
    } catch (err) {
      setError(err.message || t('instructor.classes.managePracticeModal.assignFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- NEWLY ADDED FUNCTION ---
  const handleRemove = async () => {
    if (!assignedPractice) return;
    setIsRemoving(true);
    setError(null);
    try {
      await removePracticeFromActivity(activity.id, assignedPractice.id);
      onUpdate(); // Trigger refresh
    } catch (err) {
      setError(err.message || t('instructor.classes.managePracticeModal.removeFailed'));
    } finally {
      setIsRemoving(false);
    }
  };
  // --- END OF NEW FUNCTION ---

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-8"><Spin size="large" /></div>;
    }

    if (assignedPractice) {
      return (
        <div>
          <Title level={5}>{t('instructor.classes.managePracticeModal.assignedPractice')}</Title>
          <div className="p-4 border rounded-md bg-gray-50">
            {/* --- MODIFIED FOR LAYOUT --- */}
            <div className="flex justify-between items-start">
              <div>
                <Text strong>{assignedPractice.practiceName}</Text>
                <br />
                <Text type="secondary">{assignedPractice.practiceDescription}</Text>
                <br />
                <Tag color="purple" className="mt-2">
                  {assignedPractice.estimatedDurationMinutes} {t('instructor.classes.managePracticeModal.min')} • {assignedPractice.difficultyLevel}
                </Tag>
              </div>
              <Button
                type="primary"
                danger
                loading={isRemoving}
                onClick={handleRemove}
              >
                {t('instructor.classes.managePracticeModal.remove')}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // No practice assigned, show assignment UI
    return (
      <div>
        <Title level={5}>{t('instructor.classes.managePracticeModal.assignPractice')}</Title>
        <Text type="secondary" className="block mb-2">
          {t('instructor.classes.managePracticeModal.assignPracticeDesc')}
        </Text>
        <div className="flex space-x-2">
          <Select
            showSearch
            placeholder={t('instructor.classes.managePracticeModal.searchPlaceholder')}
            style={{ width: '100%' }}
            onChange={(value) => setSelectedPracticeId(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {practiceLibrary.map((practice) => (
              <Option key={practice.id} value={practice.id}>
                {practice.practiceName}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={handleAssign}
            disabled={!selectedPracticeId}
          >
            {t('instructor.classes.managePracticeModal.assign')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={t('instructor.classes.managePracticeModal.title', { title: activity?.title || '' })}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('instructor.classes.managePracticeModal.close')}
        </Button>,
      ]}
    >
      {error && <Alert message={t('common.error')} description={error} type="error" showIcon closable className="mb-4" />}
      {renderContent()}
    </Modal>
  );
};

export default ManagePracticeModal;