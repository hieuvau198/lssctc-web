
import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space, Popconfirm } from 'antd';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TaskTable = ({
  data = [],
  loading = false,
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
        <span className="font-bold text-neutral-500">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('simManager.tasks.columns.taskCode'),
      dataIndex: 'taskCode',
      key: 'taskCode',
      width: 160,
      fixed: 'left',
      render: (code) => <div className="text-sm font-bold text-black">{code}</div>,
    },
    {
      title: t('simManager.tasks.columns.taskName'),
      dataIndex: 'taskName',
      key: 'taskName',
      width: 250,
      render: (name, record) => (
        <div
          className="font-bold text-black cursor-pointer hover:text-yellow-600 transition-colors"
          onClick={() => onView(record)}
        >
          {name}
        </div>
      ),
    },
    {
      title: t('simManager.tasks.columns.expectedResult'),
      dataIndex: 'expectedResult',
      key: 'expectedResult',
      width: 300,
      render: (result) => (
        <div className="text-sm text-neutral-600 line-clamp-1 italic">{result}</div>
      ),
    },
    {
      title: t('simManager.tasks.columns.actions'),
      key: 'actions',
      width: 140,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title={t('simManager.tasks.viewDetails')}>
            <button
              onClick={() => onView(record)}
              className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Eye className="w-4 h-4 text-yellow-400" />
            </button>
          </Tooltip>
          <Tooltip title={t('simManager.tasks.edit')}>
            <button
              onClick={() => onEdit(record)}
              className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 hover:scale-105 transition-all"
            >
              <Pencil className="w-4 h-4 text-black" />
            </button>
          </Tooltip>
          <Popconfirm
            title={t('simManager.tasks.confirmDelete')}
            description={t('simManager.tasks.deleteContent', { name: record.taskName })}
            onConfirm={() => onDelete(record)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t('simManager.tasks.delete')}>
              <button
                className="w-8 h-8 bg-red-500 border-2 border-red-600 flex items-center justify-center hover:bg-red-600 hover:scale-105 transition-all"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white border-2 border-black overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      <div className="h-1 bg-yellow-400 flex-none" />

      {/* Industrial Table Styles */}
      <style>{`
  .industrial-task-table .ant-table-thead > tr > th {
    background-color: #404040!important; /* neutral-700 */
    color: #ffffff!important;
    border-bottom: 2px solid #404040!important; /* neutral-700 */
    border-radius: 0!important;
    text-transform: uppercase;
    font-weight: 800;
  }
  .industrial-task-table .ant-table-wrapper .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none!important;
  }
  .industrial-task-table .ant-table-tbody > tr > td {
    border-bottom: 1px solid #e5e5e5;
    font-weight: 500;
  }
  .industrial-task-table .ant-table-tbody > tr:hover > td {
    background-color: #fefce8!important; /* yellow-50 */
  }
  .industrial-task-table .ant-table {
    border-radius: 0!important;
  }
  .industrial-task-table .ant-table-container {
    border-radius: 0!important;
  }
  /* Fix fixed column corners */
  .industrial-task-table .ant-table-cell-fix-left,
  .industrial-task-table .ant-table-cell-fix-right {
    background-color: inherit!important;
  }
  .industrial-task-table .ant-table-thead .ant-table-cell-fix-left,
  .industrial-task-table .ant-table-thead .ant-table-cell-fix-right {
    background-color: #404040!important;
  }
  .industrial-task-table .ant-table-tbody .ant-table-cell-fix-left,
  .industrial-task-table .ant-table-tbody .ant-table-cell-fix-right {
    background-color: #fff!important;
  }
  .industrial-task-table .ant-table-tbody > tr:hover .ant-table-cell-fix-left,
  .industrial-task-table .ant-table-tbody > tr:hover .ant-table-cell-fix-right {
    background-color: #fefce8!important;
  }
  /* Remove corner gaps */
  .industrial-task-table .ant-table-ping-left:not(.ant-table-has-fix-left) .ant-table-container::before,
  .industrial-task-table .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after {
    display: none!important;
  }
  .industrial-task-table .ant-table-header {
    border-radius: 0!important;
  }
  .industrial-task-table .ant-table-content {
    border-radius: 0!important;
  }
  /* Fix sticky header corners */
  .industrial-task-table .ant-table-thead > tr > th:first-child {
    border-top-left-radius: 0!important;
  }
  .industrial-task-table .ant-table-thead > tr > th:last-child {
    border-top-right-radius: 0!important;
  }
  /* Custom Scrollbar */
  .industrial-task-table .ant-table-body::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .industrial-task-table .ant-table-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-left: 2px solid #000;
  }
  .industrial-task-table .ant-table-body::-webkit-scrollbar-thumb {
    background: #000;
    border-radius: 0;
  }
  .industrial-task-table .ant-table-body::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
  /* Fix scrollbar corner */
  .industrial-task-table .ant-table-body::-webkit-scrollbar-corner {
    background: #171717;
  }
`}</style>

      <div className="flex-1 overflow-hidden p-0 industrial-task-table">
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey="id"
          pagination={false}
          scroll={{ y: 450 }}
          size="middle"
          loading={loading}
        />
      </div>

      <div className="flex-none p-4 border-t-2 border-neutral-200 flex justify-center bg-white z-10">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
          showSizeChanger
          pageSizeOptions={['10', '20', '50']}
          className="industrial-pagination"
          showTotal={(total, range) => (
            <span className="font-bold text-neutral-600 mr-4">
              {range[0]}-{range[1]} / {total} {t('simManager.tasks.title').toLowerCase()}
            </span>
          )}
          itemRender={(curr, type, originalElement) => {
            if (type === 'page') {
              return (
                <a className={`font - bold flex items - center justify - center w - full h - full border border - neutral - 300 hover: border - yellow - 400 hover: text - yellow - 600 transition - colors ${curr === pagination.current ? 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-neutral-600 hover:shadow-[2px_2px_0px_0px_rgba(250,204,21,1)]'} `}>
                  {curr}
                </a>
              );
            }
            return originalElement;
          }}
        />
        <style>{`
  .industrial-pagination .ant-pagination-item-active {
    border-color: #000!important;
    background: transparent!important;
  }
  .industrial-pagination .ant-pagination-item-active a {
    color: #000!important;
  }
  .industrial-pagination .ant-pagination-options .ant-select-selector {
    border-radius: 0!important;
    border: 1px solid #d4d4d4!important;
  }
  .industrial-pagination .ant-pagination-item {
    border-radius: 0!important;
    border: none!important;
  }
  .industrial-pagination .ant-pagination-prev .ant-pagination-item-link,
  .industrial-pagination .ant-pagination-next .ant-pagination-item-link {
    border-radius: 0!important;
    border: 1px solid #d4d4d4!important;
  }
`}</style>
      </div>
    </div>
  );
};

export default TaskTable;
