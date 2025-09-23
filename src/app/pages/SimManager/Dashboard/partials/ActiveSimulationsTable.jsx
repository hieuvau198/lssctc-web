// src/app/pages/SimManager/Dashboard/partials/ActiveSimulationsTable.jsx
import React from 'react';
import { Card, Table, Tag } from 'antd';

export default function ActiveSimulationsTable({ rows = [], loading = false }) {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Learners', dataIndex: 'learners', key: 'learners', width: 110 },
    { title: 'Instructor', dataIndex: 'instructor', key: 'instructor', width: 160 },
    { title: 'Started At', dataIndex: 'startedAt', key: 'startedAt', width: 180 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (v) => (
      <Tag color={v === 'running' ? 'blue' : v === 'idle' ? 'default' : 'warning'}>{v}</Tag>
    ) },
  ];

  return (
    <Card className="border-slate-200 hover:shadow-md transition" title="Active Simulations">
      <Table
        rowKey={(r) => r.id}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
