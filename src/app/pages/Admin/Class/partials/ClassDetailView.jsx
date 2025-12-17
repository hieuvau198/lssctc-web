import React from 'react';
import { Divider, Empty, Skeleton } from "antd";
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
  Info
} from 'lucide-react';

const ClassDetailView = ({ classItem, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!classItem) {
    return <Empty description={t('admin.classes.noClassData')} />;
  }

  const dateFormat = "YYYY-MM-DD HH:mm";

  const MetadataItem = ({ icon: Icon, label, value, subValue }) => (
    <div className="border border-slate-200 bg-white p-4 hover:border-black transition-colors group">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-slate-100 group-hover:bg-yellow-400 flex items-center justify-center transition-colors">
          <Icon size={14} className="text-black" strokeWidth={2.5} />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-black transition-colors">{label}</span>
      </div>
      <div className="font-bold text-slate-800 text-lg leading-tight break-words">
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-slate-400 mt-1 font-mono">
          {subValue}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in">

      {/* Top Section: Metadata & Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        <div className="md:col-span-3 space-y-6">

          {/* Metadata Grid - Industrial */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetadataItem
              icon={Users}
              label={t('admin.classes.columns.capacity')}
              value={classItem.capacity}
              subValue="Students Max"
            />
            <MetadataItem
              icon={Calendar}
              label={t('admin.classes.form.startDate')}
              value={<DayTimeFormat value={classItem.startDate} />}
            />
            <MetadataItem
              icon={Clock}
              label={t('admin.classes.form.endDate')}
              value={<DayTimeFormat value={classItem.endDate} />}
            />
            <MetadataItem
              icon={Info}
              label="Last Updated"
              value={dayjs(classItem.updatedAt || classItem.createdAt).format('YYYY-MM-DD')}
              subValue={dayjs(classItem.updatedAt || classItem.createdAt).format('HH:mm')}
            />
          </div>

          <div className="bg-slate-50 border-l-4 border-yellow-400 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              {t('common.description')}
            </h3>
            <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base font-medium">
              {classItem.description || <span className="text-slate-400 italic">No description provided.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {/* Instructor Section */}
        <div>
          <InstructorCard classItem={classItem} />
        </div>

        {/* Members / Trainees Table */}
        <div>
          <ClassMembersTable classItem={classItem} />
        </div>

        {/* Schedule / Timeslots */}
        <div id="class-schedule">
          <ClassTimeslotManage classItem={classItem} />
        </div>


        {classItem?.courseId && (
          <div id="parent-course">
            <ClassCourseInfo courseId={classItem.courseId} />
          </div>
        )}

        {/* Certificates Section */}
        <div id="class-certificates">
          <ClassCertificate classId={classItem?.id} />
        </div>
      </div>
    </div>
  );
};

export default ClassDetailView;