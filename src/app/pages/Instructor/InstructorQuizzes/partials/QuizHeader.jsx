import React from 'react';
import { ChevronRight, Plus, FileSpreadsheet } from 'lucide-react';

export default function QuizHeader({ total, onCreate, onImport }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                    <span className="uppercase tracking-wider text-xs">Instructor</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="uppercase tracking-wider text-xs">Quizzes</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Quizzes Management
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl">
                    View and manage all quizzes.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onImport}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    <FileSpreadsheet className="w-5 h-5" />
                    <span>Import from Excel</span>
                </button>
                <button
                    onClick={onCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create Quiz</span>
                </button>
                <div className="hidden md:block text-right px-6 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{total}</div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Quizzes</div>
                </div>
            </div>
        </div>
    );
}
