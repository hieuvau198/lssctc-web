import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Select, Alert, message, Spin, Typography } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  getAllTasks, 
  addTaskToPractice 
} from '../../../../apis/Instructor/InstructorPractice';

const { Option } = Select;
const { Title } = Typography;

export default function ManageTasksModal({ practiceId, currentTasks, reloadTasks, onCancel, visible, token }) {
  const { t } = useTranslation();
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
      message.error(t('instructor.practices.manageTasks.loadFailed'));
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
      message.warning(t('instructor.practices.manageTasks.selectTaskWarning'));
      return;
    }
    setLoading(true);
    try {
      await addTaskToPractice(practiceId, selectedTaskId, token);
      message.success(t('instructor.practices.manageTasks.assignSuccess'));
      await reloadTasks();
      loadAllTasks(); // Reload all tasks to update the list of available tasks
    } catch (e) {
      console.error('Error assigning task:', e);
      message.error(e.response?.data?.Message || t('instructor.practices.manageTasks.assignFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t('instructor.practices.manageTasks.title')}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Spin spinning={loading}>
        <Title level={5}>{t('instructor.practices.manageTasks.assignNewTask')}</Title>
        <div className="flex space-x-2">
          <Select 
            placeholder={t('instructor.practices.manageTasks.selectTask')}
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
            {t('instructor.practices.manageTasks.assign')}
          </Button>
        </div>
        {availableTasks.length === 0 && <Alert message={t('instructor.practices.manageTasks.noUnassignedTasks')} type="info" className="mt-2" />}
      </Spin>
    </Modal>
  );
};