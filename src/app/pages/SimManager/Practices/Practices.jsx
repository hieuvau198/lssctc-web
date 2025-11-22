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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Advanced':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getDifficultyIcon = (level) => {
    switch (level) {
      case 'Entry':
        return '⭐';
      case 'Intermediate':
        return '⭐⭐';
      case 'Advanced':
        return '⭐⭐⭐';
      default:
        return '○';
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulation Practices</h1>
          <p className="text-gray-600 mt-1">Manage and view all available practice modules</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{meta.totalCount}</div>
            <p className="text-gray-600 text-sm">Total Practices</p>
          </div>
          <Link
            to="./create"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Create Practice
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Practice Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Code</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Duration</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Difficulty</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Max Attempts</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {practices.map((p, idx) => (
                <tr key={p.id} className="hover:bg-blue-50 transition-colors duration-150">
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{idx + 1}</span>
                      </div>
                      <div>
                        <Link
                          to={`../practices/${p.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          {p.practiceName}
                        </Link>
                        {p.practiceDescription && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.practiceDescription}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Code */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {p.practiceCode}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{p.estimatedDurationMinutes}</span>
                      <span className="text-gray-500">min</span>
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(p.difficultyLevel)}`}>
                      <span>{getDifficultyIcon(p.difficultyLevel)}</span>
                      <span>{p.difficultyLevel}</span>
                    </div>
                  </td>

                  {/* Max Attempts */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>{p.maxAttempts}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      p.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}>
                      <span className={`h-2 w-2 rounded-full mr-2 ${p.isActive ? 'bg-green-600' : 'bg-gray-600'}`}></span>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`../practices/${p.id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-150 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(p.id)}
                        disabled={deleting === p.id}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{meta.totalCount}</span> practices found • 
          <span className="font-semibold text-gray-900 ml-1">Page {meta.page}</span> of 
          <span className="font-semibold text-gray-900 ml-1">{meta.totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber === 1}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-1 px-2">
            {/* First page */}
            {pageNumber > 3 && (
              <>
                <button
                  onClick={() => setPageNumber(1)}
                  className="w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-150 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  1
                </button>
                {pageNumber > 4 && <span className="text-gray-500">...</span>}
              </>
            )}

            {/* Current range */}
            {Array.from({ length: Math.min(5, meta.totalPages) }).map((_, i) => {
              let page;
              if (meta.totalPages <= 5) {
                page = i + 1;
              } else if (pageNumber <= 3) {
                page = i + 1;
              } else if (pageNumber >= meta.totalPages - 2) {
                page = meta.totalPages - 4 + i;
              } else {
                page = pageNumber - 2 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => setPageNumber(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    page === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Last page */}
            {pageNumber < meta.totalPages - 2 && (
              <>
                {pageNumber < meta.totalPages - 3 && <span className="text-gray-500">...</span>}
                <button
                  onClick={() => setPageNumber(meta.totalPages)}
                  className="w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-150 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {meta.totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setPageNumber(Math.min(meta.totalPages, pageNumber + 1))}
            disabled={pageNumber === meta.totalPages}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-sm font-medium"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Practice</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Are you sure you want to delete this practice? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const practice = practices.find(p => p.id === showDeleteConfirm);
                      handleDelete(showDeleteConfirm, practice?.practiceName || 'Practice');
                    }}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === showDeleteConfirm ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {modalType === "success" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success</h3>
                <p className="text-gray-600 text-sm mb-4">{modalMessage}</p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {modalType === "error" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600 text-sm mb-4">{modalMessage}</p>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
