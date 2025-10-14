import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table, Pagination } from 'antd';
import { useState } from 'react';

export default function VideoMaterials({ materials = [] }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (!materials || materials.length === 0) {
    return (
      <Card title="Videos">
        <Empty description="No videos found." />
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
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 400,
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <div>
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            href={record.url}
            target="_blank"
            rel="noreferrer"
          >
            Open
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card title={`Videos`} className="mb-4">
      <div style={{ height: 370 }} className="overflow-auto">
        <Table
          columns={columns}
          dataSource={materials}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </div>
      <div className="pt-4 border-t border-gray-200 flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={materials.length}
          showSizeChanger
          pageSizeOptions={['5', '10', '20']}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} videos`}
        />
      </div>
    </Card>
  );
}
