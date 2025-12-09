import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Modal, Form, Input, App, Empty, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  getTasksByPracticeId
} from '../../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { 
  updateTask, 
  deleteTaskFromPractice
} from '../../../../apis/SimulationManager/SimulationManagerTaskApi';
import TaskCard from '../../../../components/TaskCard/TaskCard';
import { getAuthToken } from '../../../../libs/cookies';
import AssignTaskModal from './AssignTaskModal';

// --- Update Task Form Component ---
const UpdateTaskForm = ({ initialValues, onUpdate, onCancel, visible, loading, t }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    onUpdate(values, form);
  };

  return (
    <Modal
      title={t('simManager.practiceTaskList.updateTaskTitle', { name: initialValues?.taskName || '' })}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {t('common.cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {t('simManager.practiceTaskList.updateTask')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="taskName"
          label={t('simManager.practiceTaskList.taskName')}
          rules={[{ required: true, message: t('simManager.practiceTaskList.taskNameRequired') }]}
        >
          <Input placeholder={t('simManager.practiceTaskList.taskNamePlaceholder')} maxLength={200} />
        </Form.Item>
        <Form.Item
          name="taskCode"
          label={t('simManager.practiceTaskList.taskCode')}
        >
          <Input placeholder={t('simManager.practiceTaskList.taskCodePlaceholder')} maxLength={50} />
        </Form.Item>
        <Form.Item
          name="taskDescription"
          label={t('simManager.practiceTaskList.taskDescription')}
          rules={[{ required: true, message: t('simManager.practiceTaskList.taskDescriptionRequired') }]}
        >
          <Input.TextArea rows={3} placeholder={t('simManager.practiceTaskList.taskDescriptionPlaceholder')} maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="expectedResult"
          label={t('simManager.practiceTaskList.expectedResult')}
          rules={[{ required: true, message: t('simManager.practiceTaskList.expectedResultRequired') }]}
        >
          <Input.TextArea rows={3} placeholder={t('simManager.practiceTaskList.expectedResultPlaceholder')} maxLength={1000} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// --- Main Component ---
export default function PracticeTaskList({ practiceId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTaskToUpdate, setCurrentTaskToUpdate] = useState(null);
  const [isTaskUpdateModalVisible, setIsTaskUpdateModalVisible] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const token = getAuthToken();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasksByPracticeId(practiceId, token);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      message.error(t('simManager.practiceTaskList.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [practiceId, token, message, t]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- Task Handlers ---
  const handleEditTask = (task) => {
    setCurrentTaskToUpdate(task);
    setIsTaskUpdateModalVisible(true);
  };
  
  const handleUpdateTask = async (values) => {
    if (!currentTaskToUpdate) return;
    
    setUpdateLoading(true);
    try {
      const updatedTaskResult = await updateTask(currentTaskToUpdate.id, values, token);
      
      message.success(t('simManager.practiceTaskList.updateSuccess'));
      setIsTaskUpdateModalVisible(false);
      setTasks(tasks.map(task => 
        task.id === currentTaskToUpdate.id ? { ...task, ...updatedTaskResult } : task
      ));
      setCurrentTaskToUpdate(null);
    } catch (e) {
      console.error('Error updating task:', e);
      let errorMsg = t('simManager.practiceTaskList.updateFailed');
      if (e.response?.data?.error?.details?.exceptionMessage) {
        errorMsg = e.response.data.error.details.exceptionMessage;
      } else if (e.response?.data?.error?.message) {
        errorMsg = e.response.data.error.message;
      } else if (e.response?.data?.message) {
        errorMsg = e.response.data.message;
      } else if (e.message) {
        errorMsg = e.message;
      }
      message.error(errorMsg);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRemoveTask = async (taskId) => {
    Modal.confirm({
      title: t('simManager.practiceTaskList.confirmRemoval'),
      content: t('simManager.practiceTaskList.removeConfirmContent'),
      okText: t('simManager.practiceTaskList.yesRemove'),
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteTaskFromPractice(practiceId, taskId, token);
          message.success(t('simManager.practiceTaskList.removeSuccess'));
          await fetchTasks();
        } catch (e) {
          console.error('Error removing task:', e);
          let errorMsg = t('simManager.practiceTaskList.removeFailed');
          if (e.response?.data?.error?.details?.exceptionMessage) {
            errorMsg = e.response.data.error.details.exceptionMessage;
          } else if (e.response?.data?.error?.message) {
            errorMsg = e.response.data.error.message;
          } else if (e.response?.data?.message) {
            errorMsg = e.response.data.message;
          } else if (e.message) {
            errorMsg = e.message;
          }
          message.error(errorMsg);
        }
      },
    });
  };

  // --- Render ---
  if (loading) {
    return (
      <Card title={t('simManager.practiceTaskList.title')} className="shadow">
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Modals */}
      {currentTaskToUpdate && (
        <UpdateTaskForm
          visible={isTaskUpdateModalVisible}
          onCancel={() => { 
            setIsTaskUpdateModalVisible(false); 
            setCurrentTaskToUpdate(null); 
          }}
          onUpdate={handleUpdateTask}
          loading={updateLoading}
          t={t}
          initialValues={{
            taskName: currentTaskToUpdate.taskName,
            taskCode: currentTaskToUpdate.taskCode,
            taskDescription: currentTaskToUpdate.taskDescription,
            expectedResult: currentTaskToUpdate.expectedResult,
          }}
        />
      )}

      {/* Tasks Card */}
      <Card 
        title={t('simManager.practiceTaskList.titleWithCount', { count: tasks.length })}
        className="shadow"
        extra={
          <AssignTaskModal 
            practiceId={practiceId} 
            assignedTaskIds={tasks.map(task => task.id)} 
            onAssigned={fetchTasks} 
          />
        }
      >
        {tasks.length === 0 ? (
          <Empty description={t('simManager.practiceTaskList.noTasksAssigned')} />
        ) : (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
              {tasks.map((task, idx) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={idx}
                  onEdit={handleEditTask}
                  onRemove={handleRemoveTask}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
