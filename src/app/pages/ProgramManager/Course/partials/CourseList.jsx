import React from "react";
import { Empty, Pagination, Table, Tag, Button, Space, Tooltip, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CourseCard from "./CourseCard";

// Table View Component
const CourseTableView = ({ 
  courses, 
  pageNumber, 
  pageSize, 
  total, 
  onPageChange, 
  onView, 
  onEdit, 
  onDelete, 
  deletingId 
}) => {
  const tableColumns = [
    {
      title: "#",
      key: "index",
      width: 40,
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
      title: "Course Name",
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
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 120,
    },
    {
      title: "Level",
      dataIndex: "levelName",
      key: "levelName",
      width: 80,
    },
    {
      title: "Duration",
      dataIndex: "durationHours",
      key: "durationHours",
      width: 100,
      render: (hours) => <span>{hours}h</span>,
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
          <Tooltip title="Edit Course">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Course">
            <Popconfirm
              title="Delete course?"
              description="Are you sure you want to delete this course?"
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
    <Table
      columns={tableColumns}
      dataSource={courses}
      rowKey="id"
      scroll={{ x: 360, y: 360 }}
      pagination={{
        current: pageNumber,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} courses`,
      }}
      className="bg-white rounded-lg shadow"
    />
  );
};

// Card View Component  
const CourseCardView = ({ 
  courses, 
  pageNumber, 
  pageSize, 
  total, 
  onPageChange, 
  onView, 
  onEdit, 
  onDelete, 
  deletingId 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onSelect={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            deletingId={deletingId}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={true}
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} courses`
          }
        />
      </div>
    </>
  );
};

// Main CourseList component
const CourseList = ({ 
  courses, 
  viewMode = "card",
  pageNumber = 1, 
  pageSize = 12, 
  total = 0, 
  onPageChange,
  onSelect, 
  onEdit,
  onDelete,
  deletingId
}) => {
  if (courses.length === 0) {
    return <Empty description="No courses found." className="mt-16" />;
  }

  if (viewMode === "table") {
    return (
      <CourseTableView
        courses={courses}
        pageNumber={pageNumber}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onView={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        deletingId={deletingId}
      />
    );
  }

  return (
    <CourseCardView
      courses={courses}
      pageNumber={pageNumber}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
      onView={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      deletingId={deletingId}
    />
  );
};

export default CourseList;
