// src\app\pages\SimManager\Practices\Practices.jsx
import React, { useEffect, useState } from 'react';
import { getPractices, deletePractice } from '../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { Link } from 'react-router-dom';
import { Clock, Zap, BookOpen, Eye, ChevronLeft, ChevronRight, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Practices() {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, totalCount: 0, totalPages: 1 });
  const [deleting, setDeleting] = useState(null); // ID of practice being deleted
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // ID of practice to confirm delete
  const [modalType, setModalType] = useState(null); // 'success', 'error', or null
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getPractices(pageNumber, pageSize)
      .then((data) => {
        setPractices(data.items);
        setMeta({
          page: data.page,
          pageSize: data.pageSize,
          totalCount: data.totalCount,
          totalPages: data.totalPages || 1,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching practices:', err);
        setError('Could not fetch practices');
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [pageNumber, pageSize]);

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
    if (meta.totalPages <= 7) {
      for (let i = 1; i <= meta.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (pageNumber > 3) {
        pages.push('...');
      }
      let start = Math.max(2, pageNumber - 1);
      let end = Math.min(meta.totalPages - 1, pageNumber + 1);
      if (pageNumber <= 3) {
        end = 4;
      }
      if (pageNumber >= meta.totalPages - 2) {
        start = meta.totalPages - 3;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (pageNumber < meta.totalPages - 2) {
        pages.push('...');
      }
      pages.push(meta.totalPages);
    }
    return pages;
  };

  const handleDelete = (id, name) => {
    setDeleting(id);
    deletePractice(id)
      .then(() => {
        setModalMessage(`Practice "${name}" deleted successfully!`);
        setModalType("success");
        setDeleting(null);
        setShowDeleteConfirm(null);
        // Refresh the list
        setTimeout(() => {
          setPageNumber(1);
        }, 1500);
      })
      .catch((err) => {
        let errorMsg = "Delete failed. Please try again.";
        
        // Handle new API error format
        if (err.response?.data?.error) {
          const error = err.response.data.error;
          if (error.details?.exceptionMessage) {
            errorMsg = error.details.exceptionMessage;
          } else if (error.message) {
            errorMsg = error.message;
          }
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        setModalMessage(errorMsg);
        setModalType("error");
        setDeleting(null);
        setShowDeleteConfirm(null);
      });
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

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (practices.length === 0) {
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
            <span className="uppercase tracking-wider text-xs">Sim Manager</span>
            <ChevronRight className="h-4 w-4" />
            <span className="uppercase tracking-wider text-xs">Practices</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Practice Library
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Manage your simulation scenarios and training modules with ease.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right px-6 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{meta.totalCount}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Modules</div>
          </div>
          <Link
            to="./create"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Practice</span>
          </Link>
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
                      {(pageNumber - 1) * pageSize + idx + 1}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-8 py-6">
                    <div className="min-w-0">
                      <Link
                        to={`../practices/${p.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate mb-1"
                      >
                        {p.practiceName}
                      </Link>
                      <p className="text-sm text-gray-500 truncate max-w-xs font-medium">
                        {p.practiceDescription || "No description provided"}
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
                      <button
                        onClick={() => setShowDeleteConfirm(p.id)}
                        disabled={deleting === p.id}
                        className="p-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300 disabled:opacity-50"
                        title="Delete Practice"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span>Showing</span>
            <span className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-900 font-bold text-xs">
              {(pageNumber - 1) * pageSize + 1}-{Math.min(pageNumber * pageSize, meta.totalCount)}
            </span>
            <span>of</span>
            <span className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-900 font-bold text-xs">
              {meta.totalCount}
            </span>
            <span>results</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber === 1}
              className="p-2.5 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-gray-500 transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1 bg-white/50 p-1 rounded-xl border border-gray-100">
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => setPageNumber(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center ${
                      page === pageNumber
                        ? 'bg-blue-600 !text-white shadow-lg shadow-blue-600/30 scale-105'
                        : 'text-gray-500 hover:bg-blue-500 hover:text-white hover:shadow-md active:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-300 font-bold select-none">...</span>
                )
              ))}
            </div>

            <button
              onClick={() => setPageNumber(Math.min(meta.totalPages, pageNumber + 1))}
              disabled={pageNumber === meta.totalPages}
              className="p-2.5 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-gray-500 transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform scale-100 animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center shadow-inner">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Delete Practice?</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Are you sure you want to delete this practice? <br/>
                  This action cannot be undone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deleting}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const practice = practices.find(p => p.id === showDeleteConfirm);
                    handleDelete(showDeleteConfirm, practice?.practiceName || 'Practice');
                  }}
                  disabled={deleting}
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 hover:shadow-red-600/40 disabled:opacity-50 transition-all duration-200"
                >
                  {deleting === showDeleteConfirm ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {modalType === "success" && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform scale-100 animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center shadow-inner">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                <p className="text-gray-500 font-medium">{modalMessage}</p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="w-full px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {modalType === "error" && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform scale-100 animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center shadow-inner">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Error</h3>
                <p className="text-gray-500 font-medium">{modalMessage}</p>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="w-full px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
