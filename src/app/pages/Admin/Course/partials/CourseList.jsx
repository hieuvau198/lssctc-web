import React from "react";
import { useTranslation } from 'react-i18next';
import { Avatar, Pagination } from "antd";
import { BookOpen, ExternalLink } from "lucide-react";
import { IndustrialTable } from "../../../../components/Industrial";
import CourseCard from "./CourseCard";

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
};

// Table View Component using IndustrialTable
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
        <span className="font-bold text-neutral-500">
          {(pageNumber - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('admin.courses.columns.image'),
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 90,
      render: (imageUrl, record) => (
        <Avatar
          src={imageUrl}
          alt={record.name}
          shape="square"
          size={48}
          className="cursor-pointer border-2 border-neutral-200 hover:border-yellow-400 transition-colors"
          onClick={() => onView(record)}
          style={{ backgroundColor: '#facc15', color: '#000', fontWeight: 'bold' }}
        >
          {!imageUrl && getInitials(record.name)}
        </Avatar>
      ),
    },
    {
      title: t('admin.courses.columns.courseName'),
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <span
          onClick={() => onView(record)}
          className="font-bold text-black cursor-pointer hover:text-yellow-600 transition-colors flex items-center gap-2 group"
        >
          {name}
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      ),
    },
    {
      title: t('common.category'),
      dataIndex: "category",
      key: "category",
      width: 200,
      render: (text) => <span className="text-neutral-600">{text || '-'}</span>
    },
    {
      title: t('common.level'),
      dataIndex: "level",
      key: "level",
      width: 120,
      render: (text) => <span className="font-medium">{text || '-'}</span>
    },
    {
      title: t('common.status'),
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      render: (isActive) => (
        <span className={`px-3 py-1 text-xs font-bold uppercase border ${isActive
          ? 'bg-green-100 text-green-800 border-green-300'
          : 'bg-red-100 text-red-800 border-red-300'
          }`}>
          {isActive ? t('common.active') : t('common.inactive')}
        </span>
      ),
    },
  ];

  const emptyContent = (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-neutral-400" />
      </div>
      <p className="text-neutral-800 font-bold uppercase">{t('admin.courses.noCourses')}</p>
    </div>
  );

  return (
    <IndustrialTable
      columns={tableColumns}
      dataSource={courses}
      rowKey="id"
      emptyContent={emptyContent}
      pagination={{
        current: pageNumber,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        label: t('admin.courses.totalCourses'),
      }}
    />
  );
};

// Card View Component with Industrial styling
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

      {/* Industrial Pagination */}
      <div className="flex justify-center mt-8">
        <style>{`
          .industrial-pagination .ant-pagination-item-active {
            background-color: #facc15 !important;
            border-color: #000 !important;
            border-width: 2px !important;
          }
          .industrial-pagination .ant-pagination-item-active a {
            color: #000 !important;
            font-weight: 700 !important;
          }
          .industrial-pagination .ant-pagination-item {
            border: 2px solid #d4d4d4 !important;
            border-radius: 0 !important;
          }
          .industrial-pagination .ant-pagination-item:hover {
            border-color: #000 !important;
          }
        `}</style>
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
          className="industrial-pagination"
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
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-neutral-800 font-bold uppercase">{t('admin.courses.noCourses')}</p>
      </div>
    );
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