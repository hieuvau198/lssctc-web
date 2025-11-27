import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, Trash2, FileText, Video, Edit } from 'lucide-react';
import { App, Tooltip } from 'antd';
import { deleteMaterial } from '../../../../apis/Instructor/InstructorMaterialsApi';
import DrawerView from './DrawerView';

export default function MaterialsList({ materials = [], type = 'doc', onDelete }) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const { modal, message } = App.useApp();

    const total = materials.length;
    const totalPages = Math.ceil(total / pageSize) || 1;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (page > 3) {
                pages.push('...');
            }
            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);
            if (page <= 3) {
                end = 4;
            }
            if (page >= totalPages - 2) {
                start = totalPages - 3;
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        return pages;
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleDelete = async (material) => {
        modal.confirm({
            title: 'Delete Material',
            content: `Are you sure you want to delete "${material.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setDeleting(true);
                    await deleteMaterial(material.id);
                    message.success('Material deleted successfully');
                    onDelete?.();
                } catch (e) {
                    console.error('Delete material error', e);
                    message.error(e?.message || 'Failed to delete material');
                } finally {
                    setDeleting(false);
                }
            },
        });
    };

    const currentData = materials.slice((page - 1) * pageSize, page * pageSize);

    if (!materials || materials.length === 0) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
                {type === 'doc' ? (
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                ) : (
                    <Video className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                )}
                <p className="text-slate-600 font-medium">No {type === 'doc' ? 'documents' : 'videos'} found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/30">
                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest w-20">#</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {currentData.map((m, idx) => (
                            <tr
                                key={m.id}
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
                                        <div
                                            className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate mb-1 cursor-pointer"
                                            onClick={() => { setSelectedMaterial(m); setDrawerVisible(true); }}
                                        >
                                            {m.name}
                                        </div>
                                    </div>
                                </td>

                                {/* Description */}
                                <td className="px-8 py-6">
                                    <p className="text-sm text-gray-500 truncate max-w-xs font-medium">
                                        {m.description || 'No description'}
                                    </p>
                                </td>

                                {/* Type */}
                                <td className="px-8 py-6 text-center">
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${type === 'doc'
                                        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20'
                                        : 'bg-blue-100 text-blue-800 ring-1 ring-blue-600/20'
                                        }`}>
                                        {type === 'doc' ? <FileText className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                                        {type === 'doc' ? 'Document' : 'Video'}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-8 py-6 text-center">
                                    <div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <Tooltip title={type === 'doc' ? "View Document" : "Watch Video"}>
                                            <button
                                                onClick={() => { setSelectedMaterial(m); setDrawerVisible(true); }}
                                                className="p-3 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <button
                                                onClick={() => navigate(`/instructor/materials/edit/${m.id}`)}
                                                className="p-3 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white hover:shadow-lg hover:shadow-amber-600/20 transition-all duration-300"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <button
                                                onClick={() => handleDelete(m)}
                                                className="p-3 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-600/20 transition-all duration-300"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-end gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2.5 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-gray-500 transition-all duration-200"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-1 bg-white/50 p-1 rounded-xl border border-gray-100">
                        {getPageNumbers().map((p, index) => (
                            typeof p === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center ${p === page
                                        ? 'bg-blue-600 !text-white shadow-lg shadow-blue-600/30 scale-105'
                                        : 'text-gray-500 hover:bg-blue-500 hover:text-white hover:shadow-md active:text-white'
                                        }`}
                                >
                                    {p}
                                </button>
                            ) : (
                                <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-300 font-bold select-none">...</span>
                            )
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2.5 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-gray-500 transition-all duration-200"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <DrawerView visible={drawerVisible} onClose={() => setDrawerVisible(false)} material={selectedMaterial} />
        </div>
    );
}
