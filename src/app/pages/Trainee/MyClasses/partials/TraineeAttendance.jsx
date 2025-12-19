import { Skeleton, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import TimeSlotApi from '../../../../apis/TimeSlot/TimeSlot';

export default function TraineeAttendance({ classId: classIdProp }) {
    const { t } = useTranslation();
    const { classId: classIdParam } = useParams();
    const classId = classIdProp ?? classIdParam;
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const fetchMyAttendance = async () => {
            if (!classId) {
                setDataSource([]);
                return;
            }
            setLoading(true);
            try {
                const res = await TimeSlotApi.getMyClassAttendance(classId);
                if (cancelled) return;
                
                const mapped = (res || []).map(item => {
                    const start = item.startTime ? new Date(item.startTime) : null;
                    const end = item.endTime ? new Date(item.endTime) : null;
                    const dateOnly = start ? start.toLocaleDateString('vi-VN') : '';
                    const startTime = start ? start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    const endTime = end ? end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    
                    return {
                        key: item.timeslotId ?? `${item.timeslotId}_${item.startTime}`,
                        slotId: item.timeslotId,
                        slotName: item.timeslotName || `Slot ${item.timeslotId}`,
                        timeRange: startTime || endTime ? `${startTime}${endTime ? ' - ' + endTime : ''}` : '',
                        date: dateOnly,
                        room: item.location || '-',
                        // Default to NotStarted if no status provided
                        scheduleStatus: item.attendanceStatus || 'NotStarted', 
                        note: item.note || '',
                    };
                });
                setDataSource(mapped);
            } catch (err) {
                setDataSource([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchMyAttendance();
        return () => { cancelled = true; };
    }, [classId]);

    const getStatusColor = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'present') return 'success';
        if (s === 'absent') return 'error';
        if (s === 'cancelled') return 'default';
        if (s === 'ongoing') return 'processing';
        if (s === 'completed') return 'blue';
        return 'default'; // NotStarted and others
    };

    const columns = [
        {
            title: t('attendance.slot') || 'Slot',
            dataIndex: 'slotName',
            key: 'slotName',
            width: 180,
            render: (v, r) => (
                <div>
                    <div className="font-semibold text-slate-800">{v}</div>
                    <div className="text-xs text-slate-400">{r.timeRange}</div>
                </div>
            ),
        },
        {
            title: t('attendance.date') || 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 140,
            render: (v) => <span className="text-slate-600 font-medium">{v}</span>,
        },
        {
            title: t('attendance.location') || 'Room',
            dataIndex: 'room',
            key: 'room',
            width: 160,
            render: (v) => <span className="text-slate-600">{v}</span>,
        },
        {
            title: t('common.status') || 'Status',
            dataIndex: 'scheduleStatus',
            key: 'scheduleStatus',
            width: 160,
            render: (status) => {
                // Try to find translation in AttendanceStatus first, then TimeslotStatus, then fallback to raw
                const translated = t(`common.attendanceStatus.${status}`, {
                    defaultValue: t(`common.timeslotStatus.${status}`, { defaultValue: status })
                });
                
                return (
                    <Tag color={getStatusColor(status)} className="px-3 py-1 rounded-full text-xs font-semibold border-0">
                        {translated}
                    </Tag>
                );
            },
        },
    ];

    if (loading) {
        return (
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-amber-500" />
                    {t('attendance.attendance')}
                </h3>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ y: 400 }}
                    locale={{ emptyText: t('attendance.noSlots') || 'No slots found' }}
                    className="modern-table"
                />
            </div>
        </div>
    );
}