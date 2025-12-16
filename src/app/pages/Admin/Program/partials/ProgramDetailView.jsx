import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Divider, Empty, Skeleton } from "antd";
import { fetchCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";
import CourseCard from "./CourseCard";
import AssignCourseModal from "./AssignCourseModal";
import dayjs from "dayjs";

const ProgramDetailView = ({ program, loading }) => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (program?.id) {
      setLoadingCourses(true);
      fetchCoursesByProgram(program.id)
        .then((data) => {
          setCourses(data.items || []);
        })
        .catch((err) => {
          console.error('Failed to fetch courses:', err);
          setCourses([]);
        })
        .finally(() => {
          setLoadingCourses(false);
        });
    }
  }, [program?.id]);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!program) {
    return <Empty description={t('admin.programs.noData')} />;
  }

  const dateFormat = "YYYY-MM-DD HH:mm";

  return (
    <div className="space-y-8">
      
      {/* Top Section: Image & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Image - Sharp corners */}
        <div className="md:col-span-1">
          <div className="aspect-video bg-slate-100 shadow-sm">
            <img
              src={program.imageUrl}
              alt={program.name}
              className="w-full h-full object-cover" // Removed rounded-lg
            />
          </div>
        </div>
        
        {/* Info & Description */}
        <div className="md:col-span-2 space-y-6">
          {/* Metadata Grid - No Border */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
             <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('admin.programs.totalCourses')}</div>
                <div className="font-semibold text-2xl text-slate-700">{program.totalCourses || 0}</div>
             </div>
             {program.createdAt && (
                <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Created At</div>
                    <div className="text-sm font-medium text-slate-700 mt-1">{dayjs(program.createdAt).format(dateFormat)}</div>
                </div>
             )}
             {program.updatedAt && (
                <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Updated At</div>
                    <div className="text-sm font-medium text-slate-700 mt-1">{dayjs(program.updatedAt).format(dateFormat)}</div>
                </div>
             )}
          </div>

          <Divider className="my-4" />

          {/* Description - No Border */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{t('admin.programs.form.description')}</h3>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
              {program.description || <span className="text-slate-400 italic">No description provided.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 m-0">{t('admin.programs.courses')}</h3>
            <AssignCourseModal program={program} onAssigned={() => {
                setLoadingCourses(true);
                fetchCoursesByProgram(program.id)
                .then((data) => setCourses(data.items || []))
                .catch(() => setCourses([]))
                .finally(() => setLoadingCourses(false));
            }} />
        </div>

        {loadingCourses ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white hover:bg-slate-50 transition-colors group">
                 <CourseCard course={course} embedded={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 p-8 text-center text-slate-500">
             {t('admin.programs.noCoursesAssigned')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailView;