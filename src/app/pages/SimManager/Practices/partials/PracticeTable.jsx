import React from 'react';
import { Table, Pagination, Tooltip, Space } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const PracticeTable = ({
  data = [],
  loading = false,
  deleting = null,
  onView = () => { },
  onDelete = () => { },
  pagination = {},
}) => {
  const { t } = useTranslation();

  const getDifficultyStyle = (level) => {
    const map = {
      Entry: 'bg-green-500 text-white',
      Intermediate: 'bg-yellow-400 text-black',
      Advanced: 'bg-red-500 text-white'
    };
    return map[level] || 'bg-neutral-200 text-neutral-600';
  };

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
      title: t('simManager.practices.practiceCode'),
      dataIndex: 'practiceCode',
      key: 'practiceCode',
      width: 120,
      fixed: 'left',
      render: (code) => (
        <span className="font-mono font-bold text-neutral-700">{code}</span>
      ),
    },
    {
      title: t('simManager.practices.practiceName'),
      dataIndex: 'practiceName',
      key: 'practiceName',
      width: 280,
      render: (name, record) => (
        <div
          className="font-bold text-yellow-600 uppercase cursor-pointer hover:text-neutral-900 transition-colors line-clamp-1"
          onClick={() => onView(record)}
        >
          <Tooltip title={name}>{name}</Tooltip>
        </div>
      ),
    },
    {
      title: t('simManager.practices.duration'),
      dataIndex: 'estimatedDurationMinutes',
      key: 'estimatedDurationMinutes',
      width: 130,
      align: 'center',
      render: (v) => (
        <span className="font-bold">{v} <span className="text-neutral-500 font-normal">min</span></span>
      ),
    },
    {
      title: t('simManager.practices.difficulty'),
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 140,
      align: 'center',
      render: (level) => (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${getDifficultyStyle(level)}`}>
          {level || t('common.na')}
        </span>
      ),
    },
    {
      title: t('simManager.practices.maxAttempts'),
      dataIndex: 'maxAttempts',
      key: 'maxAttempts',
      width: 120,
      align: 'center',
      render: (v) => <span className="font-bold">{v}</span>,
    },
    {
      title: t('common.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive) => (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isActive
            ? 'bg-yellow-400 text-black'
            : 'bg-neutral-200 text-neutral-600'
          }`}>
          {isActive ? t('common.active') : t('common.inactive')}
        </span>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('common.view')}>
            <div
              onClick={() => onView(record)}
              className="w-8 h-8 border-2 border-neutral-300 hover:border-yellow-500 hover:bg-yellow-500 flex items-center justify-center transition-all cursor-pointer"
            >
              <EyeOutlined />
            </div>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <div
              onClick={() => onDelete(record)}
              className={`w-8 h-8 border-2 border-neutral-300 hover:border-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer ${deleting === record.id ? 'opacity-50 pointer-events-none' : ''}`}
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
          showTotal={(total, range) => `${range[0]}-${range[1]} ${t('simManager.practices.ofPractices', { total })}`}
        />
      </div>
    </div>
  );
};

export default PracticeTable;
