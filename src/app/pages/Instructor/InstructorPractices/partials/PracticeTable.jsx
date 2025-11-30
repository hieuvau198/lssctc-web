import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const PracticeTable = ({
  practices = [],
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange = () => {},
  onView = () => {},
}) => {
  const tableColumns = [
    {
      title: 'Practice Code',
      dataIndex: 'practiceCode',
      key: 'practiceCode',
      width: 140,
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
      render: (level) => <Tag color={level === 'Entry' ? 'green' : level === 'Intermediate' ? 'orange' : 'red'}>{level || 'N/A'}</Tag>,
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
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-hidden">
        <Table
          columns={tableColumns}
          dataSource={practices}
          rowKey="id"
          pagination={false}
          scroll={{ y: 450 }}
          size="middle"
        />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} practices`}
        />
      </div>
    </div>
  );
};

export default PracticeTable;
