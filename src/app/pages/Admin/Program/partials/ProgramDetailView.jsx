import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from 'react-i18next';
import { Empty, Skeleton } from "antd";
import { fetchCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import AssignCourseModal from "./AssignCourseModal";
import dayjs from "dayjs";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import { BookOpen, Calendar, Clock, FileText, Layers } from "lucide-react";

/**
 * Industrial Style Metadata Card (matching CourseDetail)
 */
const InfoCard = ({ icon: Icon, label, value, highlight = false }) => (
  <div className={`p-4 border-2 ${highlight ? 'border-yellow-400 bg-yellow-50' : 'border-neutral-200 bg-white'} flex flex-col items-start gap-2 hover:border-black transition-colors group`}>
    <div className="flex items-center gap-2 text-neutral-500 group-hover:text-black transition-colors">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className={`text-lg font-bold ${highlight ? 'text-black' : 'text-neutral-800'}`}>
      {value}
    </div>
  </div>
);

/**
 * Industrial Section Header (matching CourseDetail)
 */
const SectionHeader = ({ icon: Icon, title, count, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Icon className="w-5 h-5 text-black" />
      </div>
      <span className="text-xl font-black uppercase tracking-tight text-neutral-900 m-0">
        {title}
      </span>
      {count !== undefined && (
        <span className="px-2 py-1 bg-yellow-400 text-black font-bold text-sm border-2 border-black">
          {count}
        </span>
      )}
    </div>
    {action}
  </div>
);

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



  return (
    <div className="flex flex-col gap-12 font-sans text-neutral-800">

      {/* TOP PART: Image and Details Grid (matching CourseDetail) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Column 1: Main Image (Industrial Style) */}
        <div className="lg:col-span-1">
          <div className="relative group">
            <div className="absolute inset-0 border-2 border-black translate-x-2 translate-y-2 bg-neutral-900" />
            <div className="relative aspect-video border-2 border-black bg-neutral-100 overflow-hidden">
              <img
                src={program.imageUrl}
                alt={program.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter group-hover:brightness-110"
              />
            </div>
          </div>

          {/* Quick Date Stats beneath image */}
          <div className="mt-6 space-y-2 px-2">
            {program.createdAt && (
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-mono uppercase">{t('common.createdAt', 'Created')}</span>
                <span className="font-bold"><DayTimeFormat value={program.createdAt} /></span>
              </div>
            )}
            {/* {program.updatedAt && (
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-mono uppercase">{t('common.updatedAt', 'Updated')}</span>
                <span className="font-bold">{dayjs(program.updatedAt).format(dateFormat)}</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Column 2: Metadata & Description */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard
              icon={BookOpen}
              label={t('admin.programs.totalCourses')}
              value={program.totalCourses || 0}
            />
            <InfoCard
              icon={Calendar}
              label={t('common.createdAt', 'Created')}
              value={<DayTimeFormat value={program.createdAt} />}
            />
            <InfoCard
              icon={Clock}
              label={t('common.updatedAt', 'Updated')}
              value={<DayTimeFormat value={program.updatedAt} />}
            />
          </div>

          {/* Description Box (matching CourseDetail style) */}
          <div className="relative p-6 border-2 border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black transition-all">
            <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 -translate-y-1/2 translate-x-4">
              <FileText className="w-3 h-3" />
              {t('common.description')}
            </div>
            <div className="text-neutral-600 leading-relaxed whitespace-pre-line text-base font-medium">
              {program.description || <span className="text-neutral-400 italic">{t('common.noDescription', 'No description provided.')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
        <SectionHeader
          icon={Layers}
          title={t('admin.programs.courses')}
          count={courses.length}
          action={
            <AssignCourseModal program={program} onAssigned={() => {
              setLoadingCourses(true);
              fetchCoursesByProgram(program.id)
                .then((data) => setCourses(data.items || []))
                .catch(() => setCourses([]))
                .finally(() => setLoadingCourses(false));
            }} />
          }
        />

        {loadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border border-neutral-200 p-4">
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <Link key={course.id} to={`/admin/courses/${course.id}`}>
                <CourseCard
                  course={{
                    title: course.name,
                    thumbnail: course.imageUrl,
                    duration: course.durationHours,
                    level: course.level,
                    provider: course.category,
                    tags: course.isActive ? ['Active'] : [],
                  }}
                />
              </Link>
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