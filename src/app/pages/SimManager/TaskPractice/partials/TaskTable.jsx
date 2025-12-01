import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TaskTable = ({
    data = [],
    loading = false,
    onView = () => { },
    onEdit = () => { },
    onDelete = () => { },
    pagination = {},
}) => {
    const tableColumns = [
        {
            title: '#',
            key: 'index',
            width: 60,
            fixed: 'left',
            align: 'center',
            render: (_, __, index) => (
                <span className="font-medium text-gray-600">
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                </span>
            ),
        },
        {
            title: 'Task Code',
            dataIndex: 'taskCode',
            key: 'taskCode',
            width: 160,
            fixed: 'left',
            render: (code) => <div className="text-sm">{code}</div>,
        },
        {
            title: 'Task Name',
            dataIndex: 'taskName',
            key: 'taskName',
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
            title: 'Expected Result',
            dataIndex: 'expectedResult',
            key: 'expectedResult',
            width: 300,
            render: (result) => (
                <div className="text-sm text-gray-600 line-clamp-1">{result}</div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="rounded-lg shadow overflow-hidden">
            <div className="overflow-hidden min-h-[500px]">
                <Table
                    columns={tableColumns}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                    scroll={{ y: 450 }}
                    size="middle"
                    loading={loading}
                />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={pagination.onChange}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50']}
                    showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} tasks`}
                />
            </div>
        </div>
    );
};

export default TaskTable;
