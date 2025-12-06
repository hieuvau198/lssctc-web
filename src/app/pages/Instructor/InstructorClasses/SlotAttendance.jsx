import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Table, Radio, Input, Button, Tag, Space, App, Spin, Empty, Divider } from 'antd';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Search, Save, Users, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAttendanceList, submitAttendance } from '../../../apis/TimeSlot/TimeSlot';
import { mockAttendanceList } from '../../../mocks/teachingSlots';
import BackButton from '../../../components/BackButton/BackButton';

const { TextArea } = Input;

/**
 * SlotAttendance - Trang điểm danh học viên cho một timeslot
 * Route: /instructor/classes/:classId/attendance/:timeslotId
 */
export default function SlotAttendance() {
    const { t } = useTranslation();
    const { classId, timeslotId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { message: messageApi } = App.useApp();

    // Get slot info from search params (passed from schedule)
    const slotInfo = useMemo(() => ({
        className: searchParams.get('className') || '',
        date: searchParams.get('date') || '',
        startTime: searchParams.get('startTime') || '',
        endTime: searchParams.get('endTime') || '',
        room: searchParams.get('room') || '',
    }), [searchParams]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [searchText, setSearchText] = useState('');

    // Fetch attendance list for this timeslot
    useEffect(() => {
        if (!timeslotId) return;

        const fetchAttendance = async () => {
            setLoading(true);
            setError(null);
            try {
                let data = null;
                try {
                    data = await getAttendanceList(timeslotId);
                } catch {
                    // API failed — we'll fallback to mock data below
                    data = null;
                }

                const source = (data && Array.isArray(data) && data.length > 0) ? data : mockAttendanceList;

                // Map source data to attendance state with default status
                const mapped = (source || []).map(item => ({
                    traineeId: item.traineeId || item.id,
                    fullName: item.fullName || item.traineeName || item.name || '',
                    email: item.email || '',
                    avatar: item.avatar || null,
                    status: item.status || 'present', // default to present
                    note: item.note || '',
                }));

                setAttendanceData(mapped);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách điểm danh');
                messageApi.error('Không thể tải danh sách học viên.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [timeslotId, messageApi]);

    // Handle status change for a trainee
    const handleStatusChange = (traineeId, status) => {
        setAttendanceData(prev =>
            prev.map(item =>
                item.traineeId === traineeId ? { ...item, status } : item
            )
        );
    };

    // Handle note change for a trainee
    const handleNoteChange = (traineeId, note) => {
        setAttendanceData(prev =>
            prev.map(item =>
                item.traineeId === traineeId ? { ...item, note } : item
            )
        );
    };

    // Mark all trainees with a status
    const handleMarkAll = (status) => {
        setAttendanceData(prev =>
            prev.map(item => ({ ...item, status }))
        );
        messageApi.success(
            status === 'present'
                ? t('attendance.markedAllPresent', 'Đã đánh dấu tất cả có mặt')
                : t('attendance.markedAllAbsent', 'Đã đánh dấu tất cả vắng mặt')
        );
    };

    // Submit attendance
    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = attendanceData.map(item => ({
                traineeId: item.traineeId,
                status: item.status,
                note: item.note,
            }));

            await submitAttendance(timeslotId, payload);

            const summary = {
                present: attendanceData.filter(a => a.status === 'present').length,
                absent: attendanceData.filter(a => a.status === 'absent').length,
            };

            messageApi.success(
                t('attendance.submitSuccess', `Điểm danh thành công! Có mặt: ${summary.present}, Vắng: ${summary.absent}`)
            );

            // Navigate back to class detail
            navigate(`/instructor/classes/${classId}`, { state: { activeTab: 'schedule' } });
        } catch {
            messageApi.error(t('attendance.submitFailed', 'Lưu điểm danh thất bại. Vui lòng thử lại.'));
        } finally {
            setSubmitting(false);
        }
    };

    // Go back to class detail
    const handleBack = () => {
        navigate(`/instructor/classes/${classId}`, { state: { activeTab: 'schedule' } });
    };

    // Filter data by search text
    const filteredData = useMemo(() => {
        if (!searchText) return attendanceData;
        const lower = searchText.toLowerCase();
        return attendanceData.filter(item =>
            item.fullName?.toLowerCase().includes(lower) ||
            item.email?.toLowerCase().includes(lower)
        );
    }, [attendanceData, searchText]);

    // Calculate summary
    const summary = useMemo(() => ({
        total: attendanceData.length,
        present: attendanceData.filter(a => a.status === 'present').length,
        absent: attendanceData.filter(a => a.status === 'absent').length,
    }), [attendanceData]);

    // Table columns
    const columns = [
        {
            title: '#',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index) => (
                <span className="text-gray-500 font-medium">{index + 1}</span>
            ),
        },
        {
            title: t('common.fullName', 'Họ và tên'),
            dataIndex: 'fullName',
            key: 'fullName',
            render: (name, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {record.avatar ? (
                            <img src={record.avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-blue-600" />
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{name}</div>
                        {record.email && (
                            <div className="text-sm text-gray-500">{record.email}</div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: t('common.status', 'Trạng thái'),
            dataIndex: 'status',
            key: 'status',
            width: 280,
            align: 'center',
            render: (status, record) => (
                <Radio.Group
                    value={status}
                    onChange={(e) => handleStatusChange(record.traineeId, e.target.value)}
                    buttonStyle="solid"
                    size="middle"
                >
                    <Radio.Button
                        value="present"
                        className="!rounded-l-lg"
                        style={{
                            backgroundColor: status === 'present' ? '#10B981' : undefined,
                            borderColor: status === 'present' ? '#10B981' : undefined,
                        }}
                    >
                        <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            <span>{t('attendance.present', 'Có mặt')}</span>
                        </div>
                    </Radio.Button>
                    <Radio.Button
                        value="absent"
                        className="!rounded-r-lg"
                        style={{
                            backgroundColor: status === 'absent' ? '#EF4444' : undefined,
                            borderColor: status === 'absent' ? '#EF4444' : undefined,
                        }}
                    >
                        <div className="flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" />
                            <span>{t('attendance.absent', 'Vắng')}</span>
                        </div>
                    </Radio.Button>
                </Radio.Group>
            ),
        },
        {
            title: t('attendance.note', 'Ghi chú'),
            dataIndex: 'note',
            key: 'note',
            width: 300,
            render: (note, record) => (
                <Input
                    placeholder={t('attendance.notePlaceholder', 'Nhập ghi chú (nếu có)...')}
                    value={note}
                    onChange={(e) => handleNoteChange(record.traineeId, e.target.value)}
                    allowClear
                />
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spin size="large" tip="Đang tải danh sách học viên..." />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="shadow-sm">
                <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE}>
                    <Button onClick={handleBack}>Quay lại</Button>
                </Empty>
            </Card>
        );
    }

    return (
        <div className="px-4 max-w-7xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-0">
                    <div>
                        <span className="text-xl font-bold text-gray-900">
                            {t('attendance.takeAttendance', 'Điểm danh')}
                        </span>
                        {slotInfo.className && (
                            <p className="text-gray-600 mt-1">
                                {slotInfo.className}
                            </p>
                        )}
                    </div>

                    {/* Slot Info Card */}
                    {(slotInfo.date || slotInfo.startTime) && (
                        <div className="flex items-center gap-4">
                            <Card size="small" className="bg-blue-50 border-blue-200 shadow-sm">
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {slotInfo.date && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            <span>{slotInfo.date}</span>
                                        </div>
                                    )}
                                    {slotInfo.startTime && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span>{slotInfo.startTime} - {slotInfo.endTime}</span>
                                        </div>
                                    )}
                                    {slotInfo.room && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            <span>{slotInfo.room}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                            {/* <BackButton size={'large'} /> */}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="shadow-xl flex-1 flex flex-col p-4 rounded-lg border border-gray-200 ">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 flex-shrink-0">
                    <div className="flex flex-1 items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder={t('attendance.searchStudent', 'Tìm học viên...')}
                                prefix={<Search className="w-4 h-4 text-gray-400" />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 280 }}
                                allowClear
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">{summary.total} {t('common.students', 'học viên')}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Tag color="success" className="text-sm">
                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                    {t('attendance.present', 'Có mặt')}: {summary.present}
                                </Tag>
                                <Tag color="error" className="text-sm">
                                    <XCircle className="w-3 h-3 inline mr-1" />
                                    {t('attendance.absent', 'Vắng')}: {summary.absent}
                                </Tag>
                            </div>

                            <Space>
                                <Button
                                    onClick={() => handleMarkAll('present')}
                                    icon={<CheckCircle className="w-4 h-4" />}
                                    className="flex items-center gap-1"
                                >
                                    {t('attendance.markAllPresent', 'Tất cả có mặt')}
                                </Button>
                                <Button
                                    onClick={() => handleMarkAll('absent')}
                                    icon={<XCircle className="w-4 h-4" />}
                                    className="flex items-center gap-1"
                                >
                                    {t('attendance.markAllAbsent', 'Tất cả vắng')}
                                </Button>
                            </Space>
                        </div>
                    </div>
                </div>

                {/* Attendance Table with fixed height and scroll */}
                <div className="flex-1 overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="traineeId"
                        pagination={false}
                        scroll={{ y: 340 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description={t('attendance.noStudents', 'Chưa có học viên nào trong lớp')}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            ),
                        }}
                    />
                </div>

                <Divider className="my-1 flex-shrink-0" />

                {/* Footer with Submit */}
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 flex-shrink-0">
                    <Button onClick={handleBack}>
                        {t('common.cancel', 'Hủy')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={submitting}
                        icon={<Save className="w-4 h-4" />}
                        className="flex items-center gap-1"
                    >
                        {t('attendance.submitAttendance', 'Lưu điểm danh')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
