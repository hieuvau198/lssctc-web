import React from "react";
import { Table, Tag, Button, Space, Tooltip, Pagination, Empty } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ClassCard from "./ClassCard";
import { getProgramName } from "../../../../mock/instructorClasses";

// Table View Component
const ClassTableView = ({
    classes,
    pageNumber,
    pageSize,
    total,
    onPageChange,
    onView
}) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        return status === '1' ? 'green' : 'red';
    };

    const getStatusText = (status) => {
        return status === '1' ? 'Active' : 'Inactive';
    };

    const tableColumns = [
        {
            title: "#",
            key: "index",
            width: 50,
            fixed: "left",
            render: (_, __, index) => (
                <span className="font-medium text-gray-600 text-sm">
                    {(pageNumber - 1) * pageSize + index + 1}
                </span>
            ),
        },
        {
            title: "Class Name",
            dataIndex: "name",
            key: "name",
            width: 220,
            render: (name, record) => (
                <div className="space-y-1">
                    <div
                        className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => onView(record)}
                    >
                        {name}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                        {record.classCode.name}
                    </div>
                </div>
            ),
        },
        {
            title: "Program",
            dataIndex: "programCourseId",
            key: "program",
            width: 180,
            render: (programCourseId) => (
                <div className="text-sm text-gray-700">
                    {getProgramName(programCourseId)}
                </div>
            ),
        },
        {
            title: "Duration",
            key: "duration",
            width: 200,
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
            render: (capacity) => (
                <div className="text-sm font-medium text-center">
                    {capacity}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)} className="text-center">
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: "Actions",
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
            <Table
                columns={tableColumns}
                dataSource={classes}
                rowKey="id"
                scroll={{ y: 400 }}
                pagination={{
                    current: pageNumber,
                    pageSize: pageSize,
                    total: total,
                    onChange: onPageChange,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} classes`,
                }}
                className="m-4"
                onRow={(record) => ({
                    onClick: () => onView(record),
                })}
                size="middle"
            />
        </div>
    );
};

// Card View Component  
const ClassCardView = ({
    classes,
    pageNumber,
    pageSize,
    total,
    onPageChange,
    onView
}) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {classes.map((classItem) => (
                    <div key={classItem.id} className="flex">
                        <ClassCard
                            classItem={classItem}
                            onView={onView}
                        />
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
                    showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} classes`
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
    pageNumber = 1,
    pageSize = 12,
    total = 0,
    onPageChange,
    onView
}) => {
    if (classes.length === 0) {
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