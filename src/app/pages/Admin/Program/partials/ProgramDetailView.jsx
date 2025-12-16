import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Tag, Divider, Empty, Skeleton, Image } from "antd";
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
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border h-64 md:h-auto shadow-sm">
            <img
              src={program.imageUrl}
              alt={program.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Display Background Image if exists */}
          {program.backgroundImageUrl && (
             <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-50 border relative shadow-sm">
                <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded z-10">Background</div>
                <img src={program.backgroundImageUrl} alt="Background" className="w-full h-full object-cover" />
             </div>
          )}
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-800">{program.name}</h3>
                <Tag color={program.isActive ? 'green' : 'red'}>
                {program.isActive ? t('common.active') : t('common.inactive')}
                </Tag>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border">
             <div>
                <div className="text-xs text-slate-500 font-medium uppercase">{t('admin.programs.totalCourses')}</div>
                <div className="font-semibold text-lg">{program.totalCourses || 0}</div>
             </div>
             {program.createdAt && (
                <div>
                    <div className="text-xs text-slate-500 font-medium uppercase">Created At</div>
                    <div className="text-sm">{dayjs(program.createdAt).format(dateFormat)}</div>
                </div>
             )}
             {program.updatedAt && (
                <div>
                    <div className="text-xs text-slate-500 font-medium uppercase">Updated At</div>
                    <div className="text-sm">{dayjs(program.updatedAt).format(dateFormat)}</div>
                </div>
             )}
          </div>

          <div>
            <div className="text-sm font-medium text-slate-800 mb-1">{t('admin.programs.form.description')}</div>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line bg-white p-3 border rounded-md max-h-40 overflow-auto">
              {program.description}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <Divider orientation="left">{t('admin.programs.courses')}</Divider>
        <div className="ml-3 mb-4">
          <AssignCourseModal program={program} onAssigned={() => {
            // refresh courses after assign
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-auto pr-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Empty description={t('admin.programs.noCoursesAssigned')} />
        )}
      </div>
    </div>
  );
};

export default ProgramDetailView;