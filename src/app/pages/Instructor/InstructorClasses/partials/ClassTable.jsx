import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const ClassTable = ({
  classes = [],
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange = () => {},
  onView = () => {},
}) => {
  const getStatusColor = (status) => {
    const map = {
      'NotStarted': 'default',
      'InProgress': 'blue',
      'Completed': 'green',
      'Cancelled': 'red',
    };
    return map[status] || 'default';
  };

  const tableColumns = [
    {
      title: '#',
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (pageNumber - 1) * pageSize + idx + 1,
      fixed: 'left',
    },
    {
      title: 'Class Code',
      dataIndex: 'classCode',
      key: 'classCode',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name, record) => (
        <div
          className="font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => onView(record)}
        >
          {name || record.className || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Trainees',
      dataIndex: 'traineeCount',
      key: 'traineeCount',
      width: 100,
      align: 'center',
      render: (count) => <span>{count ?? 0}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status || 'N/A'}
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
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-hidden min-h-[500px]">
        <Table
          columns={tableColumns}
          dataSource={classes}
          rowKey={(r) => r.id || r.classId}
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
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} classes`}
        />
      </div>
    </div>
  );
};

export default ClassTable;
