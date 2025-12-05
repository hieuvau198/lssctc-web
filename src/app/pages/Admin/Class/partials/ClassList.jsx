import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { Button, Empty, Pagination, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { getClassStatus } from "../../../../utils/classStatus";
import PMClassCard from "./PMClassCard";

// Table View Component
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
      fixed: "left",
      align: "center",
      render: (_, __, index) => (
        <span className="font-medium text-gray-600">
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: t('admin.classes.columns.className'),
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
      title: t('admin.classes.columns.classCode'),
      dataIndex: "classCode",
      key: "classCode",
      width: 120,
      render: (classCode) => classCode?.name || classCode || "-",
    },
    {
      title: t('admin.classes.columns.capacity'),
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const s = getClassStatus(status);
        return <Tag color={s.color}>{t(`common.classStatus.${s.key}`)}</Tag>;
      },
    },
    {
      title: t('common.actions'),
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('admin.classes.viewDetails')}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title={t('admin.classes.editClass')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              disabled={getClassStatus(record.status).key !== 'Draft'}
            />
          </Tooltip>
          <Tooltip title={t('admin.classes.deleteClass')}>
            <Popconfirm
              title={t('admin.classes.deleteClassTitle')}
              description={t('admin.classes.deleteConfirm')}
              onConfirm={() => onDelete(record.id)}
              okButtonProps={{ loading: deletingId === record.id }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === record.id}
                disabled
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div style={{ height: 390 }} className="overflow-auto">
        <Table
          columns={tableColumns}
          dataSource={classes}
          rowKey="id"
          scroll={{ x: 360 }}
          pagination={false}
        />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          showTotal={(total, range) => t('common.pagination.showTotal', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
  );
};

// Card View Component  
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
      <div className="flex justify-center mt-8">
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
    return <Empty description={t('admin.classes.noClasses')} className="mt-16" />;
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