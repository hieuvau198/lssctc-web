import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const PracticeTable = ({
  data = [],
  loading = false,
  deleting = null,
  onView = () => {},
  onDelete = () => {},
  pagination = {},
}) => {
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
      title: 'Practice Code',
      dataIndex: 'practiceCode',
      key: 'practiceCode',
      width: 140,
      fixed: 'left',
    },
    {
      title: 'Name',
      dataIndex: 'practiceName',
      key: 'practiceName',
      width: 260,
      render: (name, record) => (
        <div
          className="font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => onView(record)}
        >
          {name}
        </div>
      ),
    },
    {
      title: 'Duration (min)',
      dataIndex: 'estimatedDurationMinutes',
      key: 'estimatedDurationMinutes',
      width: 130,
      align: 'center',
      render: (v) => <span>{v}</span>,
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 140,
      align: 'center',
      render: (level) => <Tag color={getDifficultyColor(level)}>{level || 'N/A'}</Tag>,
    },
    {
      title: 'Max Attempts',
      dataIndex: 'maxAttempts',
      key: 'maxAttempts',
      width: 120,
      align: 'center',
      render: (v) => <span>{v}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)} />
          </Tooltip>
          <Tooltip title="Delete">
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
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} practices`}
        />
      </div>
    </div>
  );
};

export default PracticeTable;
