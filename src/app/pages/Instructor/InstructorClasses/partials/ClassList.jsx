import { Pagination, Table, Button } from "antd"; 
import React from "react";
import ClassCard from "./ClassCard";
import { EyeOutlined } from "@ant-design/icons";

const ClassTableView = ({ classes, onView, paginationProps }) => {
  const columns = [
    {
      title: "Code",
      dataIndex: "classCode",
      key: "classCode",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
          className="font-medium text-blue-600 hover:underline cursor-pointer"
          onClick={() => onView(record)}
        >
          {text || record.className || "Mobile Crane Training"}
        </span>
      ),
    },
    {
      title: "Start",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "End",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Trainees",
      dataIndex: "traineeCount",
      key: "traineeCount",
      width: 100,
      align: "center",
      render: (count) => count ?? 0,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => status ?? "Cancelled",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />} 
          onClick={() => onView(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={classes}
      columns={columns}
      rowKey={(r) => r.id || r.classId}
      pagination={false}
    />
  );
};

// Main component
export default function ClassList({
  classes = [],
  viewMode = "table",
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onView,
}) {
  const paginationProps = {
    current: pageNumber,
    pageSize: pageSize,
    total: total,
    onChange: onPageChange,
    showSizeChanger: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} of ${total} classes`,
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Content */}
      <div className="p-0">
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <ClassCard
                  key={classItem.id || classItem.classId}
                  classItem={classItem}
                  onView={onView}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-500 py-10">
                No classes found.
              </div>
            )}
          </div>
        ) : (
          <ClassTableView
            classes={classes}
            onView={onView}
            paginationProps={paginationProps}
          />
        )}
      </div>

      {/* Pagination Footer */}
      {total > (classes.length || 0) || total > pageSize ? (
        <div className="flex justify-center p-6 border-t border-slate-100">
          <Pagination {...paginationProps} />
        </div>
      ) : null}
    </div>
  );
}