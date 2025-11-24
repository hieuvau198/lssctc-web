import React, { useEffect, useState, useCallback } from 'react';
import { Card, Typography, Spin, Alert, Button, Divider, Modal, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getPractices, getTasksByPracticeId, 
  updatePractice, updateTask, 
  removeTaskFromPractice 
} from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';

// Import refactored components
import UpdatePracticeForm from '../components/UpdatePracticeForm';
import UpdateTaskForm from '../components/UpdateTaskForm';
import ManageTasksModal from '../components/ManageTasksModal';
import PracticeInfoCard from '../components/PracticeInfoCard';
import PracticeTasksList from '../components/PracticeTasksList';

const { Title } = Typography;

export default function PracticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isTaskUpdateModalVisible, setIsTaskUpdateModalVisible] = useState(false);
  const [isManageTasksModalVisible, setIsManageTasksModalVisible] = useState(false);
  const [currentTaskToUpdate, setCurrentTaskToUpdate] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const token = getAuthToken();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all practices and find the current one (keeping existing pattern from original fetch)
      const res = await getPractices({ page: 1, pageSize: 100 });
      const found = res.items.find(p => String(p.id) === String(id));
      setPractice(found || null);
      
      // Fetch tasks for the practice
      if (found && token) {
        const data = await getTasksByPracticeId(id, token);
        setTasks(data);
      }
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers for Practice ---
  const handleEditPractice = () => {
    setIsUpdateModalVisible(true);
  };

  const handleUpdatePractice = async (values) => {
    if (!practice) return;

    setUpdateLoading(true);
    try {
      // The backend DTO already handles the nullability for optional fields
      const updated = await updatePractice(practice.id, values, token);
      
      message.success('Practice updated successfully.');
      setIsUpdateModalVisible(false);
      // Update state immediately
      setPractice({ ...practice, ...updated }); 
    } catch (e) {
      console.error('Error updating practice:', e);
      message.error(e.response?.data?.Message || 'Failed to update practice.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // --- Handlers for Task CRUD (Update/Remove) ---
  const handleEditTask = (task) => {
    setCurrentTaskToUpdate(task);
    setIsTaskUpdateModalVisible(true);
  };
  
  const handleUpdateTask = async (values) => {
    if (!currentTaskToUpdate) return;
    
    setUpdateLoading(true);
    try {
      const updatedTaskResult = await updateTask(currentTaskToUpdate.id, values, token);
      
      message.success('Task updated successfully.');
      setIsTaskUpdateModalVisible(false);
      // Update the local tasks state for instant feedback
      setTasks(tasks.map(t => 
        t.id === currentTaskToUpdate.id ? { ...t, ...updatedTaskResult } : t
      ));
      setCurrentTaskToUpdate(null); // Clear the selected task
    } catch (e) {
      console.error('Error updating task:', e);
      message.error(e.response?.data?.Message || 'Failed to update task.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRemoveTask = async (taskId) => {
    Modal.confirm({
      title: 'Confirm Removal',
      content: 'Are you sure you want to remove this task from the practice? This action only unlinks it from this practice, it does not delete the task permanently.',
      okText: 'Yes, Remove',
      okType: 'danger',
      onOk: async () => {
        try {
          await removeTaskFromPractice(practice.id, taskId, token);
          message.success('Task removed from practice successfully.');
          await fetchData();
        } catch (e) {
          console.error('Error removing task:', e);
          message.error(e.response?.data?.Message || 'Failed to remove task from practice.');
        }
      },
    });
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card>
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={() => navigate(-1)}>← Back</Button>
        <Title level={3} className="!mb-0">Practice Details</Title>
      </div>

      {/* Practice Information */}
      {practice ? (
        <PracticeInfoCard practice={practice} onEdit={handleEditPractice} />
      ) : (
        <Alert type="warning" message="Practice not found" />
      )}
      
      <Divider />

      {/* Tasks List */}
      {practice && (
        <PracticeTasksList
          tasks={tasks}
          onAssign={() => setIsManageTasksModalVisible(true)}
          onEditTask={handleEditTask}
          onRemoveTask={handleRemoveTask}
        />
      )}

      {/* Modals */}
      {/* Update Practice Modal */}
      {practice && (
        <UpdatePracticeForm
          visible={isUpdateModalVisible}
          onCancel={() => setIsUpdateModalVisible(false)}
          onUpdate={handleUpdatePractice}
          loading={updateLoading}
          initialValues={{
            practiceName: practice.practiceName,
            practiceCode: practice.practiceCode,
            practiceDescription: practice.practiceDescription,
            estimatedDurationMinutes: practice.estimatedDurationMinutes,
            difficultyLevel: practice.difficultyLevel,
            maxAttempts: practice.maxAttempts,
            isActive: practice.isActive,
          }}
        />
      )}

      {/* Update Task Modal */}
      {currentTaskToUpdate && (
        <UpdateTaskForm
          visible={isTaskUpdateModalVisible}
          onCancel={() => { setIsTaskUpdateModalVisible(false); setCurrentTaskToUpdate(null); }}
          onUpdate={handleUpdateTask}
          loading={updateLoading}
          initialValues={{
            taskName: currentTaskToUpdate.taskName,
            taskCode: currentTaskToUpdate.taskCode,
            taskDescription: currentTaskToUpdate.taskDescription,
            expectedResult: currentTaskToUpdate.expectedResult,
          }}
        />
      )}

      {/* Manage Tasks Modal */}
      {practice && (
        <ManageTasksModal
          visible={isManageTasksModalVisible}
          onCancel={() => setIsManageTasksModalVisible(false)}
          practiceId={practice.id}
          currentTasks={tasks}
          reloadTasks={fetchData} // Re-fetch all data after assignment/unassignment
          token={token}
        />
      )}
    </div>
  );
}