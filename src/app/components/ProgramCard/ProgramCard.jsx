import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProgramCard = ({ program, onClick }) => {
  const { t } = useTranslation();
  const { name, imageUrl, totalCourses, isActive, description } = program || {};

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border-2 border-neutral-900 hover:border-yellow-400 overflow-hidden transition-all duration-300 flex flex-col h-full"
    >
      {/* Status indicator bar */}
      <div className={`h-2 ${isActive ? 'bg-yellow-400' : 'bg-neutral-300'}`} />

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
          <div className="h-full w-full bg-neutral-100 flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-neutral-300" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isActive
            ? 'bg-yellow-400 text-black'
            : 'bg-neutral-700 text-white'
            }`}>
            {isActive ? t('common.active') : t('common.inactive')}
          </span>
        </div>

        {/* Course count badge */}
        {totalCourses != null && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-bold bg-white text-black uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              {totalCourses} {t('sidebar.courses')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-black text-neutral-900 line-clamp-2 min-h-[2.5rem] uppercase group-hover:text-yellow-600 transition-colors">
          {name}
        </h3>

        {description && (
          <p className="text-xs text-neutral-500 line-clamp-2 mt-2 flex-1">{description}</p>
        )}

        {/* Bottom action hint */}
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <span className="text-xs font-bold text-neutral-900 group-hover:text-yellow-600 inline-flex items-center gap-1 uppercase tracking-wider">
            {t('common.viewDetails', 'Xem chi tiết')}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
