import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Modal, Form, Input, App, Empty, Spin } from 'antd';
import { Plus } from 'lucide-react';
import { 
  getTasksByPracticeId
} from '../../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { 
  updateTask, 
  deleteTaskFromPractice 
} from '../../../../apis/SimulationManager/SimulationManagerTaskApi';
import TaskCard from '../../../../components/TaskCard/TaskCard';
import { getAuthToken } from '../../../../libs/cookies';

// --- Update Task Form Component ---
const UpdateTaskForm = ({ initialValues, onUpdate, onCancel, visible, loading }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    onUpdate(values, form);
  };

  return (
    <Modal
      title={`Update Task: ${initialValues?.taskName || ''}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Update Task
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
          label="Task Name"
          rules={[{ required: true, message: 'Task name is required.' }]}
        >
          <Input placeholder="Task Name" maxLength={200} />
        </Form.Item>
        <Form.Item
          name="taskCode"
          label="Task Code"
        >
          <Input placeholder="Task Code" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="taskDescription"
          label="Task Description"
          rules={[{ required: true, message: 'Task description is required.' }]}
        >
          <Input.TextArea rows={3} placeholder="Task Description" maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="expectedResult"
          label="Expected Result"
          rules={[{ required: true, message: 'Expected result is required.' }]}
        >
          <Input.TextArea rows={3} placeholder="Expected Result" maxLength={1000} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// --- Main Component ---
export default function PracticeTaskList({ practiceId }) {
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
      message.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [practiceId, token, message]);

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
      
      message.success('Task updated successfully');
      setIsTaskUpdateModalVisible(false);
      setTasks(tasks.map(t => 
        t.id === currentTaskToUpdate.id ? { ...t, ...updatedTaskResult } : t
      ));
      setCurrentTaskToUpdate(null);
    } catch (e) {
      console.error('Error updating task:', e);
      let errorMsg = 'Failed to update task';
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
      title: 'Confirm Removal',
      content: 'Are you sure you want to remove this task from the practice? This action only unlinks it from this practice.',
      okText: 'Yes, Remove',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteTaskFromPractice(practiceId, taskId, token);
          message.success('Task removed from practice successfully');
          await fetchTasks();
        } catch (e) {
          console.error('Error removing task:', e);
          let errorMsg = 'Failed to remove task from practice';
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
      <Card title="Practice Tasks" className="shadow">
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
        title={`Practice Tasks (${tasks.length})`}
        className="shadow"
      >
        {tasks.length === 0 ? (
          <Empty description="No tasks assigned" />
        ) : (
          <div className="max-h-[720px] overflow-y-auto pr-2">
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
