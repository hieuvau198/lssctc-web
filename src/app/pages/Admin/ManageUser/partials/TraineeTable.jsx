import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, Tag, Pagination, Empty, Avatar } from 'antd';
import { getTrainees } from '../../../../apis/Admin/AdminUser';

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
  const { refreshTrigger } = useOutletContext() || {};
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const fetchData = useCallback(async (p = 1, ps = 8) => {
    setLoading(true);
    try {
      const res = await getTrainees({ page: p, pageSize: ps });
      const items = Array.isArray(res.items) ? res.items : [];
      // Map api items to table rows
      const rows = items.map((it, idx) => ({
        key: it.id,
        idx: (p - 1) * ps + idx + 1,
        fullName: it.fullName || it.fullname || it.username || '',
        email: it.email || '',
        phoneNumber: it.phoneNumber || it.phone || it.phone_number || '-',
        avatar: it.avatarUrl || it.avatar || it.avatar_url || '',
        courses: it.courses || '-',
        status: it.isActive ? 'active' : 'inactive',
      }));
      setData(rows);
      setTotal(Number(res.total) || rows.length);
    } catch (err) {
      console.error('Failed to load trainees:', err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [fetchData, page, pageSize, refreshTrigger]);

  return (
    <div>
      <div className="min-h-[430px] overflow-auto">
        {data.length === 0 && !loading ? (
          <Empty description={t('admin.users.noTrainees')} />
        ) : (
          <Table
            columns={COLUMNS}
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loading}
            scroll={{ y: 380 }}
          />
        )}
      </div>
      <div className="py-3 border-t border-t-slate-300 bg-white flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(p, s) => { setPage(p); setPageSize(s); setSearchParams({ page: p.toString(), pageSize: s.toString() }); }}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => t('admin.users.pagination', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
  );
}
