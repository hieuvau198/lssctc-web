import React, { useEffect, useState } from 'react';
import { fetchCourseDetail } from '../../../../apis/Trainee/TraineeProgramApi';
import { Skeleton } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

/**
 * CurriculumCourseItem
 * Displays a single course row similar to Coursera curriculum style:
 * - Thumbnail left (square)
 * - Title (underline) + meta (Course X • Y hours)
 * - Toggle to expand short description
 * Data is fetched individually to reuse existing API; consider batching later.
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
      <div className="py-5 flex gap-6 items-start">
        <div className="w-24 h-16 rounded-md bg-slate-200 overflow-hidden flex items-center justify-center">
          <Skeleton.Image active className="!w-full !h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <Skeleton active paragraph={{ rows: 2 }} className="max-w-xl" />
        </div>
        <div className="w-6 flex justify-end pr-1">
          <Skeleton.Button active size="small" style={{ width: 24 }} />
        </div>
      </div>
    );
  }
  if (error || !course) {
    return (
      <div className="py-5 text-sm text-red-500">Failed to load course (ID {courseId}).</div>
    );
  }

  const hours = course.durationHours != null ? `${course.durationHours} hours` : '';
  return (
    <div className="py-5 flex gap-6 items-start relative group">
      <div className="w-24 h-16 rounded-md overflow-hidden bg-slate-200 flex-shrink-0">
        {course.imageUrl && (
          <img src={course.imageUrl} alt={course.name} className="object-cover w-full h-full" loading="lazy" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <button
          type="button"
            className="text-left block w-full"
            onClick={() => setOpen(o => !o)}
        >
          <h4 className="text-lg font-semibold underline decoration-slate-400 underline-offset-4 mb-1 text-slate-800 hover:decoration-slate-600">{course.name}</h4>
          <div className="text-sm text-slate-600 mb-1">Course {order} {hours && <span className="mx-2">•</span>} {hours}</div>
        </button>
        {open && (
          <p className="text-sm text-slate-700 mt-1 leading-relaxed max-w-2xl">{course.description}</p>
        )}
      </div>
      <div className="w-6 flex justify-end pt-1 cursor-pointer text-slate-500" onClick={() => setOpen(o => !o)}>
        {open ? <UpOutlined /> : <DownOutlined />}
      </div>
    </div>
  );
}
