import React, { useState, useEffect, useCallback } from 'react';
import { Button, Skeleton, Empty, App, Form, Space, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { getAllTasks, createTask, updateTask, deleteTask, getTaskById } from '../../../apis/SimulationManager/SimulationManagerTaskApi';
import { getAuthToken } from '../../../libs/cookies';
import ViewModeToggle from '../../../components/ViewModeToggle/ViewModeToggle';
import TaskTable from './partials/TaskTable';
import TaskList from './partials/TaskList';
import DrawerForm from './partials/DrawerForm';

export default function TaskPractice() {
    const { message } = App.useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('page')) || 1);
    const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
    const [total, setTotal] = useState(0);
    const [viewMode, setViewMode] = useState(searchParams.get('view') || 'table');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerMode, setDrawerMode] = useState('create'); // 'create', 'edit', 'view'
    const [currentTask, setCurrentTask] = useState(null);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [form] = Form.useForm();
    const token = getAuthToken();

    const loadTasks = useCallback(async (page = pageNumber, size = pageSize) => {
        setLoading(true);
        try {
            const data = await getAllTasks(page, size, token);
            setTasks(data.items || []);
            setTotal(data.totalCount || 0);
        } catch (e) {
            console.error('Failed to load tasks', e);
            message.error('Failed to load tasks');
            setTasks([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, pageSize, token, message]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // Drawer handlers
    const handleCreate = () => {
        setDrawerMode('create');
        setCurrentTask(null);
        form.resetFields();
        setDrawerVisible(true);
    };

    const handleView = async (record) => {
        setDrawerMode('view');
        setDrawerLoading(true);
        setDrawerVisible(true);
        try {
            const data = await getTaskById(record.id, token);
            setCurrentTask(data);
            form.setFieldsValue(data);
        } catch (e) {
            console.error('Failed to load task details', e);
            message.error('Failed to load task details');
        } finally {
            setDrawerLoading(false);
        }
    };

    const handleEdit = async (record) => {
        setDrawerMode('edit');
        setDrawerLoading(true);
        setDrawerVisible(true);
        try {
            const data = await getTaskById(record.id, token);
            setCurrentTask(data);
            form.setFieldsValue(data);
        } catch (e) {
            console.error('Failed to load task details', e);
            message.error('Failed to load task details');
        } finally {
            setDrawerLoading(false);
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Confirm Delete',
            content: `Are you sure you want to delete task "${record.taskName}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteTask(record.id, token);
                    message.success('Task deleted successfully');
                    await loadTasks(pageNumber, pageSize);
                } catch (e) {
                    console.error('Failed to delete task', e);
                    let errorMsg = 'Failed to delete task';
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

    const handleDrawerClose = () => {
        setDrawerVisible(false);
        setCurrentTask(null);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setDrawerLoading(true);

            if (drawerMode === 'create') {
                // For create, we need practiceCode - you may need to add this field or handle differently
                const practiceCode = values.practiceCode || 'DEFAULT';
                await createTask(practiceCode, values, token);
                message.success('Task created successfully');
            } else if (drawerMode === 'edit') {
                await updateTask(currentTask.id, values, token);
                message.success('Task updated successfully');
            }

            await loadTasks(pageNumber, pageSize);
            handleDrawerClose();
        } catch (e) {
            if (e.errorFields) {
                // Form validation error
                return;
            }
            console.error('Failed to save task', e);
            let errorMsg = 'Failed to save task';
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
            setDrawerLoading(false);
        }
    };

    const handleSwitchToEdit = () => {
        setDrawerMode('edit');
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        const newSize = mode === 'card' ? 9 : 10;
        setPageNumber(1);
        setPageSize(newSize);
        setSearchParams({ page: '1', pageSize: newSize.toString(), view: mode });
        loadTasks(1, newSize);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                </div>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                    >
                        Create Task
                    </Button>
                    <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
                </Space>
            </div>

            {/* Content */}
            {tasks.length === 0 ? (
                <Empty description="No tasks found" />
            ) : viewMode === 'table' ? (
                <TaskTable
                    data={tasks}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pagination={{
                        current: pageNumber,
                        pageSize: pageSize,
                        total: total,
                        onChange: (page, size) => {
                            setPageNumber(page);
                            setPageSize(size);
                            setSearchParams({ page: page.toString(), pageSize: size.toString(), view: viewMode });
                            loadTasks(page, size);
                        },
                    }}
                />
            ) : (
                <TaskList
                    data={tasks}
                    loading={loading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pagination={{
                        current: pageNumber,
                        pageSize: pageSize,
                        total: total,
                        onChange: (page, size) => {
                            setPageNumber(page);
                            setPageSize(size);
                            setSearchParams({ page: page.toString(), pageSize: size.toString(), view: viewMode });
                            loadTasks(page, size);
                        },
                    }}
                />
            )}

            {/* Drawer for Create/Edit/View */}
            <DrawerForm
                visible={drawerVisible}
                mode={drawerMode}
                loading={drawerLoading}
                form={form}
                onClose={handleDrawerClose}
                onSubmit={handleSubmit}
                onSwitchToEdit={handleSwitchToEdit}
            />
        </div>
    );
}
