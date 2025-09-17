import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';

export default function SimulatorManagerTable() {
  const columns = useMemo(() => ([
    { title: '#', dataIndex: 'idx', width: 60 },
    { title: 'Full name', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Scenarios', dataIndex: 'scenarios', width: 110 },
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
    Array.from({ length: 6 }).map((_, i) => ({
      key: i + 1,
      idx: i + 1,
      fullName: `Sim Manager ${i + 1}`,
      email: `sim${i + 1}@academy.test`,
      scenarios: Math.floor(Math.random() * 10),
      status: i % 5 === 0 ? 'inactive' : 'active',
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
