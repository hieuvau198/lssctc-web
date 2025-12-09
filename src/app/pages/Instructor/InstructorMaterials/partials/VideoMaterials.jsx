import { PlayCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table, Pagination, Tooltip, Modal, message, App } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { deleteMaterial } from '../../../../apis/Instructor/InstructorMaterialsApi';
import DrawerView from './DrawerView';

export default function VideoMaterials({ materials = [], viewMode = 'table', onDelete, onEdit }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { modal } = App.useApp();

  const handleDelete = async (material) => {
    modal.confirm({
      title: t('instructor.materials.modal.deleteTitle'),
      content: t('instructor.materials.modal.deleteContent', { name: material.name }),
      okText: t('instructor.materials.modal.delete'),
      okType: 'danger',
      cancelText: t('instructor.materials.modal.cancel'),
      onOk: async () => {
        try {
          setDeleting(true);
          await deleteMaterial(material.id);
          message.success(t('instructor.materials.messages.deleteSuccess'));
          onDelete?.();
        } catch (e) {
          console.error('Delete material error', e);
          message.error(e?.message || t('instructor.materials.messages.deleteFailed'));
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="mb-4">
        <Empty description={t('instructor.materials.noVideos')} />
      </div>
    );
  }

  const columns = [
    {
      title: t('instructor.materials.table.index'),
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: t('instructor.materials.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: t('instructor.materials.table.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 400,
    },
    {
      title: t('instructor.materials.table.action'),
      key: 'action',
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title={t('instructor.materials.tooltip.openVideo')}>
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => { setSelectedMaterial(record); setDrawerVisible(true); }} />
          </Tooltip>
          <Tooltip title={t('instructor.materials.tooltip.editMaterial')}>
            <Button type="default" icon={<EditOutlined />} onClick={() => { if (typeof onEdit === 'function') return onEdit(record); return navigate(`/instructor/materials/edit/${record.id}`); }} />
          </Tooltip>
          <Tooltip title={t('instructor.materials.tooltip.deleteMaterial')}>
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} loading={deleting} />
          </Tooltip>
        </div>
      ),
    },
  ];

  // Card view
  if (viewMode === 'card') {
    return (
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <Card key={m.id} size="small" bodyStyle={{ height: 160, overflow: 'auto' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <div className="text-sm font-semibold line-clamp-1">{m.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{t('instructor.materials.video')}</div>
                  <div className="text-sm text-gray-700 mt-2 truncate">{m.description}</div>
                </div>
                <div className="flex-shrink-0 ml-2 flex gap-1">
                  <Tooltip title={t('instructor.materials.tooltip.openVideo')}>
                    <Button type="primary" shape="circle" icon={<PlayCircleOutlined />} onClick={() => { setSelectedMaterial(m); setDrawerVisible(true); }} />
                  </Tooltip>
                  <Tooltip title={t('instructor.materials.tooltip.editMaterial')}>
                    <Button shape="circle" icon={<EditOutlined />} onClick={() => { if (typeof onEdit === 'function') return onEdit(m); return navigate(`/instructor/materials/edit/${m.id}`); }} />
                  </Tooltip>
                  <Tooltip title={t('instructor.materials.tooltip.deleteMaterial')}>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(m)} loading={deleting} />
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <DrawerView visible={drawerVisible} onClose={() => setDrawerVisible(false)} material={selectedMaterial} />
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="overflow-auto min-h-[350px]">
        <Table
          columns={columns}
          dataSource={materials}
          rowKey="id"
          pagination={false}
          scroll={{ y: 350}}
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
          showTotal={(total, range) => t('instructor.materials.table.paginationVideos', { start: range[0], end: range[1], total })}
        />
      </div>
      <DrawerView visible={drawerVisible} onClose={() => setDrawerVisible(false)} material={selectedMaterial} />
    </div>
  );
}

VideoMaterials.propTypes = {
  materials: PropTypes.array,
  viewMode: PropTypes.oneOf(['table', 'card']),
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
