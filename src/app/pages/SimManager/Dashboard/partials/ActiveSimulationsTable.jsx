// src/app/pages/SimManager/Dashboard/partials/ActiveSimulationsTable.jsx
import React from 'react';
import { Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

export default function ActiveSimulationsTable({ rows = [], loading = false }) {
  const { t } = useTranslation();
  const columns = [
    { title: t('simManager.activeSimulations.name'), dataIndex: 'name', key: 'name' },
    { title: t('simManager.activeSimulations.learners'), dataIndex: 'learners', key: 'learners', width: 110 },
    { title: t('simManager.activeSimulations.instructor'), dataIndex: 'instructor', key: 'instructor', width: 160 },
    { title: t('simManager.activeSimulations.startedAt'), dataIndex: 'startedAt', key: 'startedAt', width: 180 },
    { title: t('common.status'), dataIndex: 'status', key: 'status', width: 120, render: (v) => (
      <Tag color={v === 'running' ? 'blue' : v === 'idle' ? 'default' : 'warning'}>{v}</Tag>
    ) },
  ];

  return (
    <Card className="border-slate-200 hover:shadow-md transition" title={t('simManager.activeSimulations.title')}>
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
