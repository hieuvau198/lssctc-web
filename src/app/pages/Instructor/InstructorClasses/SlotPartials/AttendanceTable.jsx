import { Empty, Input, Radio, Table } from 'antd';
import { User, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AttendanceTable({ data, onStatusChange, onNoteChange }) {
  const { t } = useTranslation();

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
      width: 250,
      align: 'center',
      render: (status, record) => (
        <Radio.Group
          value={status}
          onChange={(e) => onStatusChange(record.traineeId, e.target.value)}
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
      width: 180,
      render: (note, record) => (
        <Input
          placeholder={t('attendance.notePlaceholder', 'Nhập ghi chú (nếu có)...')}
          value={note}
          onChange={(e) => onNoteChange(record.traineeId, e.target.value)}
          allowClear
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="traineeId"
      pagination={false}
      locale={{
        emptyText: (
          <Empty description={t('attendance.noStudents', 'Chưa có học viên nào trong lớp')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ),
      }}
    />
  );
}
