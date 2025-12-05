import React, { useState } from 'react';
import { Modal, Table, Radio, Input, Button, Tag, Space, message, App } from 'antd';
import { CheckCircle, XCircle, Clock, User, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

export default function AttendanceModal({ open, onClose, slotData, attendanceList = [] }) {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [attendanceData, setAttendanceData] = useState(
    attendanceList.map(item => ({ ...item }))
  );
  const [searchText, setSearchText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStatusChange = (traineeId, status) => {
    setAttendanceData(prev =>
      prev.map(item =>
        item.traineeId === traineeId ? { ...item, status } : item
      )
    );
  };

  const handleNoteChange = (traineeId, note) => {
    setAttendanceData(prev =>
      prev.map(item =>
        item.traineeId === traineeId ? { ...item, note } : item
      )
    );
  };

  const handleMarkAll = (status) => {
    setAttendanceData(prev =>
      prev.map(item => ({ ...item, status }))
    );
    messageApi.success(t('attendance.markedAll', { status: t(`attendance.${status}`) }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const summary = {
        present: attendanceData.filter(a => a.status === 'present').length,
        absent: attendanceData.filter(a => a.status === 'absent').length,
        late: attendanceData.filter(a => a.status === 'late').length,
        excused: attendanceData.filter(a => a.status === 'excused').length,
      };

      console.log('Submit attendance:', {
        slotId: slotData?.id,
        attendance: attendanceData,
        summary,
      });

      messageApi.success(t('attendance.submitSuccess'));
      onClose();
    } catch (error) {
      messageApi.error(t('attendance.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusTag = (status) => {
    const configs = {
      present: { color: 'success', icon: <CheckCircle className="w-3 h-3" /> },
      absent: { color: 'error', icon: <XCircle className="w-3 h-3" /> },
      late: { color: 'warning', icon: <Clock className="w-3 h-3" /> },
      excused: { color: 'default', icon: null },
    };

    const config = configs[status] || configs.present;
    return (
      <Tag icon={config.icon} color={config.color}>
        {t(`attendance.${status}`)}
      </Tag>
    );
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: t('common.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.fullName.toLowerCase().includes(value.toLowerCase()) ||
        record.email.toLowerCase().includes(value.toLowerCase()) ||
        record.traineeId.toLowerCase().includes(value.toLowerCase()),
      render: (name, record) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-slate-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 300,
      render: (status, record) => (
        <Radio.Group
          value={status}
          onChange={(e) => handleStatusChange(record.traineeId, e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="present">
            <CheckCircle className="w-3 h-3 inline mr-1" />
            {t('attendance.present')}
          </Radio.Button>
          <Radio.Button value="absent">
            <XCircle className="w-3 h-3 inline mr-1" />
            {t('attendance.absent')}
          </Radio.Button>
          <Radio.Button value="late">
            <Clock className="w-3 h-3 inline mr-1" />
            {t('attendance.late')}
          </Radio.Button>
          <Radio.Button value="excused">
            {t('attendance.excused')}
          </Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: t('attendance.note'),
      dataIndex: 'note',
      key: 'note',
      width: 250,
      render: (note, record) => (
        <Input
          placeholder={t('attendance.notePlaceholder')}
          value={note}
          onChange={(e) => handleNoteChange(record.traineeId, e.target.value)}
          size="small"
        />
      ),
    },
  ];

  const filteredData = attendanceData;

  const summary = {
    present: attendanceData.filter(a => a.status === 'present').length,
    absent: attendanceData.filter(a => a.status === 'absent').length,
    late: attendanceData.filter(a => a.status === 'late').length,
    excused: attendanceData.filter(a => a.status === 'excused').length,
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div>
          <h3 className="text-lg font-semibold">{t('attendance.takeAttendance')}</h3>
          {slotData && (
            <div className="text-sm text-slate-500 font-normal mt-1">
              {slotData.className} - {slotData.date} ({slotData.startTime} - {slotData.endTime})
            </div>
          )}
        </div>
      }
      width={1000}
      footer={
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-sm">
            <span>{t('attendance.summary')}:</span>
            <span className="text-green-600 font-medium">{t('attendance.present')}: {summary.present}</span>
            <span className="text-red-600 font-medium">{t('attendance.absent')}: {summary.absent}</span>
            <span className="text-orange-600 font-medium">{t('attendance.late')}: {summary.late}</span>
            <span className="text-slate-600 font-medium">{t('attendance.excused')}: {summary.excused}</span>
          </div>
          <Space>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              {t('attendance.submitAttendance')}
            </Button>
          </Space>
        </div>
      }
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <Input
          placeholder={t('attendance.searchStudent')}
          prefix={<Search className="w-4 h-4 text-slate-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Space>
          <Button size="small" onClick={() => handleMarkAll('present')}>
            {t('attendance.markAllPresent')}
          </Button>
          <Button size="small" onClick={() => handleMarkAll('absent')}>
            {t('attendance.markAllAbsent')}
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="traineeId"
        pagination={false}
        scroll={{ y: 400 }}
        size="small"
      />
    </Modal>
  );
}
