import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Select, Alert, message, Spin, Typography } from 'antd';
import { Plus } from 'lucide-react';
import { 
  getAllTasks, 
  addTaskToPractice 
} from '../../../../apis/Instructor/InstructorPractice';

const { Option } = Select;
const { Title } = Typography;

export default function ManageTasksModal({ practiceId, currentTasks, reloadTasks, onCancel, visible, token }) {
  const [loading, setLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const loadAllTasks = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllTasks(token);
      setAllTasks(all);
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
    if (allTasks.length > 0 && currentTasks) {
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
      await addTaskToPractice(practiceId, selectedTaskId, token);
      message.success('Task assigned successfully.');
      await reloadTasks();
      loadAllTasks(); // Reload all tasks to update the list of available tasks
    } catch (e) {
      console.error('Error assigning task:', e);
      message.error(e.response?.data?.Message || 'Failed to assign task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Manage Tasks for Practice"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Spin spinning={loading}>
        <Title level={5}>Assign New Task</Title>
        <div className="flex space-x-2">
          <Select 
            placeholder="Select a Task to Assign"
            style={{ flexGrow: 1 }}
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
                {task.taskCode ? `[${task.taskCode}] ` : ''} {task.taskName} (ID: {task.id})
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            onClick={handleAssignTask} 
            icon={<Plus className="w-4 h-4" />}
            disabled={!selectedTaskId}
          >
            Assign
          </Button>
        </div>
        {availableTasks.length === 0 && <Alert message="No unassigned tasks found in the system." type="info" className="mt-2" />}
      </Spin>
    </Modal>
  );
};