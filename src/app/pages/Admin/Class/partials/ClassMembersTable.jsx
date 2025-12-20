import { App, Avatar, Button, Divider, Empty, Pagination, Popconfirm, Skeleton, Space, Table, Tooltip } from "antd";
import { Check, X, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { approveEnrollment, fetchClassTrainees, rejectEnrollment } from "../../../../apis/ProgramManager/ClassesApi";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import { getClassStatus } from "../../../../utils/classStatus";
import { getEnrollmentStatus } from "../../../../utils/enrollmentStatus";
import AddTraineeModal from "./AddTraineeModal";

const getInitials = (name = '') => {
    return name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join('');
};

const ClassMembersTable = ({ classItem }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [trainees, setTrainees] = useState([]);
    const [traineesLoading, setTraineesLoading] = useState(false);
    const [traineesError, setTraineesError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [actionLoading, setActionLoading] = useState({});

    // load trainees list with pagination
    useEffect(() => {
        let active = true;
        async function loadTrainees() {
            if (!classItem?.id) {
                setTrainees([]);
                setTotalCount(0);
                return;
            }
            setTraineesLoading(true);
            setTraineesError(null);
            try {
                const data = await fetchClassTrainees(classItem.id, { page, pageSize });
                if (!active) return;
                // normalize: expect { items: [], totalCount }
                const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
                setTrainees(items || []);
                const total = typeof data?.totalCount === 'number' ? data.totalCount : (Array.isArray(data) ? data.length : (data?.items?.length || 0));
                setTotalCount(total);
            } catch (err) {
                if (!active) return;
                console.error('Failed to fetch trainees:', err);
                setTraineesError(err?.message || 'Failed to load trainees');
                setTrainees([]);
                setTotalCount(0);
            } finally {
                if (active) setTraineesLoading(false);
            }
        }
        loadTrainees();
        return () => { active = false; };
    }, [classItem?.id, page, pageSize]);

    const columns = [
        {
            title: '#',
            dataIndex: 'idx',
            width: 60,
            align: 'center',
            render: (v) => <span className="font-bold text-neutral-500">{v}</span>
        },
        {
            title: t('common.avatar'),
            dataIndex: 'avatar',
            width: 80,
            align: 'center',
            render: (src, record) => (
                <Avatar
                    src={src}
                    alt={record.fullName}
                    style={{ backgroundColor: '#facc15', color: '#000', fontWeight: 'bold' }}
                >
                    {!src && getInitials(record.fullName)}
                </Avatar>
            ),
        },
        {
            title: t('common.fullName'),
            dataIndex: 'fullName',
            render: (text) => <span className="font-bold text-black">{text}</span>
        },
        {
            title: t('common.email'),
            dataIndex: 'email',
            render: (text) => <span className="text-neutral-600">{text}</span>
        },
        {
            title: t('common.phone'),
            dataIndex: 'phoneNumber',
            width: 150,
            render: (text) => <span className="font-medium">{text}</span>
        },
        {
            title: t('admin.classes.columns.enrollDate'),
            dataIndex: 'enrollDate',
            width: 150,
            render: (d) => <span className="text-neutral-600"><DayTimeFormat value={d} /></span>,
        },
        {
            title: t('common.status'),
            dataIndex: 'status',
            render: (s) => {
                const st = getEnrollmentStatus(s);
                const colorMap = {
                    'green': 'bg-green-100 text-green-800 border-green-300',
                    'blue': 'bg-blue-100 text-blue-800 border-blue-300',
                    'orange': 'bg-orange-100 text-orange-800 border-orange-300',
                    'red': 'bg-red-100 text-red-800 border-red-300',
                    'default': 'bg-neutral-100 text-neutral-800 border-neutral-300',
                };
                const statusClass = colorMap[st.color] || colorMap.default;
                return (
                    <span className={`px-3 py-1 text-xs font-bold uppercase border whitespace-nowrap ${statusClass}`}>
                        {st.label}
                    </span>
                );
            },
            width: 140,
        },
        {
            title: t('common.action'),
            dataIndex: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => {
                const st = getEnrollmentStatus(record.status);
                // Only show actions for Pending status
                if (st.key !== 'Pending') {
                    return <span className="text-neutral-400">-</span>;
                }
                const isApproving = actionLoading[record.enrollmentId] === 'approve';
                const isRejecting = actionLoading[record.enrollmentId] === 'reject';
                const isLoading = isApproving || isRejecting;
                return (
                    <Space size="small">
                        <Popconfirm
                            title={t('admin.classes.popconfirm.approveEnrollment')}
                            description={t('admin.classes.popconfirm.approveEnrollmentDesc')}
                            onConfirm={() => handleApprove(record.enrollmentId)}
                            okText={t('common.yes')}
                            cancelText={t('common.no')}
                            disabled={isLoading}
                        >
                            <Tooltip title={t('admin.classes.members.approve')}>
                                <Button
                                    type="primary"
                                    size="small"
                                    shape="circle"
                                    icon={<Check size={16} />}
                                    loading={isApproving}
                                    disabled={isRejecting}
                                />
                            </Tooltip>
                        </Popconfirm>
                        <Popconfirm
                            title={t('admin.classes.popconfirm.rejectEnrollment')}
                            description={t('admin.classes.popconfirm.rejectEnrollmentDesc')}
                            onConfirm={() => handleReject(record.enrollmentId)}
                            okText={t('common.yes')}
                            cancelText={t('common.no')}
                            okButtonProps={{ danger: true }}
                            disabled={isLoading}
                        >
                            <Tooltip title={t('admin.classes.members.reject')}>
                                <Button
                                    danger
                                    size="small"
                                    shape="circle"
                                    icon={<X size={16} />}
                                    loading={isRejecting}
                                    disabled={isApproving}
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const handleTraineeAdded = () => {
        // reload trainees by resetting page to 1 and refetching
        if (classItem?.id) {
            setPage(1);
            setTraineesLoading(true);
            fetchClassTrainees(classItem.id, { page: 1, pageSize })
                .then((data) => {
                    const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
                    setTrainees(items || []);
                    const total = typeof data?.totalCount === 'number' ? data.totalCount : (Array.isArray(data) ? data.length : (data?.items?.length || 0));
                    setTotalCount(total);
                })
                .catch((e) => console.error('Failed to reload trainees', e))
                .finally(() => setTraineesLoading(false));
        }
    };

    // Handle approve enrollment
    const handleApprove = async (enrollmentId) => {
        setActionLoading((prev) => ({ ...prev, [enrollmentId]: 'approve' }));
        try {
            await approveEnrollment(enrollmentId);
            message.success(t('admin.classes.messages.approveSuccess'));
            handleTraineeAdded(); // reload list
        } catch (err) {
            console.error('Failed to approve enrollment:', err);
            message.error(err?.response?.data?.message || t('admin.classes.messages.approveFailed'));
        } finally {
            setActionLoading((prev) => ({ ...prev, [enrollmentId]: null }));
        }
    };

    // Handle reject enrollment
    const handleReject = async (enrollmentId) => {
        setActionLoading((prev) => ({ ...prev, [enrollmentId]: 'reject' }));
        try {
            await rejectEnrollment(enrollmentId);
            message.success(t('admin.classes.messages.rejectSuccess'));
            handleTraineeAdded(); // reload list
        } catch (err) {
            console.error('Failed to reject enrollment:', err);
            message.error(err?.response?.data?.message || t('admin.classes.messages.rejectFailed'));
        } finally {
            setActionLoading((prev) => ({ ...prev, [enrollmentId]: null }));
        }
    };

    const members = trainees || [];

    return (
        <div>
            {/* Industrial Table Styles */}
            <style>{`
                .industrial-members-table .ant-table-thead > tr > th {
                    background: #fef08a !important;
                    border-bottom: 2px solid #000 !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    font-size: 12px !important;
                    letter-spacing: 0.05em !important;
                    color: #000 !important;
                }
                .industrial-members-table .ant-table-thead > tr > th::before {
                    display: none !important;
                }
                .industrial-members-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #e5e5e5 !important;
                }
                .industrial-members-table .ant-table-tbody > tr:hover > td {
                    background: #fef9c3 !important;
                }
            `}</style>

            <Divider orientation="left" className="!font-bold !uppercase !text-black !border-black">
                {t('admin.classes.detail.members')} ({totalCount})
            </Divider>

            {/* Add Trainee button - only show when class is Draft or Open */}
            {(() => {
                const s = getClassStatus(classItem.status);
                if (s.key === 'Draft' || s.key === 'Open') {
                    return (
                        <div className="ml-3 mb-4">
                            <AddTraineeModal
                                classItem={classItem}
                                existingTraineeIds={trainees.map(t => t.traineeId || t.id)}
                                onAssigned={handleTraineeAdded}
                            />
                        </div>
                    );
                }
                return null;
            })()}

            {traineesLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-neutral-100 animate-pulse" />
                    ))}
                </div>
            ) : members.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-neutral-400" />
                    </div>
                    <p className="text-neutral-800 font-bold uppercase">{t('admin.classes.detail.noMembers')}</p>
                </div>
            ) : (
                <div className="industrial-members-table">
                    {(() => {
                        const rows = members.map((it, idx) => ({
                            key: it.id || it.traineeId || idx,
                            enrollmentId: it.id, // enrollment id for approve/reject
                            idx: (page - 1) * pageSize + idx + 1,
                            avatar: it.avatarUrl || it.avatar || '',
                            fullName: it.traineeName || it.trainee?.fullName || it.traineeName || '-',
                            email: it.email || it.trainee?.email || '-',
                            phoneNumber: it.phoneNumber || it.phone || '-',
                            traineeCode: it.traineeCode || it.classCode || '',
                            enrollDate: it.enrollDate,
                            status: it.status,
                        }));

                        return (
                            <>
                                <Table
                                    dataSource={rows}
                                    columns={columns}
                                    pagination={false}
                                    rowKey="key"
                                    size="middle"
                                    loading={traineesLoading}
                                    scroll={{ y: 320 }}
                                />

                                <div className="py-4 border-t-2 border-neutral-200 bg-white flex justify-center">
                                    <Pagination
                                        current={page}
                                        pageSize={pageSize}
                                        total={totalCount}
                                        onChange={(p, s) => { setPage(p); setPageSize(s); }}
                                        showSizeChanger
                                        pageSizeOptions={["10", "20", "35", "50"]}
                                        showTotal={(total, range) => (
                                            <span className="text-sm font-medium text-neutral-600">
                                                {range[0]}-{range[1]} / {total}
                                            </span>
                                        )}
                                    />
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default ClassMembersTable;

