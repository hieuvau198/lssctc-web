import { App, Avatar, Button, Divider, Empty, Pagination, Popconfirm, Skeleton, Space, Table, Tag, Tooltip } from "antd";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { approveEnrollment, fetchClassTrainees, rejectEnrollment } from "../../../../apis/ProgramManager/ClassesApi";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import { getClassStatus } from "../../../../utils/classStatus";
import { getEnrollmentStatus } from "../../../../utils/enrollmentStatus";
import AddTrainee from "./AddTrainee";

const ClassMembersTable = ({ classItem }) => {
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
        { title: '#', dataIndex: 'idx', width: 60, align: 'center' },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            width: 80,
            align: 'center',
            render: (src, record) => (
                <Avatar src={src} alt={record.fullName} style={{ backgroundColor: '#f3f4f6' }}>
                    {!src && (record.fullName || '-').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                </Avatar>
            ),
        },
        { title: 'Full name', dataIndex: 'fullName' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Phone', dataIndex: 'phoneNumber', width: 150 },
        {
            title: 'Enroll Date',
            dataIndex: 'enrollDate',
            width: 150,
            render: (d) => <DayTimeFormat value={d} />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (s) => {
                const st = getEnrollmentStatus(s);
                return <Tag color={st.color}>{st.label}</Tag>;
            },
            width: 110,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => {
                const st = getEnrollmentStatus(record.status);
                // Only show actions for Pending status
                if (st.key !== 'Pending') {
                    return <span className="text-gray-400">-</span>;
                }
                const isApproving = actionLoading[record.enrollmentId] === 'approve';
                const isRejecting = actionLoading[record.enrollmentId] === 'reject';
                const isLoading = isApproving || isRejecting;
                return (
                    <Space size="small">
                        <Popconfirm
                            title="Approve enrollment"
                            description="Are you sure you want to approve this trainee?"
                            onConfirm={() => handleApprove(record.enrollmentId)}
                            okText="Yes"
                            cancelText="No"
                            disabled={isLoading}
                        >
                            <Tooltip title={'Approve'}>
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
                            title="Reject enrollment"
                            description="Are you sure you want to reject this trainee?"
                            onConfirm={() => handleReject(record.enrollmentId)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ danger: true }}
                            disabled={isLoading}
                        >
                            <Tooltip title={'Reject'}>
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
            message.success('Enrollment approved successfully');
            handleTraineeAdded(); // reload list
        } catch (err) {
            console.error('Failed to approve enrollment:', err);
            message.error(err?.response?.data?.message || 'Failed to approve enrollment');
        } finally {
            setActionLoading((prev) => ({ ...prev, [enrollmentId]: null }));
        }
    };

    // Handle reject enrollment
    const handleReject = async (enrollmentId) => {
        setActionLoading((prev) => ({ ...prev, [enrollmentId]: 'reject' }));
        try {
            await rejectEnrollment(enrollmentId);
            message.success('Enrollment rejected successfully');
            handleTraineeAdded(); // reload list
        } catch (err) {
            console.error('Failed to reject enrollment:', err);
            message.error(err?.response?.data?.message || 'Failed to reject enrollment');
        } finally {
            setActionLoading((prev) => ({ ...prev, [enrollmentId]: null }));
        }
    };

    const members = (trainees && trainees.length > 0) ? trainees : (Array.isArray(classItem.members) ? classItem.members : []);

    return (
        <div>
            <Divider orientation="left">Members ({totalCount})</Divider>
            {/* Add Trainee button - only show when class is Draft or Open */}
            {(() => {
                const s = getClassStatus(classItem.status);
                if (s.key === 'Draft' || s.key === 'Open') {
                    return (
                        <div className="ml-3 mb-4">
                            <AddTrainee classItem={classItem} onAssigned={handleTraineeAdded} />
                        </div>
                    );
                }
                return null;
            })()}

            {traineesLoading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
            ) : members.length === 0 ? (
                <Empty description="No members" />
            ) : (
                <div>
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

                                <div className="p-4 bg-white flex justify-center">
                                    <Pagination
                                        current={page}
                                        pageSize={pageSize}
                                        total={totalCount}
                                        onChange={(p, s) => { setPage(p); setPageSize(s); }}
                                        showSizeChanger
                                        pageSizeOptions={["10", "20", "35", "50"]}
                                        showTotal={(t, range) => `${range[0]}-${range[1]} of ${t} trainees`}
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
