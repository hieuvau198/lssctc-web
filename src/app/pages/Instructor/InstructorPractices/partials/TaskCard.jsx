import React from 'react';
import { Card, Button, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function TaskCard({ task, index, onEdit, onRemove }) {
    return (
        <Card
            size="small"
            className="hover:shadow-md transition-shadow flex flex-col"
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            title={
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {index + 1}
                    </span>
                    <span className="text-sm font-medium truncate">{task.taskName}</span>
                </div>
            }
            extra={
                <div className="flex gap-1">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(task)}
                        />
                    </Tooltip>
                    <Tooltip title="Remove">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onRemove(task.id)}
                        />
                    </Tooltip>
                </div>
            }
        >
            <div className="flex flex-col gap-2 flex-1">
                <div className="text-xs text-slate-500">
                    Code: <Tag color="blue" size="small">{task.taskCode}</Tag>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-600 line-clamp-2">
                        {task.taskDescription}
                    </p>
                </div>
                <div className="text-xs bg-green-50 border border-green-200 rounded p-2 text-green-800 my-auto">
                    <strong>Expected:</strong> <span className="line-clamp-2">{task.expectedResult}</span>
                </div>
            </div>
        </Card>
    );
}
