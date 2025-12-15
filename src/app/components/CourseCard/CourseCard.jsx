import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Award } from 'lucide-react';

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
    <div className="group cursor-pointer bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 hover:border-cyan-200 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center">
            <Award className="w-12 h-12 text-cyan-400" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Corner badges */}
        {(level || duration) && (
          <div className="absolute left-2 top-2 flex gap-2">
            {level && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/95 backdrop-blur-sm text-slate-700 border border-slate-200/60 shadow-sm">
                {level}
              </span>
            )}
            {duration && (
              <span className="px-2.5 py-1 inline-flex items-center gap-1 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/50">
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
          <div className="text-xs text-cyan-600 font-medium mb-1.5">{provider}</div>
        )}
        <h3 className="text-slate-900 font-semibold leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-700 transition-colors">
          {title}
        </h3>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border border-slate-200"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-cyan-50 text-cyan-600 border border-cyan-200">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}