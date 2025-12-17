import React from 'react';
import { Card, Button, Tooltip, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function TaskCard({ task, index, onView, onEdit, onDelete, onRemove }) {
    const { t } = useTranslation();
    const handleDelete = onDelete || onRemove;

    return (
        <div className="bg-white border-2 border-neutral-900 hover:border-yellow-400 transition-all group">
            {/* Status bar */}
            <div className="h-1.5 bg-neutral-100 group-hover:bg-yellow-400 transition-colors" />

            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {index !== undefined && (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-400 text-black text-sm font-black flex-shrink-0">
                                {index + 1}
                            </span>
                        )}
                        <span className="text-sm font-black uppercase truncate text-neutral-900 group-hover:text-yellow-600 transition-colors">
                            {task.taskName}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                        {onView && (
                            <Tooltip title={t('common.view')}>
                                <button
                                    type="button"
                                    onClick={() => onView(task)}
                                    className="w-8 h-8 border border-neutral-300 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all"
                                >
                                    <EyeOutlined className="text-sm" />
                                </button>
                            </Tooltip>
                        )}
                        {onEdit && (
                            <Tooltip title={t('common.edit')}>
                                <button
                                    type="button"
                                    onClick={() => onEdit(task)}
                                    className="w-8 h-8 border border-neutral-300 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all"
                                >
                                    <EditOutlined className="text-sm" />
                                </button>
                            </Tooltip>
                        )}
                        {(onDelete || onRemove) && (
                            <Tooltip title={onRemove ? t('common.remove') : t('common.delete')}>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(onRemove ? task.id : task)}
                                    className="w-8 h-8 border border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all"
                                >
                                    <DeleteOutlined className="text-sm" />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                        {t('common.code')}: <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 font-bold">{task.taskCode}</span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2">
                        {task.taskDescription || t('common.na')}
                    </p>
                    <div className="text-xs bg-yellow-50 border-l-4 border-yellow-400 p-2 text-neutral-700">
                        <strong className="uppercase">{t('common.expected')}:</strong> <span className="line-clamp-2">{task.expectedResult || t('common.na')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
