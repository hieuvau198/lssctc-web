import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const PracticeTable = ({
  data = [],
  loading = false,
  deleting = null,
  onView = () => {},
  onDelete = () => {},
  pagination = {},
}) => {
  const { t } = useTranslation();
  
  const getDifficultyColor = (level) => {
    const map = { Entry: 'green', Intermediate: 'orange', Advanced: 'red' };
    return map[level] || 'default';
  };

  const tableColumns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      fixed: 'left',
      align: 'center',
      render: (_, __, index) => (
        <span className="font-medium text-gray-600">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('simManager.practices.practiceCode'),
      dataIndex: 'practiceCode',
      key: 'practiceCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: t('simManager.practices.practiceName'),
      dataIndex: 'practiceName',
      key: 'practiceName',
      width: 280,
      render: (name, record) => (
        <div
          className="font-medium text-blue-600 cursor-pointer hover:underline line-clamp-1"
          onClick={() => onView(record)}
        >
          <Tooltip title={name}>{name}</Tooltip>
        </div>
      ),
    },
    {
      title: t('simManager.practices.duration'),
      dataIndex: 'estimatedDurationMinutes',
      key: 'estimatedDurationMinutes',
      width: 130,
      align: 'center',
      render: (v) => <span>{v}</span>,
    },
    {
      title: t('simManager.practices.difficulty'),
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 140,
      align: 'center',
      render: (level) => <Tag color={getDifficultyColor(level)}>{level || t('common.na')}</Tag>,
    },
    {
      title: t('simManager.practices.maxAttempts'),
      dataIndex: 'maxAttempts',
      key: 'maxAttempts',
      width: 120,
      align: 'center',
      render: (v) => <span>{v}</span>,
    },
    {
      title: t('common.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('common.view')}>
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Button 
              type="text" 
              size="small" 
              danger
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(record)}
              loading={deleting === record.id}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-hidden min-h-[500px]">
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          scroll={{ y: 450 }}
          size="middle"
          loading={loading}
        />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => `${range[0]}-${range[1]} ${t('simManager.practices.ofPractices', { total })}`}
        />
      </div>
    </div>
  );
};

export default PracticeTable;
