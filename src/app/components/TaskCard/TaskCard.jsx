import React from 'react';
import { Card, Button, Tooltip, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function TaskCard({ task, index, onView, onEdit, onDelete, onRemove }) {
    const { t } = useTranslation();
    const handleDelete = onDelete || onRemove;

    return (
        <Card
            size="small"
            className="hover:shadow-md transition-shadow flex flex-col"
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            title={
                <div className="flex items-center gap-2">
                    {index !== undefined && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                            {index + 1}
                        </span>
                    )}
                    <span className="text-sm font-medium truncate">{task.taskName}</span>
                </div>
            }
            extra={
                <div className="flex gap-1">
                    {onView && (
                        <Tooltip title={t('common.view')}>
                            <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => onView(task)}
                            />
                        </Tooltip>
                    )}
                    {onEdit && (
                        <Tooltip title={t('common.edit')}>
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => onEdit(task)}
                            />
                        </Tooltip>
                    )}
                    {(onDelete || onRemove) && (
                        <Tooltip title={onRemove ? t('common.remove') : t('common.delete')}>
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(onRemove ? task.id : task)}
                            />
                        </Tooltip>
                    )}
                </div>
            }
        >
            <div className="flex flex-col gap-1 flex-1">
                <div className="text-xs text-slate-500">
                    {t('common.code')}: <Tag color="blue" size="small">{task.taskCode}</Tag>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-600 line-clamp-2">
                        {task.taskDescription || t('common.na')}
                    </p>
                </div>
                <div className="text-xs bg-green-50 border border-green-200 rounded p-1 text-green-800 my-auto">
                    <strong>{t('common.expected')}:</strong> <span className="line-clamp-2">{task.expectedResult || t('common.na')}</span>
                </div>
            </div>
        </Card>
    );
}
