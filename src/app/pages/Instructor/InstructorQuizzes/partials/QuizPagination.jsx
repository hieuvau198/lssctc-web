import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuizPagination({ page, totalPages, onPageChange }) {
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

    return (
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
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
                                onClick={() => onPageChange(p)}
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
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2.5 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-gray-500 transition-all duration-200"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
