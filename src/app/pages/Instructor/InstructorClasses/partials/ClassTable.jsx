import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import getClassStatus from '../../../../utils/classStatus';

const ClassTable = ({
  classes = [],
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange = () => {},
  onView = () => {},
}) => {
  const { t } = useTranslation();
  

  const tableColumns = [
    {
      title: t('instructor.classes.table.index'),
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (pageNumber - 1) * pageSize + idx + 1,
      fixed: 'left',
    },
    {
      title: t('instructor.classes.table.classCode'),
      dataIndex: 'classCode',
      key: 'classCode',
      width: 80,
      fixed: 'left',
    },
    {
      title: t('instructor.classes.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name, record) => (
        <div
          className="font-medium text-blue-600 cursor-pointer hover:underline"
          onClick={() => onView(record)}
        >
          {name || record.className || t('common.na')}
        </div>
      ),
    },
    {
      title: t('instructor.classes.table.startDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: t('instructor.classes.table.endDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: t('instructor.classes.table.trainees'),
      dataIndex: 'traineeCount',
      key: 'traineeCount',
      width: 100,
      align: 'center',
      render: (count) => <span>{count ?? 0}</span>,
    },
    {
      title: t('instructor.classes.table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const s = getClassStatus(status);
        return (
          <Tag color={s.color}>
            {s.label || t('common.na')}
          </Tag>
        );
      },
    },
    {
      title: t('instructor.classes.table.actions'),
      key: 'actions',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('instructor.classes.table.viewDetails')}>
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-hidden min-h-[500px]">
        <Table
          columns={tableColumns}
          dataSource={classes}
          rowKey={(r) => r.id || r.classId}
          pagination={false}
          scroll={{ y: 450 }}
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
          showTotal={(t, r) => `${r[0]}-${r[1]} / ${t}`}
        />
      </div>
    </div>
  );
};

export default ClassTable;
