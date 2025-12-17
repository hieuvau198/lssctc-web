import React from 'react';
import { Table, Pagination, Tooltip, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const BrandModelTable = ({
  data = [],
  loading = false,
  deleting = null,
  onView = () => { },
  onEdit = () => { },
  onDelete = () => { },
  pagination = {},
}) => {
  const { t } = useTranslation();

  const tableColumns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      fixed: 'left',
      align: 'center',
      render: (_, __, index) => (
        <span className="font-bold text-neutral-900">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('simManager.brandModel.columns.name'),
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name, record) => (
        <div
          className="font-bold text-yellow-600 uppercase cursor-pointer hover:text-neutral-900 transition-colors"
          onClick={() => onView(record)}
        >
          {name}
        </div>
      ),
    },
    {
      title: t('simManager.brandModel.columns.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc) => <span className="text-neutral-600">{desc || 'N/A'}</span>,
    },
    {
      title: t('simManager.brandModel.columns.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive) => (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isActive
            ? 'bg-yellow-400 text-black'
            : 'bg-neutral-200 text-neutral-600'
          }`}>
          {isActive ? t('simManager.brandModel.status.active') : t('simManager.brandModel.status.inactive')}
        </span>
      ),
    },
    {
      title: t('simManager.brandModel.columns.actions'),
      key: 'actions',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('simManager.brandModel.viewDetails')}>
            <div
              onClick={() => onView(record)}
              className="w-8 h-8 border-2 border-neutral-300 hover:border-yellow-500 hover:bg-yellow-500 flex items-center justify-center transition-all"
            >
              <EyeOutlined />
            </div>
          </Tooltip>
          <Tooltip title={t('simManager.brandModel.edit')}>
            <div
              onClick={() => onEdit(record)}
              className="w-8 h-8 border-2 border-neutral-300 hover:border-black hover:bg-black hover:text-yellow-500 flex items-center justify-center transition-all"
            >
              <EditOutlined />
            </div>
          </Tooltip>
          <Tooltip title={t('simManager.brandModel.delete')}>
            <div
              onClick={() => onDelete(record)}
              disabled={deleting === record.id}
              className="w-8 h-8 border-2 border-neutral-300 hover:border-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-50"
            >
              <DeleteOutlined />
            </div>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="border-2 border-neutral-900 bg-white overflow-hidden">
      {/* Table Header Bar */}
      <div className="h-2 bg-yellow-400" />

      <div className="overflow-hidden min-h-[450px]">
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          scroll={{ y: 400 }}
          size="middle"
          loading={loading}
          className="[&_.ant-table-thead>tr>th]:bg-neutral-100 [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-thead>tr>th]:font-bold [&_.ant-table-thead>tr>th]:text-neutral-700 [&_.ant-table-thead>tr>th]:border-b-2 [&_.ant-table-thead>tr>th]:border-neutral-900"
        />
      </div>

      <div className="p-4 border-t-2 border-neutral-900 bg-neutral-50 flex justify-center">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => t('simManager.brandModel.pagination', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
  );
};

export default BrandModelTable;
