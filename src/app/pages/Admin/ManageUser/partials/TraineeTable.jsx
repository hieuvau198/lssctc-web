import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Pagination, Empty, Avatar, Button } from 'antd';
import { getTrainees } from '../../../../apis/Admin/AdminUser';
import { Plus } from 'lucide-react';
import DrawerAdd from './DrawerAdd';

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
};

const COLUMNS = [
  { title: '#', dataIndex: 'idx', width: 60 },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    width: 80,
    render: (src, record) => (
      <Avatar src={src} alt={record.fullName} style={{ backgroundColor: '#f3f4f6' }}>
        {!src && getInitials(record.fullName)}
      </Avatar>
    ),
  },
  { title: 'Full name', dataIndex: 'fullName' },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Phone', dataIndex: 'phoneNumber', width: 160 },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (s) => (
      <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>
    ),
    width: 120,
  },
];

export default function TraineeTable() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
  }, [fetchData, page, pageSize]);

  return (
    <div>
      <div className="min-h-[410px] overflow-auto">
        <div className="flex justify-end mb-4">
          <Button type="primary" icon={<Plus size={24}/>} onClick={() => setDrawerVisible(true)}>Add Trainee</Button>
        </div>
        {data.length === 0 && !loading ? (
          <Empty description="No trainees" />
        ) : (
          <Table
            columns={COLUMNS}
            dataSource={data}
            pagination={false}
            rowKey="key"
            loading={loading}
            scroll={{ y: 320 }}
          />
        )}
      </div>
      <div className="p-4 bg-white flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(p, s) => { setPage(p); setPageSize(s); }}
          showSizeChanger
          pageSizeOptions={["5", "8", "10", "20"]}
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} trainees`}
        />
      </div>

      <DrawerAdd
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        role="trainee"
        onCreated={() => fetchData(page, pageSize)}
      />
    </div>
  );
}
