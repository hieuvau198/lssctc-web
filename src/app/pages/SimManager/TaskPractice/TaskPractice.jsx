import React, { useState, useEffect, useCallback } from 'react';
import { Button, Skeleton, Empty, App, Form, Space, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Sliders } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllTasks, createTask, updateTask, deleteTask, getTaskById } from '../../../apis/SimulationManager/SimulationManagerTaskApi';
import { getAuthToken } from '../../../libs/cookies';
import ViewModeToggle from '../../../components/ViewModeToggle/ViewModeToggle';
import TaskTable from './partials/TaskTable';
import TaskList from './partials/TaskList';
import DrawerForm from './partials/DrawerForm';

export default function TaskPractice() {
    const { t } = useTranslation();
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
            message.error(t('simManager.tasks.failedToLoad'));
            setTasks([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, pageSize, token, message, t]);

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
            message.error(t('simManager.tasks.failedToLoadDetails'));
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
            message.error(t('simManager.tasks.failedToLoadDetails'));
        } finally {
            setDrawerLoading(false);
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: t('simManager.tasks.confirmDelete'),
            content: t('simManager.tasks.deleteContent', { name: record.taskName }),
            okText: t('simManager.tasks.delete'),
            okType: 'danger',
            onOk: async () => {
                await executeDelete(record);
            },
        });
    };

    const handleDeleteDirect = async (record) => {
        await executeDelete(record);
    };

    const executeDelete = async (record) => {
        try {
            await deleteTask(record.id, token);
            message.success(t('simManager.tasks.deleteSuccess'));
            await loadTasks(pageNumber, pageSize);
        } catch (e) {
            console.error('Failed to delete task', e);
            let errorMsg = t('simManager.tasks.failedToDelete');
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
                message.success(t('simManager.tasks.createSuccess'));
            } else if (drawerMode === 'edit') {
                await updateTask(currentTask.id, values, token);
                message.success(t('simManager.tasks.updateSuccess'));
            }

            await loadTasks(pageNumber, pageSize);
            handleDrawerClose();
        } catch (e) {
            if (e.errorFields) {
                // Form validation error
                return;
            }
            console.error('Failed to save task', e);
            let errorMsg = t('simManager.tasks.failedToSave');
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
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Header - Industrial Theme */}
            <div className="flex-none bg-black border-2 border-black p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                            <Sliders className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-white uppercase tracking-tight">
                                {t('simManager.tasks.title')}
                            </span>
                            <p className="text-yellow-400 text-sm mt-1 font-medium">
                                {t('simManager.tasks.pagination', { start: (pageNumber - 1) * pageSize + 1, end: Math.min(pageNumber * pageSize, total), total })}
                            </p>
                        </div>
                    </div>
                    <Space className="flex items-center gap-3">
                        <button
                            onClick={handleCreate}
                            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            <PlusOutlined className="group-hover:scale-110 transition-transform" />
                            {t('simManager.tasks.createTask')}
                        </button>
                        <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} color="yellow" />
                    </Space>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                {tasks.length === 0 ? (
                    <div className="bg-white border-2 border-black p-12 flex-1 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative">
                        <div className="h-1 bg-yellow-400 w-full absolute top-0 left-0" />
                        <Empty description={t('simManager.tasks.noTasksFound')} />
                    </div>
                ) : viewMode === 'table' ? (
                    <TaskTable
                        data={tasks}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDeleteDirect}
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
            </div>

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
