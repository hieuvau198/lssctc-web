import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, List, Typography, Spin, Alert, Button, Tag, Divider, Descriptions, 
  Modal, Form, Input, InputNumber, Select, message, Tooltip 
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { 
  getPractices, getTasksByPracticeId, 
  updatePractice, updateTask, 
  addTaskToPractice, removeTaskFromPractice, 
  getAllTasks 
} from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';

const { Title, Text } = Typography;
const { Option } = Select;

// --- Helper Components for Forms ---

const UpdatePracticeForm = ({ initialValues, onUpdate, onCancel, visible, loading }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    onUpdate(values, form);
  };

  return (
    <Modal
      title="Update Practice"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Update
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
          name="practiceName"
          label="Practice Name"
          rules={[{ required: true, message: 'Practice name is required.' }]}
        >
          <Input placeholder="Practice Name" maxLength={200} />
        </Form.Item>
        <Form.Item
          name="practiceCode"
          label="Practice Code"
        >
          <Input placeholder="Practice Code" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="practiceDescription"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Practice Description" maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="estimatedDurationMinutes"
          label="Estimated Duration (Minutes)"
          rules={[{ type: 'number', min: 1, max: 600 }]}
        >
          <InputNumber min={1} max={600} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="difficultyLevel"
          label="Difficulty Level"
          rules={[{ required: true, message: 'Please select a difficulty level.' }]}
        >
          <Select placeholder="Select level">
            <Option value="Entry">Entry</Option>
            <Option value="Intermediate">Intermediate</Option>
            <Option value="Advanced">Advanced</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="maxAttempts"
          label="Max Attempts"
          rules={[{ type: 'number', min: 1, max: 10 }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Status"
        >
          <Select placeholder="Select status">
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

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

const ManageTasksModal = ({ practiceId, currentTasks, reloadTasks, onCancel, visible, token }) => {
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


// --- Main Component ---

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
      // Fetch all practices and find the current one (keeping existing pattern)
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
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers for Practice Update
  const handleUpdatePractice = async (values) => {
    if (!practice) return;

    setUpdateLoading(true);
    try {
      const apiPayload = {
        practiceName: values.practiceName,
        practiceCode: values.practiceCode,
        practiceDescription: values.practiceDescription,
        estimatedDurationMinutes: values.estimatedDurationMinutes,
        difficultyLevel: values.difficultyLevel,
        maxAttempts: values.maxAttempts,
        isActive: values.isActive,
      };

      const updated = await updatePractice(practice.id, apiPayload, token);
      
      message.success('Practice updated successfully.');
      setIsUpdateModalVisible(false);
      // Manually update state for immediate feedback
      setPractice({ ...practice, ...updated }); 
    } catch (e) {
      console.error('Error updating practice:', e);
      message.error(e.response?.data?.Message || 'Failed to update practice.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handlers for Task Update
  const handleEditTask = (task) => {
    setCurrentTaskToUpdate(task);
    setIsTaskUpdateModalVisible(true);
  };
  
  const handleUpdateTask = async (values) => {
    if (!currentTaskToUpdate) return;
    
    setUpdateLoading(true);
    try {
      const apiPayload = {
        taskName: values.taskName,
        taskCode: values.taskCode,
        taskDescription: values.taskDescription,
        expectedResult: values.expectedResult,
      };

      const updatedTaskResult = await updateTask(currentTaskToUpdate.id, apiPayload, token);
      
      message.success('Task updated successfully.');
      setIsTaskUpdateModalVisible(false);
      // Update the local tasks state
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

  // Handlers for Task Assignment/Removal
  const handleRemoveTask = async (taskId) => {
    Modal.confirm({
      title: 'Confirm Removal',
      content: 'Are you sure you want to remove this task from the practice? This action only unlinks it from this practice.',
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
        <Button className="mt-4" onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  const practiceInfoItems = practice ? [
    { label: "Code", value: practice.practiceCode || 'N/A' }, 
    { label: "Description", value: practice.practiceDescription || 'N/A' },
    { label: "Duration", value: `${practice.estimatedDurationMinutes} min` },
    { label: "Difficulty", value: <Tag color="blue">{practice.difficultyLevel || 'N/A'}</Tag> },
    { label: "Max Attempts", value: practice.maxAttempts },
    { label: "Status", value: <Tag color={practice.isActive ? 'green' : 'red'}>{practice.isActive ? 'Active' : 'Inactive'}</Tag> },
    { label: "Created Date", value: practice.createdDate ? new Date(practice.createdDate).toLocaleDateString() : 'N/A' }
  ] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={() => navigate(-1)}>← Back</Button>
        <Title level={3} className="!mb-0">Practice Details</Title>
      </div>

      {/* Practice Information */}
      {practice ? (
        <Card 
          className="border-slate-200 shadow-sm"
          title={practice.practiceName}
          extra={(
            <Tooltip title="Edit Practice">
              <Button 
                type="primary" 
                icon={<Edit className="w-4 h-4" />} 
                onClick={() => setIsUpdateModalVisible(true)}
              />
            </Tooltip>
          )}
        >
          <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} size="small">
            {practiceInfoItems.map((item, index) => (
              <Descriptions.Item key={index} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      ) : (
        <Alert type="warning" message="Practice not found" />
      )}
      
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
          reloadTasks={fetchData}
          token={token}
        />
      )}
      
      <Divider />

      {/* Tasks List */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <Title level={4} className="!mb-0">Practice Tasks ({tasks.length})</Title>
            <Button 
                type="dashed" 
                onClick={() => setIsManageTasksModalVisible(true)} 
                icon={<Plus className="w-4 h-4" />}
            >
                Assign Task
            </Button>
        </div>
        <Card className="border-slate-200">
          {tasks.length === 0 ? (
            <Text type="secondary">No steps found. Click 'Assign Task' to add a step.</Text>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={tasks}
              renderItem={(task, index) => (
                <List.Item key={task.id} className="mb-4">
                  <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Title level={5} className="!mb-1">
                          Step {index + 1}: {task.taskName}
                        </Title>
                        <Tag color="blue">Code: {task.taskCode || 'N/A'}</Tag> {/* Added Task Code */}
                      </div>
                      <div className="flex space-x-2">
                          <Tooltip title="Edit Task">
                              <Button 
                                  type="text" 
                                  size="small" 
                                  icon={<Edit className="w-4 h-4" />} 
                                  onClick={() => handleEditTask(task)}
                              />
                          </Tooltip>
                          <Tooltip title="Remove Task from Practice">
                              <Button 
                                  type="text" 
                                  size="small" 
                                  icon={<X className="w-4 h-4 text-red-500" />} 
                                  onClick={() => handleRemoveTask(task.id)}
                              />
                          </Tooltip>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Text strong>📝 Description:</Text>
                        <p className="ml-0 text-gray-700 mt-1">{task.taskDescription}</p>
                      </div>
                      
                      <div>
                        <Text strong className="text-green-600">✓ Expected Result:</Text>
                        <p className="ml-0 text-green-700 mt-1">{task.expectedResult}</p>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
}