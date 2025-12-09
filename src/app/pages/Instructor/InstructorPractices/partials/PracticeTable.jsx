import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const PracticeTable = ({
  practices = [],
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange = () => {},
  onView = () => {},
}) => {
  const { t } = useTranslation();
  
  const tableColumns = [
    {
      title: t('instructor.practices.table.index'),
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (pageNumber - 1) * pageSize + idx + 1,
      fixed: 'left',
    },
    {
      title: t('instructor.practices.table.practiceCode'),
      dataIndex: 'practiceCode',
      key: 'practiceCode',
      width: 140,
    },
    {
      title: t('instructor.practices.table.name'),
      dataIndex: 'practiceName',
      key: 'practiceName',
      width: 260,
      render: (name, record) => (
        <div
          className="font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => onView(record)}
        >
          {name}
        </div>
      ),
    },
    {
      title: t('instructor.practices.table.duration'),
      dataIndex: 'estimatedDurationMinutes',
      key: 'estimatedDurationMinutes',
      width: 130,
      align: 'center',
      render: (v) => <span>{v}</span>,
    },
    {
      title: t('instructor.practices.table.difficulty'),
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 140,
      align: 'center',
      render: (level) => <Tag color={level === 'Entry' ? 'green' : level === 'Intermediate' ? 'orange' : 'red'}>{level || t('common.na')}</Tag>,
    },
    {
      title: t('instructor.practices.table.maxAttempts'),
      dataIndex: 'maxAttempts',
      key: 'maxAttempts',
      width: 120,
      align: 'center',
      render: (v) => <span>{v}</span>,
    },
    {
      title: t('instructor.practices.table.actions'),
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('instructor.practices.table.viewDetails')}>
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-hidden min-h-[450px]">
        <Table
          columns={tableColumns}
          dataSource={practices}
          rowKey="id"
          pagination={false}
          scroll={{ y: 400 }}
          size="middle"
        />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => t('instructor.practices.table.pagination', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
  );
};

export default PracticeTable;
