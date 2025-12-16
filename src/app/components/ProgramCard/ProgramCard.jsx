import { BookOpen, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProgramCard = ({ program, onClick }) => {
  const { t } = useTranslation();
  const { name, imageUrl, totalCourses, isActive, description } = program || {};

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white/90 backdrop-blur-sm border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 hover:border-cyan-200 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden">
        {imageUrl ? (
          <img
            alt={name}
            src={imageUrl}
            className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-cyan-400" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm shadow-sm ${isActive
              ? 'bg-emerald-500/90 text-white'
              : 'bg-slate-500/90 text-white'
            }`}>
            {isActive ? t('common.active') : t('common.inactive')}
          </span>
        </div>

        {/* Course count badge */}
        {totalCourses != null && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium bg-white/95 backdrop-blur-sm text-slate-700 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
              {totalCourses} {t('sidebar.courses')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-700 transition-colors">
          {name}
        </h3>

        {description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 flex-1">{description}</p>
        )}

        {/* Bottom action hint */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-medium text-cyan-600 group-hover:text-cyan-700 inline-flex items-center gap-1">
            {t('common.viewDetails', 'Xem chi tiết')}
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
