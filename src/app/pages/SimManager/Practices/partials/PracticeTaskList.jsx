import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Form, Input, App } from 'antd';
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
      title={null}
      open={visible}
      onCancel={onCancel}
      closeIcon={null}
      width={560}
      centered
      footer={null}
      className="industrial-task-modal"
      styles={{
        content: {
          padding: 0,
          borderRadius: 0,
          border: '2px solid #000',
          overflow: 'hidden'
        }
      }}
    >
      <div className="bg-white">
        {/* Industrial Header */}
        <div className="bg-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-white font-black uppercase text-lg tracking-wider">
              {t('simManager.practiceTaskList.updateTaskTitle', { name: initialValues?.taskName || '' })}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-yellow-400 hover:bg-neutral-800 transition-all"
          >
            <span className="text-2xl font-bold leading-none">&times;</span>
          </button>
        </div>

        {/* Yellow Accent Bar */}
        <div className="h-1 bg-yellow-400 w-full" />

        {/* Form Content */}
        <div className="p-6">
          <style>{`
            .industrial-task-form .ant-form-item-label label {
              font-weight: 700 !important;
              text-transform: uppercase !important;
              font-size: 0.75rem !important;
              letter-spacing: 0.05em !important;
              color: #525252 !important;
            }
            .industrial-task-form .ant-form-item-label label::before {
              color: #ef4444 !important;
            }
            .industrial-task-form .ant-input,
            .industrial-task-form .ant-input-textarea textarea {
              border: 2px solid #e5e5e5 !important;
              border-radius: 0 !important;
              font-weight: 500 !important;
              padding: 10px 14px !important;
              background-color: #fafafa !important;
              transition: all 0.2s ease !important;
            }
            .industrial-task-form .ant-input:focus,
            .industrial-task-form .ant-input-textarea textarea:focus,
            .industrial-task-form .ant-input:hover,
            .industrial-task-form .ant-input-textarea textarea:hover {
              border-color: #000 !important;
              background-color: #fff !important;
              box-shadow: none !important;
            }
            .industrial-task-form .ant-input-textarea-show-count::after {
              font-size: 0.7rem !important;
              color: #a3a3a3 !important;
              font-family: monospace !important;
            }
          `}</style>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
            className="industrial-task-form"
          >
            <Form.Item
              name="taskName"
              label={t('simManager.practiceTaskList.taskName')}
              rules={[{ required: true, message: t('simManager.practiceTaskList.taskNameRequired') }]}
            >
              <Input
                placeholder={t('simManager.practiceTaskList.taskNamePlaceholder')}
                maxLength={200}
                showCount
                className="h-11"
              />
            </Form.Item>
            <Form.Item
              name="taskCode"
              label={t('simManager.practiceTaskList.taskCode')}
            >
              <Input
                placeholder={t('simManager.practiceTaskList.taskCodePlaceholder')}
                maxLength={50}
                showCount
                className="h-11 font-mono"
              />
            </Form.Item>
            <Form.Item
              name="taskDescription"
              label={t('simManager.practiceTaskList.taskDescription')}
              rules={[{ required: true, message: t('simManager.practiceTaskList.taskDescriptionRequired') }]}
            >
              <Input.TextArea
                rows={3}
                placeholder={t('simManager.practiceTaskList.taskDescriptionPlaceholder')}
                maxLength={1000}
                showCount
                className="resize-none"
              />
            </Form.Item>
            <Form.Item
              name="expectedResult"
              label={t('simManager.practiceTaskList.expectedResult')}
              rules={[{ required: true, message: t('simManager.practiceTaskList.expectedResultRequired') }]}
            >
              <Input.TextArea
                rows={3}
                placeholder={t('simManager.practiceTaskList.expectedResultPlaceholder')}
                maxLength={1000}
                showCount
                className="resize-none"
              />
            </Form.Item>
          </Form>
        </div>

        {/* Industrial Footer */}
        <div className="p-4 bg-neutral-50 border-t-2 border-neutral-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-white text-neutral-700 font-bold uppercase tracking-wider text-sm border-2 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={() => form.submit()}
            disabled={loading}
            className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {t('simManager.practiceTaskList.updateTask')}
          </button>
        </div>
      </div>
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
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />
        <div className="px-6 py-4 border-b-2 border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-black text-black uppercase tracking-tight text-lg">
              {t('simManager.practiceTaskList.title')}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
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

      {/* Industrial Tasks Container */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        {/* Yellow Accent Bar */}
        <div className="h-1 bg-yellow-400" />

        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="font-black text-black uppercase tracking-tight text-lg">
                {t('simManager.practiceTaskList.title')}
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} {t('simManager.practiceTaskList.assigned')}
              </p>
            </div>
          </div>
          <AssignTaskModal
            practiceId={practiceId}
            assignedTaskIds={tasks.map(task => task.id)}
            onAssigned={fetchTasks}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {tasks.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-neutral-500 font-bold uppercase tracking-wider text-sm">
                {t('simManager.practiceTaskList.noTasksAssigned')}
              </p>
              <p className="text-neutral-400 text-sm mt-1">
                {t('simManager.practiceTaskList.clickAssignToAdd')}
              </p>
            </div>
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
        </div>
      </div>
    </>
  );
}

