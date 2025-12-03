import { PlayCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table, Pagination, Tooltip, Modal, message, App } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { deleteMaterial } from '../../../../apis/Instructor/InstructorMaterialsApi';
import DrawerView from './DrawerView';

export default function VideoMaterials({ materials = [], viewMode = 'table', onDelete }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { modal } = App.useApp();

  const handleDelete = async (material) => {
    modal.confirm({
      title: 'Delete Material',
      content: `Are you sure you want to delete "${material.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setDeleting(true);
          await deleteMaterial(material.id);
          message.success('Material deleted successfully');
          onDelete?.();
        } catch (e) {
          console.error('Delete material error', e);
          message.error(e?.message || 'Failed to delete material');
        } finally {
          setDeleting(false);
        }
      },
    });
  };

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
      align: 'center',
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
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
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Open video">
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => { setSelectedMaterial(record); setDrawerVisible(true); }} />
          </Tooltip>
          <Tooltip title="Edit material">
            <Button type="default" icon={<EditOutlined />} onClick={() => navigate(`/instructor/materials/edit/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Delete material">
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} loading={deleting} />
          </Tooltip>
        </div>
      ),
    },
  ];

  // Card view
  if (viewMode === 'card') {
    return (
      <Card title={`Videos`} className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <Card key={m.id} size="small" bodyStyle={{ height: 160, overflow: 'auto' }}>
              <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="text-sm font-semibold line-clamp-1">{m.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Video</div>
                    <div className="text-sm text-gray-700 mt-2 truncate">{m.description}</div>
                  </div>
                  <div className="flex-shrink-0 ml-2 flex gap-1">
                    <Tooltip title="Open video">
                      <Button type="primary" shape="circle" icon={<PlayCircleOutlined />} onClick={() => { setSelectedMaterial(m); setDrawerVisible(true); }} />
                    </Tooltip>
                    <Tooltip title="Edit material">
                      <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/instructor/materials/edit/${m.id}`)} />
                    </Tooltip>
                    <Tooltip title="Delete material">
                      <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(m)} loading={deleting} />
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
      <DrawerView visible={drawerVisible} onClose={() => setDrawerVisible(false)} material={selectedMaterial} />
    </Card>
  );
}

VideoMaterials.propTypes = {
  materials: PropTypes.array,
  viewMode: PropTypes.oneOf(['table', 'card']),
  onDelete: PropTypes.func,
};
