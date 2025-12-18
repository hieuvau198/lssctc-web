import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, App, Empty, Spin, Table, Tag, Pagination } from 'antd';
import { Plus, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllTasks, addTaskToPractice } from '../../../../apis/SimulationManager/SimulationManagerTaskApi';
import { getAuthToken } from '../../../../libs/cookies';

const AssignTaskModal = ({ practiceId, assignedTaskIds = [], onAssigned }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const [assignLoading, setAssignLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const token = getAuthToken();

    // Fetch available tasks when modal opens
    const fetchAvailableTasks = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all tasks (get a large page to get all)
            const data = await getAllTasks(1, 100, token);
            const allTasksList = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);

            // Filter out tasks that are already assigned to this practice
            const assignedSet = new Set(assignedTaskIds);
            const availableTasks = allTasksList.filter(task => !assignedSet.has(task.id));

            setAllTasks(availableTasks);
        } catch (err) {
            console.error('Error fetching all tasks:', err);
            message.error(t('simManager.assignTaskModal.loadFailed'));
            setAllTasks([]);
        } finally {
            setLoading(false);
        }
    }, [token, assignedTaskIds, message, t]);

    // Open modal and fetch tasks
    const handleOpen = () => {
        setIsModalVisible(true);
        setSelectedTaskIds([]);
        fetchAvailableTasks();
    };

    // Close modal
    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedTaskIds([]);
        setCurrentPage(1); // Reset pagination
    };

    // Assign selected tasks
    const handleAssign = async () => {
        if (selectedTaskIds.length === 0) {
            message.warning(t('simManager.assignTaskModal.selectAtLeastOne'));
            return;
        }

        setAssignLoading(true);
        try {
            // Assign each selected task one by one
            for (const taskId of selectedTaskIds) {
                await addTaskToPractice(practiceId, taskId, token);
            }
            message.success(t('simManager.assignTaskModal.assignSuccess', { count: selectedTaskIds.length }));
            setIsModalVisible(false);
            setSelectedTaskIds([]);
            onAssigned?.(); // Callback to reload parent task list
        } catch (e) {
            console.error('Error assigning tasks:', e);
            let errorMsg = t('simManager.assignTaskModal.assignFailed');
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
            setAssignLoading(false);
        }
    };

    // Table columns
    const columns = [
        {
            title: t('simManager.assignTaskModal.taskName'),
            dataIndex: 'taskName',
            key: 'taskName',
            width: 220,
            ellipsis: true,
            render: (text) => <span className="font-bold text-black uppercase">{text}</span>
        },
        {
            title: t('simManager.assignTaskModal.taskCode'),
            dataIndex: 'taskCode',
            key: 'taskCode',
            width: 150,
            render: (code) => code ? (
                <span className="font-mono text-xs font-bold bg-neutral-100 px-2 py-1 border border-neutral-300">
                    {code}
                </span>
            ) : '-',
        },
        {
            title: t('simManager.assignTaskModal.description'),
            dataIndex: 'taskDescription',
            key: 'taskDescription',
            ellipsis: true,
            width: 300,
            render: (text) => <span className="text-neutral-600 font-medium">{text}</span>
        },
    ];

    // Row selection config
    const rowSelection = {
        selectedRowKeys: selectedTaskIds,
        onChange: (selectedRowKeys) => {
            setSelectedTaskIds(selectedRowKeys);
        },
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="group inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
                <Plus className="w-4 h-4" />
                {t('simManager.assignTaskModal.assignTask')}
            </button>

            <Modal
                title={null}
                open={isModalVisible}
                onCancel={handleClose}
                closeIcon={null}
                width={900}
                centered
                footer={null}
                className="industrial-modal"
                styles={{ content: { padding: 0, borderRadius: 0, border: '2px solid #000', overflow: 'hidden' } }}
            >
                <div className="bg-white">
                    {/* Header */}
                    <div className="bg-black p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
                                <CheckSquare className="w-5 h-5 text-black" />
                            </div>
                            <h3 className="text-white font-black uppercase text-lg tracking-wider">
                                {t('simManager.assignTaskModal.title')}
                            </h3>
                        </div>
                        <button onClick={handleClose} className="text-white hover:text-yellow-400 transition-colors">
                            <span className="text-2xl font-bold leading-none">&times;</span>
                        </button>
                    </div>
                    <div className="h-1 bg-yellow-400 w-full" />

                    {loading ? (
                        <div className="flex justify-center items-center h-[400px]">
                            <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin" />
                        </div>
                    ) : allTasks.length === 0 ? (
                        <div className="p-12">
                            <Empty description={t('simManager.assignTaskModal.noTasksAvailable')} />
                        </div>
                    ) : (
                        <div className="flex flex-col h-[600px]">
                            {/* Table */}
                            <div className="flex-1 overflow-auto p-0 border-b-2 border-neutral-200 industrial-table-wrapper">
                                <style>{`
                                    .industrial-table-wrapper .ant-table-thead > tr > th {
                                        background-color: #171717 !important;
                                        color: #ffffff !important;
                                        border-bottom: 2px solid #404040 !important;
                                        border-radius: 0 !important;
                                        text-transform: uppercase;
                                        font-weight: 800;
                                        font-size: 12px;
                                    }
                                     .industrial-table-wrapper .ant-table-wrapper .ant-table-thead > tr > th::before {
                                        display: none !important;
                                    }
                                    .industrial-table-wrapper .ant-table-tbody > tr > td {
                                        border-bottom: 1px solid #e5e5e5;
                                        font-weight: 500;
                                    }
                                    .industrial-table-wrapper .ant-table-tbody > tr.ant-table-row-selected > td {
                                         background-color: #fefce8 !important;
                                    }
                                    .industrial-table-wrapper .ant-table-tbody > tr:hover > td {
                                        background-color: #fefce8 !important;
                                    }
                                    .industrial-table-wrapper .ant-checkbox-inner {
                                        border: 2px solid #000 !important;
                                        border-radius: 0 !important;
                                    }
                                    .industrial-table-wrapper .ant-checkbox-checked .ant-checkbox-inner {
                                        background-color: #facc15 !important;
                                        border-color: #000 !important;
                                    }
                                    .industrial-table-wrapper .ant-checkbox-checked .ant-checkbox-inner::after {
                                        border-color: #000 !important;
                                    }
                                `}</style>
                                <Table
                                    rowSelection={{
                                        ...rowSelection,
                                        type: 'checkbox',
                                    }}
                                    columns={columns}
                                    dataSource={allTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                    rowKey="id"
                                    size="middle"
                                    pagination={false}
                                />
                            </div>

                            {/* Footer Actions & Pagination */}
                            <div className="p-4 bg-neutral-50 flex items-center justify-between gap-4 border-t-2 border-neutral-200">
                                {/* Pagination - Matches "My Classes" style */}
                                <div className="flex-none">
                                    <style>{`
                                        .industrial-pagination .ant-pagination-item-active {
                                        border-color: #000 !important;
                                        background: transparent !important;
                                        }
                                        .industrial-pagination .ant-pagination-item-active a {
                                        color: #000 !important;
                                        }
                                        .industrial-pagination .ant-pagination-options .ant-select-selector {
                                        border-radius: 0 !important;
                                        border: 1px solid #d4d4d4 !important;
                                        }
                                        .industrial-pagination .ant-pagination-item {
                                        border-radius: 0 !important;
                                        border: none !important;
                                        }
                                        .industrial-pagination .ant-pagination-prev .ant-pagination-item-link,
                                        .industrial-pagination .ant-pagination-next .ant-pagination-item-link {
                                        border-radius: 0 !important;
                                        border: 1px solid #d4d4d4 !important;
                                        }
                                    `}</style>
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={allTasks.length}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                        className="industrial-pagination"
                                        itemRender={(curr, type, originalElement) => {
                                            if (type === 'page') {
                                                return (
                                                    <a className={`font-bold flex items-center justify-center w-full h-full border border-neutral-300 hover:border-yellow-400 hover:text-yellow-600 transition-colors ${curr === currentPage ? 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-neutral-600 hover:shadow-[2px_2px_0px_0px_rgba(250,204,21,1)]'}`}>
                                                        {curr}
                                                    </a>
                                                );
                                            }
                                            return originalElement;
                                        }}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2.5 bg-white text-neutral-700 font-bold uppercase tracking-wider border-2 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-all text-sm"
                                    >
                                        {t('simManager.assignTaskModal.cancel')}
                                    </button>
                                    <button
                                        onClick={handleAssign}
                                        disabled={selectedTaskIds.length === 0 || assignLoading}
                                        className="px-6 py-2.5 bg-black text-white font-bold uppercase tracking-wider border-2 border-black hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-[4px_4px_0px_0px_rgba(168,162,158,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                    >
                                        {assignLoading ? <Spin size="small" /> : <Plus className="w-4 h-4" />}
                                        {t('simManager.assignTaskModal.assignSelected', { count: selectedTaskIds.length })}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default AssignTaskModal;
