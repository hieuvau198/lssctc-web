import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table, Pagination, Tooltip } from 'antd';
import { useState } from 'react';
import PropTypes from 'prop-types';
import DrawerView from './DrawerView';

export default function DocMaterials({ materials = [], viewMode = 'table' }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

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
    { title: 'Name', dataIndex: 'name', key: 'name', width: 180, ellipsis: true },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true, width: 400 },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Tooltip title="Open document">
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => { setSelectedMaterial(record); setDrawerVisible(true); }}
          />
        </Tooltip>
      ),
    },
  ];

  if (viewMode === 'card') {
    return (
      <Card title={`Documents`} className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <Card key={m.id} size="small" bodyStyle={{ height: 160, overflow: 'auto' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <div className="text-sm font-semibold line-clamp-1">{m.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Document</div>
                  <div className="text-sm text-gray-700 mt-2 truncate">{m.description}</div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <Tooltip title="Open document">
                    <Button type="primary" shape="circle" icon={<FilePdfOutlined />} onClick={() => { setSelectedMaterial(m); setDrawerVisible(true); }} />
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <DrawerView visible={drawerVisible} onClose={() => setDrawerVisible(false)} material={selectedMaterial} />
      </Card>
    );
  }

  return (
    <Card title={`Documents`} className="mb-4">
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
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} documents`}
        />
      </div>
      <DrawerView visible={drawerVisible} onClose={() => setDrawerVisible(false)} material={selectedMaterial} />
    </Card>
  );
}

DocMaterials.propTypes = {
  materials: PropTypes.array,
  viewMode: PropTypes.oneOf(['table', 'card']),
};
