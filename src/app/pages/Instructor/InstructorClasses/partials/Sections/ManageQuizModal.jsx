import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Select, Spin, Empty, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { getQuizzes } from '../../../../../apis/Instructor/InstructorQuiz';
import { 
  getQuizzesByActivityId, 
  assignQuizToActivity,
  removeQuizFromActivity 
} from '../../../../../apis/Instructor/InstructorSectionApi';

const { Title, Text } = Typography;
const { Option } = Select;

const ManageQuizModal = ({ activity, isVisible, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedQuiz, setAssignedQuiz] = useState(null);
  const [quizLibrary, setQuizLibrary] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false); 

  const fetchData = async () => {
    if (!activity) return;
    setLoading(true);
    setError(null);
    try {
      const assigned = await getQuizzesByActivityId(activity.id);
      setAssignedQuiz(assigned[0] || null); 

      const library = await getQuizzes({ pageIndex: 1, pageSize: 1000 });
      setQuizLibrary(library.items || []);
    } catch (err) {
      setError(err.message || t('instructor.classes.manageQuizModal.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
    } else {
      // Reset state on close
      setAssignedQuiz(null);
      setQuizLibrary([]);
      setSelectedQuizId(null);
      setError(null);
      setIsSubmitting(false);
      setIsRemoving(false);
    }
  }, [isVisible, activity]);

  const handleAssign = async () => {
    if (!selectedQuizId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await assignQuizToActivity(activity.id, selectedQuizId);
      onUpdate(); 
    } catch (err) {
      setError(err.message || t('instructor.classes.manageQuizModal.assignFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!assignedQuiz) return;
    setIsRemoving(true);
    setError(null);
    try {
      await removeQuizFromActivity(activity.id, assignedQuiz.id);
      onUpdate();
    } catch (err) {
      setError(err.message || t('instructor.classes.manageQuizModal.removeFailed'));
    } finally {
      setIsRemoving(false);
    }
  };
  // --- END OF NEW FUNCTION ---

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-8"><Spin size="large" /></div>;
    }

    if (assignedQuiz) {
      return (
        <div>
          <Title level={5}>{t('instructor.classes.manageQuizModal.assignedQuiz')}</Title>
          <div className="p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <Text strong>{assignedQuiz.name}</Text>
                <br />
                <Text type="secondary">{assignedQuiz.description}</Text>
                <br />
                <Tag color="green" className="mt-2">
                  {assignedQuiz.timelimitMinute} {t('instructor.classes.manageQuizModal.minPoints')} • {assignedQuiz.totalScore} {t('instructor.classes.manageQuizModal.points')}
                </Tag>
              </div>
              <Button
                type="primary"
                danger
                loading={isRemoving}
                onClick={handleRemove}
              >
                {t('instructor.classes.manageQuizModal.remove')}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // No quiz assigned, show assignment UI
    return (
      <div>
        <Title level={5}>{t('instructor.classes.manageQuizModal.assignQuiz')}</Title>
        <Text type="secondary" className="block mb-2">
          {t('instructor.classes.manageQuizModal.assignQuizDesc')}
        </Text>
        <div className="flex space-x-2">
          <Select
            showSearch
            placeholder={t('instructor.classes.manageQuizModal.searchPlaceholder')}
            style={{ width: '100%' }}
            onChange={(value) => setSelectedQuizId(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {quizLibrary.map((quiz) => (
              <Option key={quiz.id} value={quiz.id}>
                {quiz.name}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={handleAssign}
            disabled={!selectedQuizId}
          >
            {t('instructor.classes.manageQuizModal.assign')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={t('instructor.classes.manageQuizModal.title', { title: activity?.title || '' })}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('instructor.classes.manageQuizModal.close')}
        </Button>,
      ]}
    >
      {error && <Alert message={t('common.error')} description={error} type="error" showIcon closable className="mb-4" />}
      {renderContent()}
    </Modal>
  );
};

export default ManageQuizModal;