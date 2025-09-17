import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';

export default function InstructorTable() {
  const columns = useMemo(() => ([
    { title: '#', dataIndex: 'idx', width: 60 },
    { title: 'Full name', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s) => (
        <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>
      ),
      width: 120,
    },
  ]), []);

  const data = useMemo(() => (
    Array.from({ length: 8 }).map((_, i) => ({
      key: i + 1,
      idx: i + 1,
      fullName: `Instructor ${i + 1}`,
      email: `inst${i + 1}@academy.test`,
      status: i % 3 === 0 ? 'inactive' : 'active',
    }))
  ), []);

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
      rowKey="key"
    />
  );
}
