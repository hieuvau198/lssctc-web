import React from "react";
import { useTranslation } from 'react-i18next';
import { Pagination } from "antd";
import { Eye, BookOpen, Clock, ChevronRight } from "lucide-react";

// Individual Card component with Industrial Theme
const ProgramCard = ({ program, onView }) => {
  const { t } = useTranslation();

  return (
    <div className="group bg-white border-2 border-black overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Yellow accent bar */}
      <div className="h-1 bg-yellow-400" />

      {/* Image */}
      <div
        className="h-44 overflow-hidden cursor-pointer relative"
        onClick={() => onView(program)}
      >
        {program.imageUrl ? (
          <img
            alt={program.name}
            src={program.imageUrl}
            className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-neutral-400" />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
            <Eye className="w-5 h-5" />
            {t('common.viewDetails')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Status badge & Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-bold text-black line-clamp-2 flex-1 cursor-pointer hover:text-yellow-600 transition-colors text-lg"
            onClick={() => onView(program)}
          >
            {program.name}
          </h3>
          <span className={`shrink-0 inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 ${program.isActive
            ? 'bg-green-50 text-green-700 border-green-300'
            : 'bg-red-50 text-red-700 border-red-300'
            }`}>
            {program.isActive ? t('common.active') : t('common.inactive')}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
          {program.description || t('admin.programs.noDescription')}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 pt-3 border-t-2 border-neutral-100">
          {program.durationHours && (
            <div className="flex items-center gap-1 text-sm text-neutral-600">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{program.durationHours}h</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-neutral-600">
            <BookOpen className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{program.totalCourses || 0} {t('admin.programs.courses')}</span>
          </div>
        </div>
      </div>

      {/* Footer action */}
      <button
        onClick={() => onView(program)}
        className="w-full py-3 bg-neutral-100 text-black font-bold uppercase text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors border-t-2 border-black"
      >
        {t('common.viewDetails')}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Card View component
const ProgramCardView = ({
  programs,
  pageNumber,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  deletingId
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onView={onView}
          />
        ))}
      </div>

      {/* Pagination with Industrial styling */}
      <div className="flex justify-center mt-8">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={true}
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) => t('admin.programs.pagination', { start: range[0], end: range[1], total })}
          className="industrial-pagination"
        />
      </div>

      {/* Industrial Pagination Styles */}
      <style>{`
        .industrial-pagination .ant-pagination-item-active {
          background-color: #facc15 !important;
          border-color: #000 !important;
          border-width: 2px !important;
        }
        .industrial-pagination .ant-pagination-item-active a {
          color: #000 !important;
          font-weight: 700 !important;
        }
        .industrial-pagination .ant-pagination-item {
          border: 2px solid #d4d4d4 !important;
          border-radius: 0 !important;
        }
        .industrial-pagination .ant-pagination-item:hover {
          border-color: #000 !important;
        }
        .industrial-pagination .ant-pagination-prev button,
        .industrial-pagination .ant-pagination-next button {
          border: 2px solid #d4d4d4 !important;
          border-radius: 0 !important;
        }
        .industrial-pagination .ant-pagination-prev:hover button,
        .industrial-pagination .ant-pagination-next:hover button {
          border-color: #000 !important;
        }
      `}</style>
    </>
  );
};

export default ProgramCardView;