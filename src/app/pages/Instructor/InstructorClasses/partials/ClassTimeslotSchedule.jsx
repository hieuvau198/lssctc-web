import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App, Tooltip } from 'antd';
import { Clock, MapPin, Calendar, Eye, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstructorClassTimeslots } from '../../../../apis/TimeSlot/TimeSlot';
import IndustrialTable from '../../../../components/Common/IndustrialTable';

/**
 * ClassTimeslotSchedule - List View (Industrial Theme)
 */
export default function ClassTimeslotSchedule({ classId, className }) {
    const { t, i18n } = useTranslation();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const isVietnamese = i18n.language?.startsWith('vi');

    const [loading, setLoading] = useState(false);
    const [timeslots, setTimeslots] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!classId) return;

        const fetchTimeslots = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getInstructorClassTimeslots(classId);
                // Sort timeslots by startTime
                const sortedData = (data || []).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                setTimeslots(sortedData);
            } catch (err) {
                setError(err.message || 'Failed to load timeslots');
                message.error('Không thể tải lịch lớp học.');
            } finally {
                setLoading(false);
            }
        };

        fetchTimeslots();
    }, [classId, message]);

    // Status styling helper
    const getStatusStyle = (status) => {
        const statusMap = {
            'NotStarted': { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300', label: isVietnamese ? 'Chưa bắt đầu' : 'Not Started' },
            'Ongoing': { bg: 'bg-yellow-400', text: 'text-black', border: 'border-black', label: isVietnamese ? 'Đã điểm danh' : 'Marked' },
            'Completed': { bg: 'bg-black', text: 'text-yellow-400', border: 'border-black', label: isVietnamese ? 'Đã điểm danh' : 'Marked' },
            'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400', label: isVietnamese ? 'Đã hủy' : 'Cancelled' },
        };
        return statusMap[status] || { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300', label: status || '-' };
    };

    const handleNavigateAttendance = (record) => {
        const timeslotId = record.id || record.timeslotId;
        if (!timeslotId) {
            message.warning('Missing timeslot ID');
            return;
        }

        const dateObj = new Date(record.startTime);
        const dateStr = dateObj.toISOString().split('T')[0];
        const startTime = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(record.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const room = record.locationRoom || record.locationBuilding || record.locationDetail || '';

        const params = new URLSearchParams({
            className: className || record.name || '',
            date: dateStr,
            startTime,
            endTime,
            room,
        });

        navigate(`/instructor/classes/${classId}/attendance/${timeslotId}?${params.toString()}`);
    };

    const columns = [
        {
            title: t('common.date', 'Date'),
            dataIndex: 'startTime',
            key: 'date',
            width: 150,
            render: (text) => (
                <div className="flex items-center gap-2 font-bold text-black">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                    {new Date(text).toLocaleDateString('vi-VN')}
                </div>
            ),
        },
        {
            title: t('instructor.schedule.slot', 'Buổi học'),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex flex-col">
                    <span className="font-bold text-black uppercase">{text || record.className}</span>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>
                            {new Date(record.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(record.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: t('instructor.schedule.room', 'Phòng'),
            key: 'room',
            render: (_, record) => (
                <div className="flex items-center gap-2 text-neutral-700">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span className="font-medium">
                        {record.locationRoom || record.locationBuilding || record.locationDetail || '-'}
                    </span>
                </div>
            ),
        },
        {
            title: t('common.status', 'Trạng thái'),
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status) => {
                const style = getStatusStyle(status);
                return (
                    <span className={`px-2 py-1 text-xs font-bold uppercase border ${style.bg} ${style.text} ${style.border}`}>
                        {style.label}
                    </span>
                );
            },
        },
        {
            title: t('common.action', 'Thao tác'),
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Tooltip title={t('attendance.markAttendance', 'Điểm danh')}>
                    <button
                        onClick={() => handleNavigateAttendance(record)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-yellow-400 text-yellow-400 hover:text-black transition-all border border-black"
                    >
                        <CheckSquare className="w-4 h-4" />
                    </button>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white border-2 border-black p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-black uppercase tracking-tight">
                            {t('attendance.classSchedule') || 'Class Schedule'}
                        </span>
                        <span className="text-neutral-500 text-sm font-medium">
                            {className}
                        </span>
                    </div>
                </div>
                
                
            </div>

            {/* List Table */}
            <IndustrialTable
                columns={columns}
                dataSource={timeslots}
                loading={loading}
                rowKey={(record) => record.id || record.timeslotId || Math.random()}
                emptyText={error || t('common.noData', 'No schedule available')}
                pagination={true}
                pageSize={10}
            />
        </div>
    );
}