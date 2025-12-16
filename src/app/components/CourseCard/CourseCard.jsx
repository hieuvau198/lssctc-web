import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Award, ChevronRight } from 'lucide-react';

export default function CourseCard({ course }) {
  const { t } = useTranslation();
  const {
    title,
    provider,
    level,
    duration,
    thumbnail,
    tags = [],
  } = course ?? {};

  return (
    <div className="group cursor-pointer bg-white border-2 border-neutral-900 hover:border-yellow-400 overflow-hidden transition-all duration-300">
      {/* Status indicator bar */}
      <div className="h-2 bg-neutral-100 group-hover:bg-yellow-400 transition-colors" />

      {/* Image Container */}
      <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100 flex items-center justify-center">
            <Award className="w-12 h-12 text-neutral-300" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Corner badges */}
        {(level || duration) && (
          <div className="absolute left-2 top-2 flex gap-2">
            {level && (
              <span className="px-3 py-1 text-xs font-bold bg-white text-black uppercase tracking-wider">
                {level}
              </span>
            )}
            {duration && (
              <span className="px-3 py-1 inline-flex items-center gap-1 text-xs font-bold bg-yellow-400 text-black uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                {duration} {t('common.hours')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {provider && (
          <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1.5">{provider}</div>
        )}
        <h3 className="text-neutral-900 font-black leading-snug line-clamp-2 min-h-[2.5rem] uppercase group-hover:text-yellow-600 transition-colors">
          {title}
        </h3>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-300 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-400 text-black uppercase tracking-wider">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View more hint */}
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <span className="text-xs font-bold text-neutral-900 group-hover:text-yellow-600 inline-flex items-center gap-1 uppercase tracking-wider">
            {t('common.viewDetails', 'Xem chi tiết')}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}