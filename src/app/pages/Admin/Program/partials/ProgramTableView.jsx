import React from "react";
import { useTranslation } from 'react-i18next';
import { Table, Tag, Button, Space, Tooltip, Popconfirm, Pagination, Avatar } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ProgramTableView = ({
  programs,
  pageNumber,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  deletingId
}) => {
  const { t } = useTranslation();
  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  };
  
  // Table columns definition
  const tableColumns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <span className="font-medium text-gray-600">
          {(pageNumber - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('admin.programs.table.image'),
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      align: "center",
      render: (imageUrl, record) => (
        <div className="flex justify-center">
          <Avatar
            src={imageUrl}
            alt={record.name}
            shape="square"
            size={48}
            style={{ backgroundColor: '#f3f4f6', cursor: 'pointer' }}
            onClick={() => onView(record)}
          >
            {!imageUrl && getInitials(record.name)}
          </Avatar>
        </div>
      ),
    },
    {
      title: t('admin.programs.table.name'),
      dataIndex: "name",
      key: "name",
      width: 200,
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
      title: t('admin.programs.table.duration'),
      dataIndex: "durationHours",
      key: "duration",
      width: 100,
    },
    {
      title: t('admin.programs.table.courses'),
      dataIndex: "totalCourses",
      key: "totalCourses",
      width: 100,
      render: (count) => <span>{count || 0}</span>,
    },
    {
      title: t('admin.programs.table.status'),
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
    },
    {
      title: t('admin.programs.table.actions'),
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('common.viewDetails')}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title={t('admin.programs.editProgram')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t('admin.programs.deleteProgram')}>
            <Popconfirm
              title={t('admin.programs.deleteConfirmTitle')}
              description={t('admin.programs.deleteConfirmDesc')}
              onConfirm={() => onDelete(record.id)}
              okButtonProps={{ loading: deletingId === record.id }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === record.id}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="rounded-lg shadow overflow-hidden">
      <div className="overflow-hidden h-[450px]">
        <Table
          columns={tableColumns}
          dataSource={programs}
          rowKey="id"
          scroll={{ y: 400 }}
          pagination={false}
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
          showTotal={(total, range) => t('admin.programs.pagination', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
  );
};

export default ProgramTableView;