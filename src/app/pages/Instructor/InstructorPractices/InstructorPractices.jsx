import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getPractices } from '../../../apis/Instructor/InstructorPractice';

export default function InstructorPractices() {
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const nav = useNavigate();

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const res = await getPractices({ page: p, pageSize: ps });
      setPractices(res.items || []);
      setTotal(res.totalCount || 0);
    } catch (e) {
      console.error('Failed to load practices', e);
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Entry':
        return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20';
      case 'Advanced':
        return 'bg-rose-100 text-rose-800 ring-1 ring-rose-600/20';
      default:
        return 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20';
    }
  };

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
    load(newPage, pageSize);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practices...</p>
        </div>
      </div>
    );
  }

  if (!practices || practices.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
        <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">No practices found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
            <span className="uppercase tracking-wider text-xs">Instructor</span>
            <ChevronRight className="h-4 w-4" />
            <span className="uppercase tracking-wider text-xs">Practices</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Practices Management
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            View and manage all teaching practices.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right px-6 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Modules</div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest w-20">#</th>
                <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Practice Name</th>
                <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Code</th>
                <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</th>
                <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Difficulty</th>
                <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Attempts</th>
                <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {practices.map((p, idx) => (
                <tr 
                  key={p.id} 
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
                      <Link
                        to={`/instructor/practices/${p.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate mb-1"
                      >
                        {p.practiceName}
                      </Link>
                      <p className="text-sm text-gray-500 truncate max-w-xs font-medium">
                        {p.practiceCode}
                      </p>
                    </div>
                  </td>

                  {/* Code */}
                  <td className="px-8 py-6">
                    <span className="inline-flex px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm font-mono font-medium border border-gray-200">
                      {p.practiceCode}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                      <Clock className="h-4 w-4" />
                      <span>{p.estimatedDurationMinutes}m</span>
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getDifficultyColor(p.difficultyLevel)}`}>
                      {p.difficultyLevel}
                    </span>
                  </td>

                  {/* Max Attempts */}
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-900">{p.maxAttempts}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Max Tries</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${
                      p.isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${p.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Link
                        to={`/instructor/practices/${p.id}`}
                        className="p-3 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
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
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center ${
                      p === page
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
      </div>
    </div>
  );
}
