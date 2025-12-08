import { Avatar, Empty, Pagination, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useSearchParams } from 'react-router-dom';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
};

export default function TraineeTable() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    traineeData,
    loadingTrainees,
    page,
    pageSize,
    setPage,
    setPageSize
  } = useOutletContext() || {};

  const [data, setData] = useState([]);

  const COLUMNS = [
    { title: '#', dataIndex: 'idx', width: 60, align: 'center' },
    {
      title: t('admin.users.table.avatar'),
      dataIndex: 'avatar',
      width: 80,
      render: (src, record) => (
        <Avatar src={src} alt={record.fullName} style={{ backgroundColor: '#f3f4f6' }}>
          {!src && getInitials(record.fullName)}
        </Avatar>
      ),
    },
    { title: t('admin.users.table.fullName'), dataIndex: 'fullName' },
    { title: t('admin.users.table.email'), dataIndex: 'email' },
    { title: t('admin.users.table.phone'), dataIndex: 'phoneNumber', width: 160 },
    {
      title: t('admin.users.table.status'),
      dataIndex: 'status',
      render: (s) => (
        <Tag color={s === 'active' ? 'green' : 'red'}>{s === 'active' ? t('common.active') : t('common.inactive')}</Tag>
      ),
      width: 120,
    },
  ];

  useEffect(() => {
    if (traineeData?.items) {
      const items = Array.isArray(traineeData.items) ? traineeData.items : [];
      const rows = items.map((it, idx) => ({
        key: it.id,
        idx: (page - 1) * pageSize + idx + 1,
        fullName: it.fullName || it.fullname || it.username || '',
        email: it.email || '',
        phoneNumber: it.phoneNumber || it.phone || it.phone_number || '-',
        avatar: it.avatarUrl || it.avatar || it.avatar_url || '',
        courses: it.courses || '-',
        status: it.isActive ? 'active' : 'inactive',
      }));
      setData(rows);
    }
  }, [traineeData, page, pageSize]);

  return (
    <div>
      <div className="min-h-[380px] overflow-auto">
        {(!data.length && !loadingTrainees) ? (
          <Empty description={t('admin.users.noTrainees')} />
        ) : (
          <Table
            columns={COLUMNS}
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loadingTrainees}
            scroll={{ y: 350 }}
          />
        )}
      </div>
      <div className="py-3 border-t border-t-slate-300 bg-white flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={traineeData?.totalCount || 0}
          onChange={(p, s) => {
            setPage(p);
            setPageSize(s);
          }}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => t('admin.users.pagination', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
  );
}
