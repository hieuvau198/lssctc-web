import React, { useEffect, useState } from 'react';
import { Skeleton, Typography } from 'antd';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  BarChart,
  Grid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCourseDetail } from '../../../../apis/ProgramManager/CourseApi';

const { Paragraph } = Typography;

const ClassCourseInfo = ({ courseId }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const data = await fetchCourseDetail(courseId);
      setCourse(data);
    } catch (error) {
      //   console.error("Failed to load parent course info", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="mt-8 border-2 border-neutral-100 p-6 bg-white">
      <Skeleton active paragraph={{ rows: 3 }} />
    </div>
  );

  if (!course) return null;

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-4 border-b-2 border-slate-200 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
            <BookOpen size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold uppercase tracking-wide text-slate-900">Parent Course</span>
        </div>
        <button
          onClick={() => navigate(`/admin/courses/${course.id}`)}
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 hover:text-black transition-colors"
        >
          View Full Details
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Course Card */}
      <div className="bg-white border-2 border-slate-200 hover:border-black transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Left: Course Image */}
          <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative bg-neutral-100 border-b-2 md:border-b-0 md:border-r-2 border-slate-200">
            <img
              src={course.imageUrl || '/placeholder-course.jpg'}
              alt={course.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image" }}
            />
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 ${course.isActive
                  ? 'bg-green-100 text-green-700 border-green-700'
                  : 'bg-red-100 text-red-700 border-red-700'
                }`}>
                {course.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Right: Course Details */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider mb-2 border border-black">
                {course.code || 'NO CODE'}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight uppercase">
                {course.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-slate-100 mb-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                  <Grid size={12} /> Category
                </div>
                <div className="font-semibold text-slate-700">{course.category || 'General'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                  <Clock size={12} /> Duration
                </div>
                <div className="font-semibold text-slate-700">{course.durationHours ? `${course.durationHours} hrs` : '-'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                  <BarChart size={12} /> Level
                </div>
                <div className="font-semibold text-slate-700">{course.level || '-'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                  <Layers size={12} /> Version
                </div>
                <div className="font-semibold text-slate-700">v{course.version || '1.0'}</div>
              </div>
            </div>

            <Paragraph
              ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
              className="text-slate-600 mb-0 font-medium leading-relaxed"
            >
              {course.description || "No description available for this course."}
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCourseInfo;