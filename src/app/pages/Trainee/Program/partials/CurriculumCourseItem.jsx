import React, { useEffect, useState } from 'react';
import { fetchCourseDetail } from '../../../../apis/Trainee/TraineeProgramApi';
import { Skeleton } from 'antd';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

/**
 * CurriculumCourseItem - Industrial Style
 * Displays a single course row with:
 * - Thumbnail left (square)
 * - Title + meta (Course X • Y hours)
 * - Toggle to expand short description
 */
export default function CurriculumCourseItem({ courseId, order }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCourseDetail(courseId)
      .then((d) => { setCourse(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [courseId]);

  if (loading) {
    return (
      <div className="py-5 flex gap-6 items-start border-b-2 border-neutral-200">
        <div className="w-24 h-16 bg-neutral-200 overflow-hidden flex items-center justify-center">
          <Skeleton.Image active className="!w-full !h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <Skeleton active paragraph={{ rows: 2 }} className="max-w-xl" />
        </div>
        <div className="w-10 flex justify-end">
          <Skeleton.Button active size="small" style={{ width: 32 }} />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="py-5 text-sm text-red-500 border-b-2 border-neutral-200">Failed to load course (ID {courseId}).</div>
    );
  }

  const hours = course.durationHours != null ? `${course.durationHours} hours` : '';

  return (
    <div className="border-b-2 border-neutral-200 last:border-b-0 group">
      <div className="py-5 flex gap-6 items-start">
        {/* Order badge */}
        <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center flex-shrink-0 font-black text-xl text-black">
          {order}
        </div>

        {/* Thumbnail */}
        <div className="w-24 h-16 overflow-hidden bg-neutral-200 flex-shrink-0 border-2 border-neutral-900">
          {course.imageUrl && (
            <img src={course.imageUrl} alt={course.name} className="object-cover w-full h-full" loading="lazy" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <button
            type="button"
            className="text-left block w-full"
            onClick={() => setOpen(o => !o)}
          >
            <h4 className="text-lg font-black uppercase mb-1 text-neutral-900 group-hover:text-yellow-600 transition-colors">
              {course.name}
            </h4>
            <div className="flex items-center gap-3 text-sm text-neutral-500 uppercase tracking-wider font-semibold">
              <span>Course {order}</span>
              {hours && (
                <>
                  <span className="h-1 w-1 rounded-full bg-neutral-400" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {hours}
                  </span>
                </>
              )}
            </div>
          </button>
          {open && (
            <p className="text-sm text-neutral-600 mt-3 leading-relaxed max-w-2xl">{course.description}</p>
          )}
        </div>

        {/* Toggle button */}
        <button
          type="button"
          className="w-10 h-10 border-2 border-neutral-900 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all cursor-pointer"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
