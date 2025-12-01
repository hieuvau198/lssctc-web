import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Modal, Form, Input, Select, message, Empty, Spin } from 'antd';
import { 
  getTasksByPracticeId, 
  updateTask, 
  removeTaskFromPractice 
} from '../../../../apis/Instructor/InstructorPractice';
import TaskCard from '../../../../components/TaskCard/TaskCard';
import { Plus } from 'lucide-react';

const { Option } = Select;

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
      visible={visible}
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

// --- Manage Tasks Modal Component ---
const ManageTasksModal = ({ practiceId, currentTasks, reloadTasks, onCancel, visible, token }) => {
  const [loading, setLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const loadAllTasks = useCallback(async () => {
    setLoading(true);
    try {
      // Note: You'll need to import getAllTasks from the appropriate API file
      // const all = await getAllTasks(token);
      // setAllTasks(all);
      message.info('Please implement getAllTasks API call');
    } catch (e) {
      console.error('Failed to load all tasks', e);
      message.error('Failed to load available tasks');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (visible) {
      loadAllTasks();
    }
  }, [visible, loadAllTasks]);

  useEffect(() => {
    if (allTasks.length > 0 && currentTasks.length >= 0) {
      const currentTaskIds = new Set(currentTasks.map(t => t.id));
      const filteredTasks = allTasks.filter(task => !currentTaskIds.has(task.id));
      setAvailableTasks(filteredTasks);
      setSelectedTaskId(filteredTasks.length > 0 ? filteredTasks[0].id : null);
    }
  }, [allTasks, currentTasks]);

  const handleAssignTask = async () => {
    if (!selectedTaskId) {
      message.warning('Please select a task to assign.');
      return;
    }
    setLoading(true);
    try {
      // Note: You'll need to import addTaskToPractice from the appropriate API file
      // await addTaskToPractice(practiceId, selectedTaskId, token);
      message.success('Task assigned successfully.');
      await reloadTasks();
      loadAllTasks();
    } catch (e) {
      console.error('Error assigning task:', e);
      message.error(e.response?.data?.Message || 'Failed to assign task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Assign Task to Practice"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleAssignTask}
          disabled={!selectedTaskId}
        >
          Assign Task
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Task
            </label>
            <Select 
              placeholder="Select a task to assign"
              style={{ width: '100%' }}
              onChange={setSelectedTaskId}
              value={selectedTaskId}
              disabled={availableTasks.length === 0}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {availableTasks.map(task => (
                <Option key={task.id} value={task.id}>
                  {task.taskCode ? `[${task.taskCode}] ` : ''}{task.taskName}
                </Option>
              ))}
            </Select>
          </div>
          {availableTasks.length === 0 && (
            <div className="text-sm text-slate-500">No unassigned tasks available</div>
          )}
        </div>
      </Spin>
    </Modal>
  );
};

// --- Main PracticeTaskList Component ---
export default function PracticeTaskList({ practiceId, token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskUpdateModalVisible, setIsTaskUpdateModalVisible] = useState(false);
  const [isManageTasksModalVisible, setIsManageTasksModalVisible] = useState(false);
  const [currentTaskToUpdate, setCurrentTaskToUpdate] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!practiceId || !token) return;
    
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
  }, [practiceId, token]);

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
      
      message.success('Task updated successfully.');
      setIsTaskUpdateModalVisible(false);
      // Update the local tasks state for instant feedback
      setTasks(tasks.map(t => 
        t.id === currentTaskToUpdate.id ? { ...t, ...updatedTaskResult } : t
      ));
      setCurrentTaskToUpdate(null);
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
          await removeTaskFromPractice(practiceId, taskId, token);
          message.success('Task removed from practice successfully.');
          await fetchTasks();
        } catch (e) {
          console.error('Error removing task:', e);
          message.error(e.response?.data?.Message || 'Failed to remove task from practice.');
        }
      },
    });
  };

  // --- Render ---
  if (loading) {
    return (
      <Card title={`Practice Tasks`} className="shadow">
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

      <ManageTasksModal
        visible={isManageTasksModalVisible}
        onCancel={() => setIsManageTasksModalVisible(false)}
        practiceId={practiceId}
        currentTasks={tasks}
        reloadTasks={fetchTasks}
        token={token}
      />

      {/* Tasks Card */}
      <Card 
        title={`Practice Tasks (${tasks.length})`}
        className="shadow"
        extra={
          <Button type="primary" onClick={() => setIsManageTasksModalVisible(true)}>
            <Plus />Assign Task
          </Button>
        }
      >
        {tasks.length === 0 ? (
          <Empty description="No tasks assigned" />
        ) : (
          <div className="max-h-[600px] overflow-y-auto pr-2">
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
