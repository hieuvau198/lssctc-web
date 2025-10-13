import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table } from 'antd';
import { useState } from 'react';

export default function DocMaterials({ materials = [] }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (!materials || materials.length === 0) {
    return (
      <Card title="Docs">
        <Empty description="No documents found." />
      </Card>
    );
  }

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true, width: 400 },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Button type="link" icon={<FilePdfOutlined />} href={record.url} target="_blank" rel="noreferrer">
          Open
        </Button>
      ),
    },
  ];

  return (
    <Card title={`Documents`} className="mb-4">
      <Table
        columns={columns}
        dataSource={materials}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total: materials.length,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        size="middle"
      />
    </Card>
  );
}
