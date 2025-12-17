import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { fetchCourseDetail } from "../../../../apis/ProgramManager/CourseApi";
import { Skeleton, Alert } from "antd";
import SectionList from './Sections/SectionList';
import CourseClassList from './CourseClassList';
import CourseCertificate from './CourseCertificate';
import dayjs from "dayjs";
import { Clock, Banknote, Tag, BarChart2, Calendar, FileText, Layers, Award, Users } from "lucide-react";

/**
 * Industrial Style Metadata Card
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
 * Industrial Section Header
 */
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <Icon className="w-5 h-5 text-black" />
    </div>
    <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900 m-0">
      {title}
    </h3>
  </div>
);

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
    <div className="flex flex-col gap-12 font-sans text-neutral-800">

      {/* TOP PART: Image and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Column 1: Main Image (Industrial Style) */}
        <div className="lg:col-span-1">
          <div className="relative group">
            <div className="absolute inset-0 border-2 border-black translate-x-2 translate-y-2 bg-neutral-900" />
            <div className="relative aspect-video border-2 border-black bg-neutral-100 overflow-hidden">
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter group-hover:brightness-110"
              />
              {/* Optional ID Badge on Image */}
              <div className="absolute top-0 right-0 bg-yellow-400 px-2 py-1 border-l-2 border-b-2 border-black text-xs font-black">
                ID: {course.id}
              </div>
            </div>
          </div>

          {/* Quick Date Stats beneath image */}
          <div className="mt-6 space-y-2 px-2">
            {course.createdAt && (
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-mono uppercase">Created</span>
                <span className="font-bold">{dayjs(course.createdAt).format(dateFormat)}</span>
              </div>
            )}
            {course.updatedAt && (
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-mono uppercase">Updated</span>
                <span className="font-bold">{dayjs(course.updatedAt).format(dateFormat)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Metadata & Description */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard
              icon={Tag}
              label={t('common.category')}
              value={course.category}
            />
            <InfoCard
              icon={BarChart2}
              label={t('common.level')}
              value={course.level}
            />
            <InfoCard
              icon={Clock}
              label={t('common.duration')}
              value={`${course.durationHours}h`}
            />
            <InfoCard
              icon={Banknote}
              label={t('common.price')}
              value={course.price?.toLocaleString('vi-VN') + ' VND'}
              highlight
            />
          </div>

          {/* Description Box */}
          <div className="relative p-6 border-2 border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black transition-all">
            <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 -translate-y-1/2 translate-x-4">
              <FileText className="w-3 h-3" />
              {t('common.description')}
            </div>
            <div className="text-neutral-600 leading-relaxed whitespace-pre-line text-base font-medium">
              {course.description || <span className="text-neutral-400 italic">No description provided.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM PART: Sections, Certificates & Classes */}
      <div className="w-full flex flex-col gap-10">
        {/* Sections List */}
        <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={Layers} title={t('admin.courses.courseSections') || "Course Sections"} />
          <SectionList courseId={course.id} />
        </div>

        {/* Certificates */}
        <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={Award} title={t('admin.courses.certificates') || "Certificates"} />
          <CourseCertificate courseId={course.id} />
        </div>

        {/* Class List */}
        <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={Users} title={t('admin.courses.classList') || "Classes"} />
          <CourseClassList courseId={course.id} />
        </div>
      </div>

    </div>
  );
};

export default CourseDetail;