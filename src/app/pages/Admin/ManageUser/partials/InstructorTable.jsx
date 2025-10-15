import React, { useState } from 'react';
import { Table, Tag, Pagination } from 'antd';

const COLUMNS = [
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
];

const MOCK_DATA = Array.from({ length: 8 }).map((_, i) => ({
  key: i + 1,
  idx: i + 1,
  fullName: `Instructor ${i + 1}`,
  email: `inst${i + 1}@academy.test`,
  status: i % 3 === 0 ? 'inactive' : 'active',
}));

export default function InstructorTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const columns = COLUMNS;
  const data = MOCK_DATA;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div style={{ height: 300 }} className="overflow-auto">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="key"
        />
      </div>
      <div className="p-4 border-t bg-white flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data.length}
          onChange={(p, s) => { setPage(p); setPageSize(s); }}
          showSizeChanger
          pageSizeOptions={["5", "10", "20"]}
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} instructors`}
        />
      </div>
    </div>
  );
}
