import React, { useEffect, useState, useCallback } from 'react';
import { Button, Modal, App, Empty, Spin, Table, Tag, Tooltip, Pagination } from 'antd';
import { Plus } from 'lucide-react';
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
        },
        {
            title: t('simManager.assignTaskModal.taskCode'),
            dataIndex: 'taskCode',
            key: 'taskCode',
            width: 150,
            render: (code) => code ? <Tag color="blue">{code}</Tag> : '-',
        },
        {
            title: t('simManager.assignTaskModal.description'),
            dataIndex: 'taskDescription',
            key: 'taskDescription',
            ellipsis: true,
            width: 300,
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
            <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={handleOpen}
            >
                {t('simManager.assignTaskModal.assignTask')}
            </Button>

            <Modal
                title={t('simManager.assignTaskModal.title')}
                open={isModalVisible}
                onCancel={handleClose}
                width={850}
                centered
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        {t('simManager.assignTaskModal.cancel')}
                    </Button>,
                    <Button
                        key="assign"
                        type="primary"
                        icon={<Plus size={16} />}
                        loading={assignLoading}
                        disabled={selectedTaskIds.length === 0}
                        onClick={handleAssign}
                    >
                        {t('simManager.assignTaskModal.assignSelected', { count: selectedTaskIds.length })}
                    </Button>,
                ]}
            >
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : allTasks.length === 0 ? (
                    <Empty description={t('simManager.assignTaskModal.noTasksAvailable')} />
                ) : (
                    <div className="flex flex-col h-[500px]">
                        {/* Table with fixed height, scrollable */}
                        <div className="flex-1 overflow-hidden">
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={allTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: '100%' }}
                            />
                        </div>
                        {/* Pagination fixed at bottom */}
                        <div className="border-t border-t-gray-400 pt-3 mt-3 flex justify-center">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={allTasks.length}
                                onChange={setCurrentPage}
                                showTotal={(total) => t('simManager.assignTaskModal.totalTasks', { total })}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AssignTaskModal;
