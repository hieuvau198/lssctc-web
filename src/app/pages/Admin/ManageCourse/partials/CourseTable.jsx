import React from 'react';
import { Table, Tag, Button, Space } from 'antd';

const COLUMNS = [
  { title: '#', dataIndex: 'idx', width: 60, fixed: 'left' },
  { title: 'Title', dataIndex: 'title' },
  { title: 'Category', dataIndex: 'category', width: 140 },
  { title: 'Level', dataIndex: 'level', width: 120 },
  { title: 'Duration', dataIndex: 'duration', width: 110 },
  { title: 'Enrolled', dataIndex: 'enrolled', width: 110 },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 120,
    render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: () => (
      <Space>
        <Button size="small">Edit</Button>
        <Button size="small" danger>Delete</Button>
      </Space>
    ),
  },
];

const MOCK_DATA = Array.from({ length: 18 }).map((_, i) => ({
  key: i + 1,
  idx: i + 1,
  title: `Course ${i + 1}`,
  category: ['Safety', 'Operations', 'Logistics'][i % 3],
  level: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
  duration: `${6 + (i % 5) * 2}h`,
  enrolled: Math.floor(Math.random() * 200),
  status: i % 4 === 0 ? 'inactive' : 'active',
}));

export default function CourseTable() {
  const columns = COLUMNS;
  const data = MOCK_DATA;

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      rowKey="key"
      scroll={{ x: 900 }}
    />
  );
}
