import React from "react";
import { useTranslation } from 'react-i18next';
import { Table, Tag, Avatar } from "antd";
import dayjs from "dayjs";

const ProgramTableView = ({
  programs,
  pageNumber,
  pageSize,
  total,
  onPageChange,
  onView, // This will now handle navigation to the detail page
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

  const dateFormat = "YYYY-MM-DD HH:mm";
  
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
            className="cursor-pointer bg-slate-100"
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
        title: t('admin.programs.table.courses'),
        dataIndex: "totalCourses",
        key: "totalCourses",
        width: 100,
        align: "center",
        render: (count) => <Tag>{count || 0}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date) => date ? <span className="text-gray-600 text-sm">{dayjs(date).format(dateFormat)}</span> : "-",
    },
    {
        title: "Updated At",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 160,
        render: (date) => date ? <span className="text-gray-600 text-sm">{dayjs(date).format(dateFormat)}</span> : "-",
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
  ];

  return (
    <div className="rounded-lg shadow overflow-hidden bg-white">
        <Table
          columns={tableColumns}
          dataSource={programs}
          rowKey="id"
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            onChange: onPageChange,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) => t('admin.programs.pagination', { start: range[0], end: range[1], total })
          }}
          size="middle"
          scroll={{ x: 800 }}
        />
    </div>
  );
};

export default ProgramTableView;