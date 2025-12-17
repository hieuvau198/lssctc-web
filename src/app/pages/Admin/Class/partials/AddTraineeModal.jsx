import React, { useState, useCallback } from 'react';
import { Button, Modal, App, Empty, Spin, Table, Tag, Pagination, Avatar, Divider, Input } from 'antd';
import { Plus, Search, User, Mail, Phone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTrainees } from '../../../../apis/Admin/AdminUser';
import { enrollTrainee } from '../../../../apis/ProgramManager/ClassesApi';

const AddTraineeModal = ({ classItem, existingTraineeIds = [], onAssigned }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allTrainees, setAllTrainees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTraineeIds, setSelectedTraineeIds] = useState([]);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');

    // Fetch available trainees when modal opens
    const fetchAvailableTrainees = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTrainees({ page: 1, pageSize: 1000 }); // Increase limit to fetch mostly all, handle improved logic if API supports filtering
            const allTraineesList = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);

            // Filter out trainees that are already enrolled in this class
            const existingSet = new Set(existingTraineeIds);
            const availableTrainees = allTraineesList.filter(t => !existingSet.has(t.id));

            setAllTrainees(availableTrainees);
        } catch (err) {
            console.error('Error fetching trainees:', err);
            message.error(t('admin.classes.messages.loadTraineesFailed'));
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
        setSearchText('');
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
            message.warning(t('admin.classes.messages.selectTrainee'));
            return;
        }

        setEnrollLoading(true);
        try {
            // Enroll each selected trainee one by one
            for (const traineeId of selectedTraineeIds) {
                await enrollTrainee({ classId: classItem.id, traineeId });
            }
            message.success(t('admin.classes.messages.enrollSuccess', { count: selectedTraineeIds.length }));
            setIsModalVisible(false);
            setSelectedTraineeIds([]);
            onAssigned?.(); // Callback to reload parent list
        } catch (e) {
            console.error('Error enrolling trainees:', e);
            let errorMsg = t('admin.classes.messages.enrollFailed');
            message.error(errorMsg);
        } finally {
            setEnrollLoading(false);
        }
    };

    // Filter trainees based on search
    const filteredTrainees = allTrainees.filter(t =>
        t.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Initial generator
    const getInitials = (name) => (name || '').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('');

    // Table columns
    const columns = [
        {
            title: t('common.avatar'),
            dataIndex: 'avatarUrl',
            key: 'avatar',
            width: 70,
            align: 'center',
            render: (src, record) => (
                <Avatar
                    src={src}
                    alt={record.fullName}
                    style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' }}
                >
                    {!src && getInitials(record.fullName)}
                </Avatar>
            ),
        },
        {
            title: t('common.fullName'),
            dataIndex: 'fullName',
            key: 'fullName',
            ellipsis: true,
            render: (text) => <span className="font-semibold text-slate-700">{text}</span>
        },
        {
            title: t('common.email'),
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            width: 250,
            render: (text) => <span className="text-slate-500">{text}</span>
        },
        {
            title: t('common.phone'),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 140,
            render: (phone) => <span className="font-mono text-slate-600">{phone || '-'}</span>,
        },
        {
            title: t('common.status'),
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            align: 'center',
            render: (isActive) => (
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} rounded-sm`}>
                    {isActive ? t('common.active') : t('common.inactive')}
                </span>
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
                    icon={<Plus size={16} strokeWidth={2.5} />}
                    onClick={handleOpen}
                    className="bg-yellow-400 text-black border border-yellow-500 font-bold h-9 px-4 rounded-md hover:bg-yellow-500 hover:text-black shadow-sm transition-all flex items-center gap-2"
                >
                    {t('admin.classes.buttons.addTrainee')}
                </Button>
            </div>

            <style>{`
                .trainee-modal .ant-modal-content {
                    border-radius: 8px !important;
                    padding: 0 !important;
                    overflow: hidden;
                }
                .trainee-modal .ant-modal-header {
                    padding: 16px 24px;
                    border-bottom: 1px solid #f0f0f0;
                    margin-bottom: 0;
                }
                .trainee-modal .ant-modal-title {
                    font-size: 18px;
                    font-weight: 700;
                }
                .trainee-table .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    font-weight: 600;
                    color: #475569;
                }
                .trainee-table .ant-table-body {
                   scrollbar-width: thin;
                }
            `}</style>

            <Modal
                title={
                    <div className="flex items-center gap-2 text-slate-800">
                        <User size={20} className="text-yellow-500" />
                        <span>{t('admin.classes.modal.addTraineeTitle')}</span>
                    </div>
                }
                open={isModalVisible}
                onCancel={handleClose}
                width={900}
                centered
                className="trainee-modal"
                footer={[
                    <div key="footer" className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="text-sm text-slate-500 font-medium">
                            {selectedTraineeIds.length > 0 ? (
                                <span className="text-blue-600 font-bold">{selectedTraineeIds.length} trainees selected</span>
                            ) : (
                                <span>Select trainees to enroll</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button key="cancel" onClick={handleClose} className="rounded-md h-9 border-slate-300 font-medium text-slate-600 hover:text-slate-800 hover:border-slate-400">
                                {t('common.cancel')}
                            </Button>
                            <Button
                                key="enroll"
                                type="primary"
                                icon={<Plus size={16} />}
                                loading={enrollLoading}
                                disabled={selectedTraineeIds.length === 0}
                                onClick={handleEnroll}
                                className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md h-9 font-bold px-6 shadow-sm disabled:bg-slate-200 disabled:text-slate-400"
                            >
                                {t('admin.classes.buttons.enrollSelected', { count: selectedTraineeIds.length })}
                            </Button>
                        </div>
                    </div>
                ]}
                closeIcon={<div className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={18} className="text-slate-400" /></div>}
            >
                <div className="p-6">
                    {/* Search Bar */}
                    <div className="mb-4">
                        <Input
                            prefix={<Search size={16} className="text-slate-400" />}
                            placeholder="Search by name or email..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            className="h-10 rounded-md border-slate-300 hover:border-blue-400 focus:border-blue-500"
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Spin size="large" />
                        </div>
                    ) : filteredTrainees.length === 0 ? (
                        <div className="border border-dashed border-slate-300 rounded-lg p-12 flex flex-col items-center justify-center bg-slate-50">
                            <Empty description={
                                allTrainees.length === 0
                                    ? t('admin.classes.messages.noAvailableTrainees')
                                    : "No trainees match your search"
                            } />
                        </div>
                    ) : (
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={filteredTrainees.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                rowKey="id"
                                size="middle"
                                pagination={false}
                                scroll={{ y: 380 }}
                                className="trainee-table"
                            />
                            <div className="border-t border-slate-200 bg-white p-2 flex justify-center">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredTrainees.length}
                                    onChange={setCurrentPage}
                                    showTotal={(total) => <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total {total} Trainees</span>}
                                    size="small"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default AddTraineeModal;
