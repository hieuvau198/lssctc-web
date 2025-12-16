import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { fetchCourseDetail } from "../../../../apis/ProgramManager/CourseApi";
import { Skeleton, Alert, Divider } from "antd";
import SectionList from './Sections/SectionList';
import CourseClassList from './CourseClassList';
import dayjs from "dayjs";

const CourseDetail = ({ id, onBack, course: providedCourse, embedded = false }) => {
  const { t } = useTranslation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (providedCourse) {
      setCourse(providedCourse);
      setLoading(false);
      return;
    }
    if (!id) return;
    setLoading(true);
    fetchCourseDetail(id)
      .then((data) => { setCourse(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id, providedCourse]);

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  const dateFormat = "YYYY-MM-DD HH:mm";

  return (
    <div className="flex flex-col gap-10"> 
      
      {/* TOP PART: Image and Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Column 1: Main Image (Sharp corners) */}
        <div className="md:col-span-1">
          <div className="aspect-video bg-slate-100 shadow-sm">
            <img
              src={course.imageUrl}
              alt={course.name}
              className="w-full h-full object-cover" // Removed rounded-lg
            />
          </div>
        </div>

        {/* Column 2: Metadata & Description */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Metadata Grid - Flat Design */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('common.category')}</div>
                <div className="font-semibold text-slate-700 mt-1">{course.category}</div>
            </div>
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('common.level')}</div>
                <div className="font-semibold text-slate-700 mt-1">{course.level}</div>
            </div>
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('common.duration')}</div>
                <div className="font-semibold text-slate-700 mt-1">{course.durationHours}h</div>
            </div>
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('common.price')}</div>
                <div className="font-semibold text-green-600 mt-1">${course.price?.toLocaleString()}</div>
            </div>
            
            {/* Date Fields */}
            {course.createdAt && (
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Created</div>
                <div className="text-sm font-medium text-slate-700 mt-1">{dayjs(course.createdAt).format(dateFormat)}</div>
            </div>
            )}
            {course.updatedAt && (
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Updated</div>
                <div className="text-sm font-medium text-slate-700 mt-1">{dayjs(course.updatedAt).format(dateFormat)}</div>
            </div>
            )}
          </div>

          <Divider className="my-4" />

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{t('common.description')}</h3>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
              {course.description || <span className="text-slate-400 italic">No description provided.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PART: Sections & Classes */}
      <div className="w-full space-y-12">
          {/* Sections List */}
          <div>
             {/* Note: Ensure SectionList also follows the flat style if needed, 
                 or wrap it here to control its container styling */}
             <SectionList courseId={course.id} />
          </div>

          {/* Class List */}
          <div>
             <CourseClassList courseId={course.id} />
          </div>
      </div>

    </div>
  );
};

export default CourseDetail;