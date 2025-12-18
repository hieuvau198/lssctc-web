import { FileText, Trash2, Pencil, ExternalLink } from 'lucide-react';
import { Tooltip, App, Empty, Table, Pagination } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { deleteMaterial } from '../../../../apis/Instructor/InstructorMaterialsApi';
import DrawerView from './DrawerView';

export default function DocMaterials({ materials = [], viewMode = 'table', onDelete, onEdit }) {
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
          onDelete?.();
        } catch (e) {
          console.error('Delete material error', e);
        } finally {
          setDeleting(false);
        }
      },
    });
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-neutral-400" />
        </div>
        <p className="text-neutral-500 font-bold uppercase tracking-wider text-sm">
          {t('instructor.materials.noDocuments')}
        </p>
      </div>
    );
  }

  // Paginated data
  const paginatedData = materials.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <span className="font-bold text-neutral-500">
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('instructor.materials.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text) => (
        <span className="font-bold text-black">{text}</span>
      )
    },
    {
      title: t('instructor.materials.table.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <span className="text-neutral-600">{text || '—'}</span>
      )
    },
    {
      title: t('instructor.materials.table.action'),
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title={t('instructor.materials.tooltip.openDocument')}>
            <button
              onClick={() => { setSelectedMaterial(record); setDrawerVisible(true); }}
              className="w-9 h-9 bg-yellow-400 border-2 border-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              <ExternalLink className="w-4 h-4 text-black" />
            </button>
          </Tooltip>
          <Tooltip title={t('instructor.materials.tooltip.editMaterial')}>
            <button
              onClick={() => {
                if (typeof onEdit === 'function') return onEdit(record);
                return navigate(`/instructor/materials/edit/${record.id}`);
              }}
              className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 hover:scale-105 transition-all"
            >
              <Pencil className="w-4 h-4 text-black" />
            </button>
          </Tooltip>
          <Tooltip title={t('instructor.materials.tooltip.deleteMaterial')}>
            <button
              onClick={() => handleDelete(record)}
              disabled={deleting}
              className="w-9 h-9 bg-red-500 border-2 border-red-600 flex items-center justify-center hover:bg-red-600 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="industrial-table">
      <style>{`
        .industrial-table .ant-table {
          border: 2px solid #000 !important;
        }
        .industrial-table .ant-table-thead > tr > th {
          background: #fef08a !important;
          border-bottom: 2px solid #000 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
          letter-spacing: 0.05em !important;
          color: #000 !important;
        }
        .industrial-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e5e5e5 !important;
        }
        .industrial-table .ant-table-tbody > tr:hover > td {
          background: #fef9c3 !important;
        }
        .industrial-table .ant-pagination-item-active {
          background: #facc15 !important;
          border-color: #000 !important;
        }
        .industrial-table .ant-pagination-item-active a {
          color: #000 !important;
          font-weight: 700 !important;
        }
      `}</style>

      <div className="overflow-auto">
        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          pagination={false}
          scroll={{ y: "calc(100vh - 450px)" }}
          size="middle"
        />
      </div>

      <div className="pt-4 border-t-2 border-neutral-200 flex justify-center mt-4">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={materials.length}
          showSizeChanger
          pageSizeOptions={['5', '10', '20']}
          onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
          showTotal={(total, range) => (
            <span className="text-sm font-medium text-neutral-600">
              {range[0]}-{range[1]} / {total} {t('instructor.materials.documents').toLowerCase()}
            </span>
          )}
        />
      </div>

      <DrawerView visible={drawerVisible} onClose={() => setDrawerVisible(false)} material={selectedMaterial} />
    </div>
  );
}

DocMaterials.propTypes = {
  materials: PropTypes.array,
  viewMode: PropTypes.oneOf(['table', 'card']),
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
