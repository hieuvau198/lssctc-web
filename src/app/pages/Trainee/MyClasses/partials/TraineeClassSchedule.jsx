import React from 'react';
import { Card, Table, Tag, Empty, Progress } from 'antd';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TraineeClassSchedule({ classId, className, slots = [], attendanceRecords = [] }) {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'excused':
        return 'default';
      default:
        return 'default';
    }
  };

  const getAttendanceForSlot = (slotId) => {
    return attendanceRecords.find(record => record.slotId === slotId);
  };

  const columns = [
    {
      title: t('attendance.slot'),
      dataIndex: 'slotNumber',
      key: 'slotNumber',
      width: 80,
      render: (num) => <span className="font-semibold">#{num}</span>,
    },
    {
      title: t('attendance.date'),
      dataIndex: 'date',
      key: 'date',
      width: 130,
      render: (date, record) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <div>
            <div className="font-medium">{date}</div>
            <div className="text-xs text-slate-500">{record.dayOfWeek}</div>
          </div>
        </div>
      ),
    },
    {
      title: t('attendance.time'),
      key: 'time',
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-sm">{record.startTime} - {record.endTime}</span>
        </div>
      ),
    },
    {
      title: t('attendance.topic'),
      dataIndex: 'topic',
      key: 'topic',
      ellipsis: true,
    },
    {
      title: t('attendance.location'),
      dataIndex: 'location',
      key: 'location',
      width: 120,
      render: (location) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4 text-slate-400" />
          {location}
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => {
        const attendance = getAttendanceForSlot(record.id);
        
        if (status === 'completed' && attendance) {
          return (
            <div>
              <Tag color={getStatusColor(attendance.status)}>
                {t(`attendance.${attendance.status}`)}
              </Tag>
              {attendance.note && (
                <div className="text-xs text-slate-500 mt-1">{attendance.note}</div>
              )}
            </div>
          );
        }
        
        if (status === 'scheduled') {
          return <Tag color="blue">{t('attendance.status.scheduled')}</Tag>;
        }
        
        if (status === 'completed') {
          return <Tag color="default">{t('attendance.noRecord')}</Tag>;
        }
        
        return <Tag>{t(`attendance.status.${status}`)}</Tag>;
      },
    },
  ];

  // Calculate attendance statistics
  const completedSlots = slots.filter(s => s.status === 'completed');
  const attendedSlots = completedSlots.filter(s => {
    const record = getAttendanceForSlot(s.id);
    return record && (record.status === 'present' || record.status === 'late');
  });
  const attendanceRate = completedSlots.length > 0 
    ? Math.round((attendedSlots.length / completedSlots.length) * 100) 
    : 0;

  return (
    <Card
      title={
        <div>
          <h3 className="text-lg font-semibold">{t('attendance.classSchedule')}</h3>
          <p className="text-sm text-slate-500 font-normal mt-1">{className}</p>
        </div>
      }
      extra={
        completedSlots.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">{t('attendance.attendanceRate')}</div>
              <div className="text-lg font-bold text-blue-600">{attendanceRate}%</div>
            </div>
            <Progress
              type="circle"
              percent={attendanceRate}
              width={50}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        )
      }
      className="shadow-sm"
    >
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500">{t('attendance.totalSlots')}</div>
          <div className="text-2xl font-bold text-slate-900">{slots.length}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs text-blue-600">{t('attendance.status.scheduled')}</div>
          <div className="text-2xl font-bold text-blue-600">
            {slots.filter(s => s.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-xs text-green-600">{t('attendance.present')}</div>
          <div className="text-2xl font-bold text-green-600">
            {attendanceRecords.filter(r => r.status === 'present').length}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-xs text-red-600">{t('attendance.absent')}</div>
          <div className="text-2xl font-bold text-red-600">
            {attendanceRecords.filter(r => r.status === 'absent').length}
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={slots}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => t('common.pagination.showTotal', { start: 1, end: total, total }),
        }}
        locale={{
          emptyText: (
            <Empty
              description={t('attendance.noSlots')}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
}
