import React from 'react';

export default function CourseCard({ course }) {
  const {
    title,
    provider,
    level,
    duration,
    thumbnail,
    tags = [],
  } = course ?? {};

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100" />
        )}

        {/* Corner badges */}
        {(level || duration) && (
          <div className="absolute left-2 top-2 flex gap-2">
            {level && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/90 text-slate-700 border border-slate-200 shadow-sm">
                {level}
              </span>
            )}
            {duration && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-600/90 text-white shadow-sm">
                {duration}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        {provider && (
          <div className="text-xs text-slate-500 mb-1">{provider}</div>
        )}
        <h3 className="text-slate-900 font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
          {title}
        </h3>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 border border-slate-200"
              >
                {t}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-600 border border-slate-200">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            Enroll
          </button>
          <button
            type="button"
            className="text-blue-700 hover:text-blue-800 text-sm font-medium"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}