import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, Spin, Alert, Button, Modal, Form, Input, InputNumber, Select, message, Tooltip 
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, X, ArrowLeft, Clock, Zap, AlertCircle, CheckCircle, BookOpen, ListTodo } from 'lucide-react';
import { 
  getPractices, getTasksByPracticeId, 
  updatePractice, updateTask, 
  removeTaskFromPractice 
} from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';

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
            <Alert message="No unassigned tasks available" type="info" showIcon />
          )}
        </div>
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
      const res = await getPractices({ page: 1, pageSize: 100 });
      const found = res.items.find(p => String(p.id) === String(id));
      setPractice(found || null);
      
      if (found && token) {
        const data = await getTasksByPracticeId(id, token);
        setTasks(Array.isArray(data) ? data : []);
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!practice) return null;

  const getDifficultyColor = (level) => {
    const colors = { 'Entry': '#22c55e', 'Intermediate': '#f59e0b', 'Advanced': '#ef4444' };
    return colors[level] || '#6b7280';
  };

  const getDifficultyIcon = (level) => {
    if (level === 'Entry') return '⭐';
    if (level === 'Intermediate') return '⭐⭐';
    if (level === 'Advanced') return '⭐⭐⭐';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
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

      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{practice.practiceName}</h1>
          <p className="text-gray-600 mt-1">{practice.practiceCode}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Practice Information</h2>
            </div>

            <div className="space-y-4">
              {/* Practice Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice Name
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  value={practice.practiceName}
                  disabled
                />
              </div>

              {/* Practice Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practice Code
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  value={practice.practiceCode}
                  disabled
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed resize-none"
                  rows="4"
                  value={practice.practiceDescription || ""}
                  disabled
                />
              </div>

              {/* Duration & Difficulty Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      type="number"
                      value={practice.estimatedDurationMinutes || ""}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-3 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: getDifficultyColor(practice.difficultyLevel) }}
                    >
                      {practice.difficultyLevel}
                    </span>
                    <span className="text-lg">{getDifficultyIcon(practice.difficultyLevel)}</span>
                  </div>
                </div>
              </div>

              {/* Max Attempts & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attempts
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      type="number"
                      value={practice.maxAttempts || ""}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div>
                    <span className={`px-3 py-2 rounded-lg text-sm font-medium inline-block ${
                      practice.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {practice.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setIsUpdateModalVisible(true)}
              >
                <Edit className="h-4 w-4" />
                Edit Practice
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Info Card */}
        <div className="col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Summary</h3>
            
            <div className="space-y-4">
              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Duration</p>
                  <p className="text-lg font-bold text-blue-900">{practice.estimatedDurationMinutes} min</p>
                </div>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  practice.difficultyLevel === 'Entry' ? 'bg-green-200' :
                  practice.difficultyLevel === 'Intermediate' ? 'bg-yellow-200' :
                  'bg-red-200'
                }`}>
                  <Zap className={`h-5 w-5 ${
                    practice.difficultyLevel === 'Entry' ? 'text-green-700' :
                    practice.difficultyLevel === 'Intermediate' ? 'text-yellow-700' :
                    'text-red-700'
                  }`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Difficulty</p>
                  <p className="text-lg font-bold text-gray-900">{practice.difficultyLevel || 'N/A'}</p>
                </div>
              </div>

              {/* Max Attempts */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Max Attempts</p>
                  <p className="text-lg font-bold text-gray-900">{practice.maxAttempts}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${practice.isActive ? 'bg-green-200' : 'bg-gray-200'}`}>
                  <CheckCircle className={`h-5 w-5 ${practice.isActive ? 'text-green-700' : 'text-gray-700'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Status</p>
                  <p className="text-lg font-bold text-gray-900">{practice.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              {/* Created Date */}
              <div className="pt-4 border-t border-blue-300">
                <p className="text-xs text-blue-600 font-medium mb-1">Created</p>
                <p className="text-sm text-blue-900 font-medium">
                  {practice.createdDate ? new Date(practice.createdDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ListTodo className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Practice Tasks</h2>
          <span className="ml-auto text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {tasks.length} tasks
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-lg">
            <ListTodo className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-4">No tasks assigned to this practice</p>
            <Button 
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsManageTasksModalVisible(true)}
            >
              Assign First Task
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-150"
                >
                  <div className="flex items-start gap-4">
                    {/* Task Number */}
                    <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600">{idx + 1}</span>
                    </div>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{task.taskName}</h3>
                        <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          {task.taskCode}
                        </span>
                      </div>
                      
                      {task.taskDescription && (
                        <p className="text-sm text-gray-600 mb-2">{task.taskDescription}</p>
                      )}

                      {task.expectedResult && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                          <p className="font-medium">Expected Result:</p>
                          <p>{task.expectedResult}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Tooltip title="Edit Task">
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<Edit className="w-4 h-4" />} 
                          onClick={() => handleEditTask(task)}
                        />
                      </Tooltip>
                      <Tooltip title="Remove Task">
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<X className="w-4 h-4 text-red-500" />} 
                          onClick={() => handleRemoveTask(task.id)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task Button */}
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <Button 
                type="dashed"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsManageTasksModalVisible(true)}
              >
                Assign Additional Task
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}