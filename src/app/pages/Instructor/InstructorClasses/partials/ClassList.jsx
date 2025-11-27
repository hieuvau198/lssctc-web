import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Calendar, Users, Clock } from "lucide-react";
import ClassCard from "./ClassCard";

const ClassTableView = ({ classes, onView, pageNumber, pageSize, total, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize) || 1;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (pageNumber > 3) {
        pages.push('...');
      }
      let start = Math.max(2, pageNumber - 1);
      let end = Math.min(totalPages - 1, pageNumber + 1);
      if (pageNumber <= 3) {
        end = 4;
      }
      if (pageNumber >= totalPages - 2) {
        start = totalPages - 3;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (pageNumber < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/30">
              <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest w-20">#</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Class Name</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Code</th>
              <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</th>
              <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">End Date</th>
              <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Trainees</th>
              <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {classes.map((c, idx) => (
              <tr
                key={c.id || c.classId}
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
                    <div
                      onClick={() => onView(c)}
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate mb-1 cursor-pointer"
                    >
                      {c.name || c.className || "Mobile Crane Training"}
                    </div>
                  </div>
                </td>

                {/* Code */}
                <td className="px-8 py-6">
                  <span className="inline-flex px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm font-mono font-medium border border-gray-200">
                    {c.classCode}
                  </span>
                </td>

                {/* Start Date */}
                <td className="px-8 py-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                    <Calendar className="h-4 w-4" />
                    <span>{c.startDate ? new Date(c.startDate).toLocaleDateString() : "-"}</span>
                  </div>
                </td>

                {/* End Date */}
                <td className="px-8 py-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-bold">
                    <Calendar className="h-4 w-4" />
                    <span>{c.endDate ? new Date(c.endDate).toLocaleDateString() : "-"}</span>
                  </div>
                </td>

                {/* Trainees */}
                <td className="px-8 py-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-lg font-bold text-gray-900">{c.traineeCount ?? 0}</span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-8 py-6 text-center">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${c.status === 'Active' || c.status === 1 || c.status === '1'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                    <span className={`h-2 w-2 rounded-full ${c.status === 'Active' || c.status === 1 || c.status === '1' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    {c.status === 1 || c.status === '1' ? 'Active' : (c.status ?? "Inactive")}
                  </span>
                </td>

                {/* Action */}
                <td className="px-8 py-6 text-center">
                  <div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => onView(c)}
                      className="p-3 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
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
            onClick={() => onPageChange(Math.max(1, pageNumber - 1), pageSize)}
            disabled={pageNumber === 1}
            className="p-2.5 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-gray-500 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1 bg-white/50 p-1 rounded-xl border border-gray-100">
            {getPageNumbers().map((p, index) => (
              typeof p === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(p, pageSize)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center ${p === pageNumber
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
            onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1), pageSize)}
            disabled={pageNumber === totalPages}
            className="p-2.5 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-gray-500 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component
export default function ClassList({
  classes = [],
  viewMode = "table",
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onView,
}) {
  if (!classes || classes.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
        <Users className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">No classes found</p>
      </div>
    );
  }

  return (
    <div>
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id || classItem.classId}
              classItem={classItem}
              onView={onView}
            />
          ))}
        </div>
      ) : (
        <ClassTableView
          classes={classes}
          onView={onView}
          pageNumber={pageNumber}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}