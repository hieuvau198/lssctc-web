import { useTranslation } from 'react-i18next';
import { Pagination } from "antd";
import { ExternalLink, GraduationCap } from "lucide-react";
import { getClassStatus } from "../../../../utils/classStatus";
import PMClassCard from "./PMClassCard";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import { IndustrialTable } from "../../../../components/Industrial";

// Table View Component using IndustrialTable
const ClassTableView = ({
  classes,
  page,
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
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('admin.classes.columns.className'),
      dataIndex: "name",
      key: "name",
      width: 250,
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
      title: t('admin.classes.columns.classCode'),
      dataIndex: "classCode",
      key: "classCode",
      width: 150,
      render: (classCode) => (
        <span className="font-medium text-neutral-700">{classCode?.name || classCode || "-"}</span>
      ),
    },
    {
      title: t('admin.classes.form.startDate'),
      dataIndex: "startDate",
      key: "startDate",
      width: 180,
      render: (date) => (
        <span className="text-neutral-600">
          <DayTimeFormat value={date} />
        </span>
      ),
    },
    {
      title: t('admin.classes.form.endDate'),
      dataIndex: "endDate",
      key: "endDate",
      width: 180,
      render: (date) => (
        <span className="text-neutral-600">
          <DayTimeFormat value={date} />
        </span>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const s = getClassStatus(status);
        // Map status colors to industrial style
        const colorMap = {
          'green': 'bg-green-100 text-green-800 border-green-300',
          'blue': 'bg-blue-100 text-blue-800 border-blue-300',
          'orange': 'bg-orange-100 text-orange-800 border-orange-300',
          'red': 'bg-red-100 text-red-800 border-red-300',
          'purple': 'bg-purple-100 text-purple-800 border-purple-300',
          'default': 'bg-neutral-100 text-neutral-800 border-neutral-300',
        };
        const statusClass = colorMap[s.color] || colorMap.default;
        return (
          <span className={`px-3 py-1 text-xs font-bold uppercase border ${statusClass}`}>
            {t(`common.classStatus.${s.key}`)}
          </span>
        );
      },
    },
  ];

  const emptyContent = (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
        <GraduationCap className="w-8 h-8 text-neutral-400" />
      </div>
      <p className="text-neutral-800 font-bold uppercase">{t('admin.classes.noClasses')}</p>
    </div>
  );

  return (
    <IndustrialTable
      columns={tableColumns}
      dataSource={classes}
      rowKey="id"
      emptyContent={emptyContent}
      pagination={{
        current: page,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
        label: t('admin.classes.totalClasses'),
      }}
    />
  );
};

// Card View Component with Industrial styling
const ClassCardView = ({
  classes,
  page,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <PMClassCard
            key={classItem.id}
            classItem={classItem}
            onDetail={onView}
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
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={true}
          pageSizeOptions={["5", "10", "20", "50"]}
          showTotal={(total, range) =>
            t('common.pagination.showTotal', { start: range[0], end: range[1], total })
          }
          className="industrial-pagination"
        />
      </div>
    </>
  );
};

// Main ClassList component
const ClassList = ({
  classes,
  viewMode = "table",
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  deletingId
}) => {
  const { t } = useTranslation();

  if (classes.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-neutral-800 font-bold uppercase">{t('admin.classes.noClasses')}</p>
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <ClassTableView
        classes={classes}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        deletingId={deletingId}
      />
    );
  }

  return (
    <ClassCardView
      classes={classes}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      deletingId={deletingId}
    />
  );
};

export default ClassList;