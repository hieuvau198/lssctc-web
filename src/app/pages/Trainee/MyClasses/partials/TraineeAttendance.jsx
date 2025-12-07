import React, { useMemo } from 'react';
import { Table, Tag, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { mockInstructorSchedule, mockTimeSlots } from '../../../../mocks/instructorSchedule';

export default function TraineeAttendance({ classId: classIdProp }) {
    const { t } = useTranslation();
    const { classId: classIdParam } = useParams();
    const classId = classIdProp ?? classIdParam;

    const programs = useMemo(() => {
        if (!classId) return [];
        return mockInstructorSchedule.filter(item => String(item.classId) === String(classId) || item.classId === classId);
    }, [classId]);

    const timeMap = useMemo(() => {
        const m = {};
        mockTimeSlots.forEach(s => {
            m[s.id] = s;
        });
        return m;
    }, []);

    const dataSource = programs.map(item => ({
        key: item.id,
        slotId: item.slotId,
        slotName: timeMap[item.slotId]?.name ?? `Slot ${item.slotId}`,
        timeRange: timeMap[item.slotId] ? `${timeMap[item.slotId].startTime} - ${timeMap[item.slotId].endTime}` : '',
        date: item.date,
        room: item.room || item.location || '-',
        attendanceRecorded: item.status === 'Completed',
        scheduleStatus: item.status,
    }));

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
                    <Tag color={record.attendanceRecorded ? 'green' : 'default'}>
                        {record.attendanceRecorded ? (t('attendance.recorded') || 'Recorded') : (t('attendance.notRecorded') || 'Not recorded')}
                    </Tag>
                    <div className="text-xs text-slate-500 mt-1">{status}</div>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            locale={{ emptyText: t('attendance.noSlots') || 'No slots found' }}
        />
    );
}
