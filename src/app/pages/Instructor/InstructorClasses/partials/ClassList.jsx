import React from "react";
import { Table, Tag, Button, Tooltip, Pagination, Empty } from "antd";
import { Eye } from "lucide-react";
import ClassCard from "./ClassCard";
import { getProgramName } from "../../../../mocks/instructorClasses";

// Table View Component
const ClassTableView = ({ classes, pageNumber, pageSize, total, onPageChange, onView }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return '-';
    }
  };

  const isActiveStatus = (status) => String(status) === '1' || Number(status) === 1;
  const getStatusColor = (status) => (isActiveStatus(status) ? 'green' : 'red');
  const getStatusText = (status) => (isActiveStatus(status) ? 'Active' : 'Inactive');

  const tableColumns = [
    {
      title: "Class Code",
      key: "classCode",
      width: 100,
      render: (_, record) => record.classCode ?? '-',
    },
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      ellipsis: true,
      render: (name) => (
          <Tooltip title={name}>
              {name}
          </Tooltip>
      ),
    },
    {
      title: "Program",
      dataIndex: "programCourseId",
      key: "program",
      width: 180,
      ellipsis: true,
      render: (programCourseId) => {
        const programName = getProgramName(programCourseId);
        return (
          <Tooltip title={programName}>
            {programName}
          </Tooltip>
        );
      },
    },
    {
      title: "Duration",
      key: "duration",
      width: 100,
      render: (_, record) => (
        <div className="text-sm text-gray-600">
          <div>{formatDate(record.startDate)}</div>
          <div className="text-xs text-gray-500">to {formatDate(record.endDate)}</div>
        </div>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: 80,
      render: (capacity) => <div className="text-sm font-medium text-center">{capacity}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => <Tag color={getStatusColor(status)} className="text-center">{getStatusText(status)}</Tag>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onView(record);
              }}
              className="hover:bg-blue-50 hover:text-blue-600"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div style={{ height: 440 }}  className="p-4 overflow-auto border-b border-gray-200">
        <Table
          columns={tableColumns}
          dataSource={classes}
          rowKey={(r) => r.id ?? r.classId ?? `${r.name ?? 'class'}-${r.programCourseId ?? '0'}`}
          pagination={false}
          className="w-full"
          onRow={(record) => ({ onClick: () => onView(record) })}
          size="middle"
        />
      </div>

      <div className="p-4 bg-white flex justify-center">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={true}
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} classes`}
        />
      </div>
    </div>
  );
};

// Card View Component
const ClassCardView = ({ classes, pageNumber, pageSize, total, onPageChange, onView }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {classes.map((classItem, i) => (
          <div key={classItem.id ?? classItem.classId ?? `${classItem.name ?? 'class'}-${i}`} className="flex">
            <ClassCard classItem={classItem} onView={onView} />
          </div>
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
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} classes`}
        />
      </div>
    </>
  );
};

// Main ClassList component
const ClassList = ({ classes, viewMode = "table", pageNumber = 1, pageSize = 12, total = 0, onPageChange, onView }) => {
  if (!Array.isArray(classes) || classes.length === 0) {
    return <Empty description="No classes found." className="mt-16" />;
  }

  if (viewMode === "table") {
    return (
      <ClassTableView
        classes={classes}
        pageNumber={pageNumber}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onView={onView}
      />
    );
  }

  return (
    <ClassCardView
      classes={classes}
      pageNumber={pageNumber}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
      onView={onView}
    />
  );
};

export default ClassList;