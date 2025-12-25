import React from "react";
import { useTranslation } from 'react-i18next';
import { Avatar } from "antd";
import { ExternalLink, Layers } from "lucide-react";
import { IndustrialTable } from "../../../../components/Industrial";
import dayjs from "dayjs";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";

const ProgramTableView = ({
  programs,
  pageNumber,
  pageSize,
  total,
  onPageChange,
  onView,
  ...rest
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
      title: t('admin.programs.table.image'),
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 90,
      align: "center",
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
      title: t('admin.programs.table.name'),
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
      title: t('admin.programs.table.courses'),
      dataIndex: "totalCourses",
      key: "totalCourses",
      width: 120,
      align: "center",
      render: (count) => (
        <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-neutral-100 text-black font-bold text-sm border-2 border-neutral-200">
          {count || 0}
        </span>
      ),
    },
    {
      title: t('common.createdAt'),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date) => (
        <span className="text-neutral-600 text-sm font-medium">
          <DayTimeFormat value={date} />
        </span>
      ),
    },
    {
      title: t('admin.programs.table.status'),
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
        <Layers className="w-8 h-8 text-neutral-400" />
      </div>
      <p className="text-neutral-800 font-bold uppercase">{t('admin.programs.noPrograms')}</p>
    </div>
  );

  return (
    <IndustrialTable
      columns={tableColumns}
      dataSource={programs}
      rowKey="id"
      emptyContent={emptyContent}
      pagination={{
        current: pageNumber,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        label: t('admin.programs.totalPrograms'),
      }}
      {...rest}
    />
  );
};

export default ProgramTableView;