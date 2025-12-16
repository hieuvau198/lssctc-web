import React from 'react';
import { Table, Pagination, Tag, Tooltip, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const TaskTable = ({
    data = [],
    loading = false,
    onView = () => { },
    onEdit = () => { },
    onDelete = () => { },
    pagination = {},
}) => {
    const { t } = useTranslation();

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
            title: t('simManager.tasks.columns.taskCode'),
            dataIndex: 'taskCode',
            key: 'taskCode',
            width: 160,
            fixed: 'left',
            render: (code) => <div className="text-sm">{code}</div>,
        },
        {
            title: t('simManager.tasks.columns.taskName'),
            dataIndex: 'taskName',
            key: 'taskName',
            width: 200,
            render: (name, record) => (
                <div
                    className="font-medium text-violet-600 cursor-pointer hover:underline"
                    onClick={() => onView(record)}
                >
                    {name}
                </div>
            ),
        },
        {
            title: t('simManager.tasks.columns.expectedResult'),
            dataIndex: 'expectedResult',
            key: 'expectedResult',
            width: 300,
            render: (result) => (
                <div className="text-sm text-gray-600 line-clamp-1">{result}</div>
            ),
        },
        {
            title: t('simManager.tasks.columns.actions'),
            key: 'actions',
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title={t('simManager.tasks.viewDetails')}>
                        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => onView(record)} />
                    </Tooltip>
                    <Tooltip title={t('simManager.tasks.edit')}>
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Tooltip title={t('simManager.tasks.delete')}>
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
            <div className="overflow-hidden min-h-[450px]">
                <Table
                    columns={tableColumns}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                    scroll={{ y: 400 }}
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
                    showTotal={(total, range) => t('simManager.tasks.pagination', { start: range[0], end: range[1], total })}
                />
            </div>
        </div>
    );
};

export default TaskTable;
