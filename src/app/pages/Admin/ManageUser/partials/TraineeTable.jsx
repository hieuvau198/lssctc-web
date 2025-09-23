import React from 'react';
import { Table, Tag } from 'antd';

const COLUMNS = [
  { title: '#', dataIndex: 'idx', width: 60 },
  { title: 'Full name', dataIndex: 'fullName' },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Courses', dataIndex: 'courses', width: 100 },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (s) => (
      <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>
    ),
    width: 120,
  },
];

const MOCK_DATA = Array.from({ length: 12 }).map((_, i) => ({
  key: i + 1,
  idx: i + 1,
  fullName: `Learner ${i + 1}`,
  email: `learner${i + 1}@academy.test`,
  courses: Math.floor(Math.random() * 5),
  status: i % 4 === 0 ? 'inactive' : 'active',
}));

export default function TraineeTable() {
  const columns = COLUMNS;
  const data = MOCK_DATA;

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 8 }}
      rowKey="key"
    />
  );
}
