import React from 'react';
import { Empty, Skeleton } from "antd";
import { useTranslation } from 'react-i18next';
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import InstructorCard from "./InstructorCard";
import ClassMembersTable from "./ClassMembersTable";
import ClassTimeslotManage from "./ClassTimeslotManage";
import ClassCertificate from './ClassCertificate';
import ClassCourseInfo from './ClassCourseInfo';
import dayjs from "dayjs";
import {
  Users,
  Calendar,
  Clock,
  Info,
  FileText,
  UserCheck,
  CalendarDays,
  BookOpen,
  Award
} from 'lucide-react';

/**
 * Industrial Style Metadata Card (matching CourseDetail)
 */
const InfoCard = ({ icon: Icon, label, value, subValue, highlight = false }) => (
  <div className={`p-4 border-2 ${highlight ? 'border-yellow-400 bg-yellow-50' : 'border-neutral-200 bg-white'} flex flex-col items-start gap-2 hover:border-black transition-colors group`}>
    <div className="flex items-center gap-2 text-neutral-500 group-hover:text-black transition-colors">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className={`text-lg font-bold ${highlight ? 'text-black' : 'text-neutral-800'}`}>
      {value}
    </div>
    {subValue && (
      <div className="text-xs text-neutral-400 font-mono">
        {subValue}
      </div>
    )}
  </div>
);

/**
 * Industrial Section Header (matching CourseDetail)
 */
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <Icon className="w-5 h-5 text-black" />
    </div>
    <span className="text-xl font-black uppercase tracking-tight text-neutral-900 m-0">
      {title}
    </span>
  </div>
);

const ClassDetailView = ({ classItem, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!classItem) {
    return <Empty description={t('admin.classes.noClassData')} />;
  }

  const dateFormat = "YYYY-MM-DD HH:mm";

  return (
    <div className="flex flex-col gap-12 font-sans text-neutral-800">

      {/* TOP PART: Metadata & Description (matching CourseDetail layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Column 1: Class Info Card (no image for Class, so use info summary) */}
        <div className="lg:col-span-1">
          <div className="relative group">
            <div className="absolute inset-0 border-2 border-black translate-x-2 translate-y-2 bg-neutral-900" />
            <div className="relative border-2 border-black bg-yellow-400 p-6">
              {/* ID Badge */}
              <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-xs font-black">
                ID: {classItem.id}
              </div>

              <div className="flex flex-col items-center text-center pt-4">
                <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-yellow-400" />
                </div>
                <span className="text-2xl font-black uppercase tracking-tight text-black mb-2">
                  {classItem.name}
                </span>
                <div className="text-black font-mono text-sm">
                  {classItem.courseCode || classItem.code || 'CLASS'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Date Stats beneath */}
          <div className="mt-6 space-y-2 px-2">
            {classItem.createdAt && (
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-mono uppercase">{t('common.createdAt', 'Created')}</span>
                <span className="font-bold">{dayjs(classItem.createdAt).format(dateFormat)}</span>
              </div>
            )}
            {classItem.updatedAt && (
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-mono uppercase">{t('common.updatedAt', 'Updated')}</span>
                <span className="font-bold">{dayjs(classItem.updatedAt).format(dateFormat)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Metadata & Description */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard
              icon={Users}
              label={t('admin.classes.columns.capacity')}
              value={classItem.capacity}
            />
            <InfoCard
              icon={Calendar}
              label={t('admin.classes.form.startDate')}
              value={<DayTimeFormat value={classItem.startDate} />}
            />
            <InfoCard
              icon={Clock}
              label={t('admin.classes.form.endDate')}
              value={<DayTimeFormat value={classItem.endDate} />}
            />
          </div>

          {/* Description Box (matching CourseDetail style) */}
          <div className="relative p-6 border-2 border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black transition-all">
            <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1 -translate-y-1/2 translate-x-4">
              <FileText className="w-3 h-3" />
              {t('common.description')}
            </div>
            <div className="text-neutral-600 leading-relaxed whitespace-pre-line text-base font-medium">
              {classItem.description || <span className="text-neutral-400 italic">{t('common.noDescription', 'No description provided.')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-10">
        {/* Instructor Section */}
        <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={UserCheck} title={t('admin.classes.instructor', 'Instructor')} />
          <InstructorCard classItem={classItem} />
        </div>

        {/* Members / Trainees Table */}
        <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={Users} title={t('admin.classes.members', 'Class Members')} />
          <ClassMembersTable classItem={classItem} />
        </div>

        {/* Schedule / Timeslots */}
        <div id="class-schedule" className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={CalendarDays} title={t('admin.classes.schedule', 'Schedule')} />
          <ClassTimeslotManage classItem={classItem} />
        </div>

        {/* Parent Course Info */}
        {classItem?.courseId && (
          <div id="parent-course" className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <SectionHeader icon={BookOpen} title={t('admin.classes.parentCourse', 'Parent Course')} />
            <ClassCourseInfo courseId={classItem.courseId} />
          </div>
        )}

        {/* Certificates Section */}
        <div id="class-certificates" className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={Award} title={t('admin.classes.certificates', 'Certificates')} />
          <ClassCertificate classId={classItem?.id} />
        </div>
      </div>
    </div>
  );
};

export default ClassDetailView;