import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Select, Spin, Empty, Typography, Tag } from 'antd';
import { getQuizzes } from '../../../../../apis/Instructor/InstructorQuiz';
import { getQuizzesByActivityId, assignQuizToActivity } from '../../../../../apis/Instructor/InstructorSectionApi';

const { Title, Text } = Typography;
const { Option } = Select;

const ManageQuizModal = ({ activity, isVisible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedQuiz, setAssignedQuiz] = useState(null);
  const [quizLibrary, setQuizLibrary] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    if (!activity) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch currently assigned quizzes
      const assigned = await getQuizzesByActivityId(activity.id);
      setAssignedQuiz(assigned[0] || null); // Assuming one quiz per activity for now

      // 2. Fetch all available quizzes from the library
      const library = await getQuizzes({ pageIndex: 1, pageSize: 1000 });
      setQuizLibrary(library.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
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
    }
  }, [isVisible, activity]);

  const handleAssign = async () => {
    if (!selectedQuizId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await assignQuizToActivity(activity.id, selectedQuizId);
      onUpdate(); // Trigger refresh
    } catch (err) {
      setError(err.message || 'Failed to assign quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-8"><Spin size="large" /></div>;
    }

    if (assignedQuiz) {
      return (
        <div>
          <Title level={5}>Assigned Quiz</Title>
          <div className="p-4 border rounded-md bg-gray-50">
            <Text strong>{assignedQuiz.name}</Text>
            <br />
            <Text type="secondary">{assignedQuiz.description}</Text>
            <br />
            <Tag color="green" className="mt-2">
              {assignedQuiz.timelimitMinute} min • {assignedQuiz.totalScore} pts
            </Tag>
            {/* No "Remove" button as the API endpoint was not provided */}
          </div>
        </div>
      );
    }

    // No quiz assigned, show assignment UI
    return (
      <div>
        <Title level={5}>Assign Quiz</Title>
        <Text type="secondary" className="block mb-2">
          Select a quiz from the library to assign to this activity.
        </Text>
        <div className="flex space-x-2">
          <Select
            showSearch
            placeholder="Search and select a quiz"
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
            Assign
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={`Manage Quiz for: ${activity?.title || ''}`}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {error && <Alert message="Error" description={error} type="error" showIcon closable className="mb-4" />}
      {renderContent()}
    </Modal>
  );
};

export default ManageQuizModal;