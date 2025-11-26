import React from 'react';
import { Eye, Pencil, Trash2, Clock } from 'lucide-react';
import { Popconfirm, Tooltip } from 'antd';

export default function QuizTable({ quizzes, page, pageSize, onView, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/30">
                        <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest w-20">#</th>
                        <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                        <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Pass (pts)</th>
                        <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Time (min)</th>
                        <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Total Score</th>
                        <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {quizzes.map((record, idx) => (
                        <tr
                            key={record.id}
                            className="group hover:bg-blue-50/30 transition-colors duration-300"
                        >
                            {/* Index */}
                            <td className="px-8 py-6 text-center">
                                <span className="text-sm font-bold text-gray-500">
                                    {(page - 1) * pageSize + idx + 1}
                                </span>
                            </td>

                            {/* Name */}
                            <td className="px-8 py-6">
                                <div className="min-w-0">
                                    <button
                                        onClick={() => onView(record)}
                                        className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate mb-1 text-left"
                                    >
                                        {record.name}
                                    </button>
                                </div>
                            </td>

                            {/* Pass Score */}
                            <td className="px-8 py-6 text-center">
                                <span className="inline-flex px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold border border-gray-200">
                                    {record.passScoreCriteria}
                                </span>
                            </td>

                            {/* Time Limit */}
                            <td className="px-8 py-6 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                                    <Clock className="h-4 w-4" />
                                    <span>{record.timelimitMinute}m</span>
                                </div>
                            </td>

                            {/* Total Score */}
                            <td className="px-8 py-6 text-center">
                                <span className="text-lg font-bold text-gray-900">{record.totalScore}</span>
                            </td>

                            {/* Actions */}
                            <td className="px-8 py-6 text-center">
                                <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <Tooltip title="View Details">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onView(record);
                                            }}
                                            className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Edit Quiz">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(record);
                                            }}
                                            className="p-2 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white hover:shadow-lg hover:shadow-amber-600/20 transition-all duration-300"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title="Delete Quiz">
                                        <Popconfirm
                                            title="Delete Quiz"
                                            description={`Are you sure you want to delete "${record.name}"?`}
                                            onConfirm={(e) => {
                                                e?.stopPropagation();
                                                onDelete(record);
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-600/20 transition-all duration-300"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </Popconfirm>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
