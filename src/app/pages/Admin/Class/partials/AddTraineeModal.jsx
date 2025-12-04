import React, { useState, useCallback } from 'react';
import { Button, Modal, App, Empty, Spin, Table, Tag, Pagination, Avatar } from 'antd';
import { Plus } from 'lucide-react';
import { getTrainees } from '../../../../apis/Admin/AdminUser';
import { enrollTrainee } from '../../../../apis/ProgramManager/ClassesApi';

const AddTraineeModal = ({ classItem, existingTraineeIds = [], onAssigned }) => {
    const { message } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allTrainees, setAllTrainees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTraineeIds, setSelectedTraineeIds] = useState([]);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch available trainees when modal opens
    const fetchAvailableTrainees = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTrainees({ page: 1, pageSize: 500 });
            const allTraineesList = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);

            // Filter out trainees that are already enrolled in this class
            const existingSet = new Set(existingTraineeIds);
            const availableTrainees = allTraineesList.filter(t => !existingSet.has(t.id));

            setAllTrainees(availableTrainees);
        } catch (err) {
            console.error('Error fetching trainees:', err);
            message.error('Failed to load available trainees');
            setAllTrainees([]);
        } finally {
            setLoading(false);
        }
    }, [existingTraineeIds, message]);

    // Open modal and fetch trainees
    const handleOpen = () => {
        setIsModalVisible(true);
        setSelectedTraineeIds([]);
        setCurrentPage(1);
        fetchAvailableTrainees();
    };

    // Close modal
    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedTraineeIds([]);
        setCurrentPage(1);
    };

    // Enroll selected trainees
    const handleEnroll = async () => {
        if (selectedTraineeIds.length === 0) {
            message.warning('Please select at least one trainee to enroll');
            return;
        }

        setEnrollLoading(true);
        try {
            // Enroll each selected trainee one by one
            for (const traineeId of selectedTraineeIds) {
                await enrollTrainee({ classId: classItem.id, traineeId });
            }
            message.success(`Successfully enrolled ${selectedTraineeIds.length} trainee(s) to class`);
            setIsModalVisible(false);
            setSelectedTraineeIds([]);
            onAssigned?.(); // Callback to reload parent list
        } catch (e) {
            console.error('Error enrolling trainees:', e);
            let errorMsg = 'Failed to enroll trainees';
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
            setEnrollLoading(false);
        }
    };

    // Table columns
    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatarUrl',
            key: 'avatar',
            width: 70,
            align: 'center',
            render: (src, record) => (
                <Avatar src={src} alt={record.fullName} style={{ backgroundColor: '#f3f4f6' }}>
                    {!src && (record.fullName || '-').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                </Avatar>
            ),
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            width: 220,
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 140,
            render: (phone) => phone || '-',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            align: 'center',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
    ];

    // Row selection config
    const rowSelection = {
        selectedRowKeys: selectedTraineeIds,
        onChange: (selectedRowKeys) => {
            setSelectedTraineeIds(selectedRowKeys);
        },
    };

    if (!classItem) return null;

    return (
        <>
            <div className="flex justify-end">
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={handleOpen}
                >
                    Add Trainee
                </Button>
            </div>
            <Modal
                title="Add Trainees to Class"
                open={isModalVisible}
                onCancel={handleClose}
                width={850}
                centered
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        Cancel
                    </Button>,
                    <Button
                        key="enroll"
                        type="primary"
                        icon={<Plus size={16} />}
                        loading={enrollLoading}
                        disabled={selectedTraineeIds.length === 0}
                        onClick={handleEnroll}
                    >
                        Enroll Selected ({selectedTraineeIds.length})
                    </Button>,
                ]}
            >
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : allTrainees.length === 0 ? (
                    <Empty description="No available trainees to add. All trainees are already enrolled in this class." />
                ) : (
                    <div className="flex flex-col h-[500px]">
                        {/* Table with fixed height, scrollable */}
                        <div className="flex-1 overflow-hidden">
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={allTrainees.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 400 }}
                            />
                        </div>
                        {/* Pagination fixed at bottom */}
                        <div className="border-t border-t-gray-400 pt-3 mt-3 flex justify-center">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={allTrainees.length}
                                onChange={setCurrentPage}
                                showTotal={(total) => `Total ${total} trainees`}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AddTraineeModal;
