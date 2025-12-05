import React, { useState } from 'react';
import { Card, Table, Tag, Button, Empty, Tooltip } from 'antd';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function ClassScheduleSlots({ classId, className, slots = [], onTakeAttendance }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
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
      title: t('attendance.students'),
      key: 'students',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Users className="w-4 h-4 text-slate-500" />
          <span>{record.totalStudents}</span>
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {t(`attendance.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('attendance.attendanceStatus'),
      key: 'attendance',
      width: 130,
      align: 'center',
      render: (_, record) => {
        if (record.status === 'completed') {
          return record.attendanceSubmitted ? (
            <Tooltip title={`${t('attendance.present')}: ${record.presentCount}, ${t('attendance.absent')}: ${record.absentCount}`}>
              <Tag icon={<CheckCircle className="w-3 h-3" />} color="success">
                {t('attendance.submitted')}
              </Tag>
            </Tooltip>
          ) : (
            <Tag icon={<XCircle className="w-3 h-3" />} color="warning">
              {t('attendance.pending')}
            </Tag>
          );
        }
        return <span className="text-slate-400 text-xs">{t('common.na')}</span>;
      },
    },
    {
      title: t('common.action'),
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const isPast = new Date(record.date) < new Date();
        const canTakeAttendance = isPast && !record.attendanceSubmitted;

        return (
          <div className="flex gap-2">
            {canTakeAttendance && (
              <Button
                type="primary"
                size="small"
                onClick={() => handleTakeAttendance(record)}
              >
                {t('attendance.takeAttendance')}
              </Button>
            )}
            {record.attendanceSubmitted && (
              <Button
                type="link"
                size="small"
                onClick={() => handleViewAttendance(record)}
              >
                {t('common.view')}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleTakeAttendance = (slot) => {
    if (onTakeAttendance) {
      onTakeAttendance(slot);
    }
  };

  const handleViewAttendance = (slot) => {
    console.log('View attendance for slot:', slot);
  };

  return (
    <Card
      title={
        <div>
          <h3 className="text-lg font-semibold">{t('attendance.classSchedule')}</h3>
          <p className="text-sm text-slate-500 font-normal mt-1">{className}</p>
        </div>
      }
      className="shadow-sm"
    >
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
        scroll={{ x: 1000 }}
      />
    </Card>
  );
}
