import { App, Button, Card, Divider, Empty, Spin } from 'antd';
import AttendanceSearch from './SlotPartials/AttendanceSearch';
import AttendanceTable from './SlotPartials/AttendanceTable';
import InfoCard from './SlotPartials/InfoCard';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAttendanceList, submitAttendance } from '../../../apis/TimeSlot/TimeSlot';
import { mockAttendanceList } from '../../../mocks/teachingSlots';
import sampleTimeslot from '../../../mocks/sampleTimeslot';

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

    // Displayed slot info: prefer query params but fall back to sampleTimeslot when available
    const displayedSlotInfo = useMemo(() => {
        const hasParams = slotInfo.className || slotInfo.date || slotInfo.startTime || slotInfo.endTime || slotInfo.room;
        if (hasParams) return slotInfo;
        if (Number(timeslotId) === Number(sampleTimeslot.timeslotId)) {
            // derive simple human-readable date/time from ISO strings
            const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString() : '';
            const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            return {
                className: sampleTimeslot.className,
                date: fmtDate(sampleTimeslot.startTime),
                startTime: fmtTime(sampleTimeslot.startTime),
                endTime: fmtTime(sampleTimeslot.endTime),
                room: sampleTimeslot.room || '',
            };
        }
        return slotInfo;
    }, [slotInfo, timeslotId]);

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

                // Determine source: API may return an array or a timeslot payload with `trainees`
                let source = null;

                if (data) {
                    if (Array.isArray(data) && data.length > 0) {
                        source = data;
                    } else if (data.trainees && Array.isArray(data.trainees)) {
                        source = data.trainees;
                    }
                }

                // If API returned nothing usable, try sampleTimeslot when id matches, otherwise fallback to mockAttendanceList
                if (!source) {
                    if (Number(timeslotId) === Number(sampleTimeslot.timeslotId)) {
                        source = sampleTimeslot.trainees;
                        // also populate slotInfo fields when using sample
                        // Note: slotInfo comes from search params; this will only help demo if params absent
                    } else {
                        source = mockAttendanceList;
                    }
                }

                // Map source data to attendance state with default status
                const mapStatus = (s) => {
                    // Default behavior: treat everyone as 'absent' unless the source explicitly marks them as present.
                    if (!s) return 'absent';
                    const lower = String(s).toLowerCase();
                    if (lower === 'present' || lower === 'presented' || lower === '2' || lower === 'presented') return 'present';
                    // anything else (NotStarted, Absent, Cancelled, etc.) => absent by default
                    return 'absent';
                };

                const mapped = (source || []).map(item => ({
                    traineeId: item.traineeId || item.id || item.enrollmentId,
                    fullName: item.fullName || item.traineeName || item.name || '',
                    email: item.email || '',
                    avatar: item.avatar || item.avatarUrl || null,
                    status: mapStatus(item.status || item.attendanceStatus),
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
        <div className="px-4 py-3 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Student List Table */}
                <div className="flex-1 p-4 shadow-sm rounded-lg border border-gray-200">
                    <div>
                        {/* Search Bar */}
                        <AttendanceSearch searchText={searchText} setSearchText={setSearchText} />

                        {/* Attendance Table */}
                        <AttendanceTable data={filteredData} onStatusChange={handleStatusChange} onNoteChange={handleNoteChange} />
                    </div>
                </div>

                {/* Right Column - Info & Actions (Sticky) */}
                <div className="w-full lg:w-1/3">
                    <InfoCard
                        slotInfo={displayedSlotInfo}
                        timeslotId={timeslotId}
                        summary={summary}
                        handleMarkAll={handleMarkAll}
                        handleBack={handleBack}
                        handleSubmit={handleSubmit}
                        submitting={submitting}
                    />
                </div>
            </div>
        </div>
    );
}
