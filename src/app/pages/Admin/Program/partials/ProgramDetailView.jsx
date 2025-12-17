import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Empty, Skeleton } from "antd";
import { fetchCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";
import CourseCard from "./CourseCard";
import AssignCourseModal from "./AssignCourseModal";
import dayjs from "dayjs";
import { BookOpen, Calendar, Clock, FileText } from "lucide-react";

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

        {/* Main Image */}
        <div className="md:col-span-1">
          <div className="aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden">
            <img
              src={program.imageUrl}
              alt={program.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Info & Description */}
        <div className="md:col-span-2 space-y-6">
          {/* Metadata Grid - Industrial Style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 border-l-4 border-yellow-400 bg-neutral-50">
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">
                <BookOpen className="w-3 h-3" />
                {t('admin.programs.totalCourses')}
              </div>
              <div className="font-black text-3xl text-black">{program.totalCourses || 0}</div>
            </div>
            {program.createdAt && (
              <div className="p-4 border-l-4 border-neutral-300 bg-neutral-50">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-3 h-3" />
                  Created At
                </div>
                <div className="text-sm font-semibold text-black">{dayjs(program.createdAt).format(dateFormat)}</div>
              </div>
            )}
            {program.updatedAt && (
              <div className="p-4 border-l-4 border-neutral-300 bg-neutral-50">
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  <Clock className="w-3 h-3" />
                  Updated At
                </div>
                <div className="text-sm font-semibold text-black">{dayjs(program.updatedAt).format(dateFormat)}</div>
              </div>
            )}
          </div>

          {/* Description - Industrial Style */}
          <div className="border-t-2 border-neutral-200 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-black m-0 uppercase tracking-wider">
                {t('admin.programs.form.description')}
              </h3>
            </div>
            <div className="text-neutral-700 leading-relaxed whitespace-pre-line">
              {program.description || <span className="text-neutral-400 italic">No description provided.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="border-t-2 border-black pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-yellow-400" />
            <h3 className="text-xl font-bold text-black m-0 uppercase tracking-wider">
              {t('admin.programs.courses')}
            </h3>
            <span className="px-2 py-1 bg-yellow-400 text-black font-bold text-sm">
              {courses.length}
            </span>
          </div>
          <AssignCourseModal program={program} onAssigned={() => {
            setLoadingCourses(true);
            fetchCoursesByProgram(program.id)
              .then((data) => setCourses(data.items || []))
              .catch(() => setCourses([]))
              .finally(() => setLoadingCourses(false));
          }} />
        </div>

        {loadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-neutral-200 p-4">
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-neutral-200 hover:border-yellow-400 hover:shadow-lg transition-all group"
              >
                <CourseCard course={course} embedded={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-neutral-300 p-12 text-center">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">{t('admin.programs.noCoursesAssigned')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailView;