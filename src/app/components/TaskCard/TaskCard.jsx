import React from 'react';
import { Card, Button, Tooltip, Tag } from 'antd';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TaskCard({ task, index, onView, onEdit, onDelete, onRemove }) {
    const { t } = useTranslation();
    const handleDelete = onDelete || onRemove;

    return (
        <div className="bg-white border-2 border-black hover:border-black hover:scale-[1.02] transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Status bar */}
            <div className="h-1.5 bg-neutral-100 group-hover:bg-yellow-400 transition-colors border-b-2 border-black" />

            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {index !== undefined && (
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-400 border-2 border-black text-black text-sm font-black flex-shrink-0">
                                {index + 1}
                            </span>
                        )}
                        <span className="text-sm font-black uppercase truncate text-black group-hover:text-yellow-600 transition-colors">
                            {task.taskName}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                        {onView && (
                            <Tooltip title={t('common.view')}>
                                <button
                                    type="button"
                                    onClick={() => onView(task)}
                                    className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <Eye className="w-4 h-4 text-yellow-400" />
                                </button>
                            </Tooltip>
                        )}
                        {onEdit && (
                            <Tooltip title={t('common.edit')}>
                                <button
                                    type="button"
                                    onClick={() => onEdit(task)}
                                    className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-neutral-100 hover:scale-110 transition-all"
                                >
                                    <Pencil className="w-4 h-4 text-black" />
                                </button>
                            </Tooltip>
                        )}
                        {(onDelete || onRemove) && (
                            <Tooltip title={onRemove ? t('common.remove') : t('common.delete')}>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(onRemove ? task.id : task)}
                                    className="w-8 h-8 bg-red-500 border-2 border-red-600 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all"
                                >
                                    <Trash2 className="w-4 h-4 text-white" />
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
