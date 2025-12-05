import React from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
      title: t('admin.courses.columns.image'),
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 50,
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
      title: t('admin.courses.columns.courseName'),
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
      title: t('common.category'),
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: t('common.level'),
      dataIndex: "level",
      key: "level",
      width: 80,
    },
    {
      title: t('admin.courses.columns.durationHours'),
      dataIndex: "durationHours",
      key: "durationHours",
      width: 100,
      render: (hours) => <span>{hours}</span>,
    },
    {
      title: t('common.status'),
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
      title: t('common.actions'),
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('admin.courses.viewDetails')}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title={t('admin.courses.editCourse')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t('admin.courses.deleteCourseTitle')}>
            <Popconfirm
              title={t('admin.courses.deleteCourseTitle')}
              description={t('admin.courses.deleteConfirm')}
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
          dataSource={courses}
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
          showTotal={(total, range) => t('common.pagination.showTotal', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
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
  const { t } = useTranslation();
  
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
            t('common.pagination.showTotal', { start: range[0], end: range[1], total })
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
  const { t } = useTranslation();

  if (courses.length === 0) {
    return <Empty description={t('admin.courses.noCourses')} className="mt-16" />;
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
