import React from "react";
import { Table, Tag, Button, Space, Tooltip, Popconfirm, Pagination } from "antd";
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
  // Table columns definition
  const tableColumns = [
    {
      title: "#",
      key: "index",
      width: 60,
      fixed: "left",
      render: (_, __, index) => (
        <span className="font-medium text-gray-600">
          {(pageNumber - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      fixed: "left",
      render: (imageUrl, record) => (
        <div className="w-12 h-12 overflow-hidden rounded cursor-pointer">
          <img
            src={imageUrl}
            alt={record.name}
            className="w-full h-full object-cover"
            onClick={() => onView(record)}
          />
        </div>
      ),
    },
    {
      title: "Program Name",
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
      title: "Courses",
      dataIndex: "totalCourses",
      key: "totalCourses",
      width: 100,
      render: (count) => <span>{count || 0}</span>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Program">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Program">
            <Popconfirm
              title="Delete program?"
              description="Are you sure you want to delete this program?"
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
      <div className="overflow-hidden min-h-[450px]">
        <Table
          columns={tableColumns}
          dataSource={programs}
          rowKey="id"
          scroll={{ y: 450 }}
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
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} programs`}
        />
      </div>
    </div>
  );
};

export default ProgramTableView;