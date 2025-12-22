import { App, Avatar, Button, Divider, Empty, Pagination, Popconfirm, Space, Table, Tooltip } from "antd";
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
        // COMBINED: Avatar + Name + Email
        {
            title: t('admin.classes.members.traineeInfo', 'Trainee Information'),
            key: 'traineeInfo',
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.avatar}
                        alt={record.fullName}
                        size={40}
                        style={{ backgroundColor: '#facc15', color: '#000', fontWeight: 'bold', flexShrink: 0 }}
                    >
                        {!record.avatar && getInitials(record.fullName)}
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-black truncate leading-tight" title={record.fullName}>
                            {record.fullName}
                        </span>
                        <span className="text-xs text-neutral-500 truncate" title={record.email}>
                            {record.email}
                        </span>
                    </div>
                </div>
            ),
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
            {/* Industrial Table Styles - Matched to ClassTimeslotManage */}
            <style>{`
                .industrial-members-table .ant-table-thead > tr > th {
                    background: #000 !important;
                    color: #fff !important;
                    text-transform: uppercase;
                    font-weight: 700;
                    font-size: 12px;
                    letter-spacing: 0.05em;
                    border-radius: 0 !important;
                    padding: 12px 16px;
                }
                .industrial-members-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #e5e5e5;
                    padding: 16px;
                }
                .industrial-members-table .ant-table-container {
                    border: 2px solid #000;
                    border-radius: 0;
                }
                .industrial-members-table .ant-table-tbody > tr:hover > td {
                    background: #fef9c3 !important; /* Keep slight yellow hover */
                }
            `}</style>

            <div className="flex justify-between items-end mb-4 border-b-2 border-slate-200 pb-2">
                 <div className="flex items-center gap-3">
                    {/* Using simple text header to match the timeslot card style slightly better, or keep divider */}
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
                        <Users size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold uppercase tracking-wide text-slate-900">
                        {t('admin.classes.detail.members')} <span className="text-slate-500">({totalCount})</span>
                    </span>
                </div>
            </div>

            {/* Add Trainee button - only show when class is Draft or Open */}
            {(() => {
                const s = getClassStatus(classItem.status);
                if (s.key === 'Draft' || s.key === 'Open') {
                    return (
                        <div className="mb-4">
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
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50">
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
                            enrollmentId: it.id,
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