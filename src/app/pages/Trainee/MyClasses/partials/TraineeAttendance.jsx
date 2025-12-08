import { Skeleton, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
                // res is expected to be an array of timeslot attendance records
                const mapped = (res || []).map(item => {
                    const start = item.startTime ? new Date(item.startTime) : null;
                    const end = item.endTime ? new Date(item.endTime) : null;
                    const dateOnly = start ? start.toLocaleDateString() : '';
                    const startTime = start ? start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    const endTime = end ? end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    return {
                        key: item.timeslotId ?? `${item.timeslotId}_${item.startTime}`,
                        slotId: item.timeslotId,
                        slotName: item.timeslotName || `Slot ${item.timeslotId}`,
                        timeRange: startTime || endTime ? `${startTime}${endTime ? ' - ' + endTime : ''}` : '',
                        date: dateOnly,
                        room: item.location || '-',
                        attendanceRecorded: String(item.attendanceStatus || '').toLowerCase() === 'present',
                        scheduleStatus: item.attendanceStatus || '',
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

    const columns = [
        {
            title: t('attendance.slot') || 'Slot',
            dataIndex: 'slotName',
            key: 'slotName',
            width: 180,
            render: (v, r) => (
                <div>
                    <div className="font-medium">{v}</div>
                    <div className="text-xs text-slate-500">{r.timeRange}</div>
                </div>
            ),
        },
        {
            title: t('attendance.date') || 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 140,
        },
        {
            title: t('attendance.location') || 'Room',
            dataIndex: 'room',
            key: 'room',
            width: 160,
        },
        {
            title: t('common.status') || 'Status',
            dataIndex: 'scheduleStatus',
            key: 'scheduleStatus',
            width: 160,
            render: (status, record) => (
                <div>
                    <Tag color={record.attendanceRecorded ? 'green-inverse' : 'red-inverse'}>
                        {status}
                    </Tag>
                </div>
            ),
        },
    ];
    if (loading) {
        return (
            <div>
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ y: 400 }}
            locale={{ emptyText: t('attendance.noSlots') || 'No slots found' }}
        />
    );
}
