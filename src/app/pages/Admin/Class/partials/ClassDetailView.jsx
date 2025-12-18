import React from 'react';
import { Empty, Skeleton, Popconfirm, App } from "antd";
import { useTranslation } from 'react-i18next';
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import InstructorCard from "./InstructorCard";
import ClassMembersTable from "./ClassMembersTable";
import ClassTimeslotManage from "./ClassTimeslotManage";
import ClassCertificate from './ClassCertificate';
import ClassCourseInfo from './ClassCourseInfo';
import ClassExamWeights from './ClassExamWeights';
import { openClass, startClass, completeClass, cancelClass } from '../../../../apis/ProgramManager/ClassesApi';
import { getClassStatus } from '../../../../utils/classStatus';
import dayjs from "dayjs";
import {
  Users,
  Calendar,
  Clock,
  FileText,
  UserCheck,
  CalendarDays,
  BookOpen,
  Award,
  Activity,
  Play,
  CheckCircle,
  XCircle,
  Send
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

const ClassDetailView = ({ classItem, loading, onRefresh }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [statusLoading, setStatusLoading] = React.useState(false);

  const handleStatusAction = async (action, actionName) => {
    setStatusLoading(true);
    try {
      await action(classItem.id);
      message.success(t(`admin.classes.status.${actionName}Success`, `Class ${actionName} successfully`));
      onRefresh?.();
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || t(`admin.classes.status.${actionName}Error`, `Failed to ${actionName} class`);
      message.error(errMsg);
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!classItem) {
    return <Empty description={t('admin.classes.noClassData')} />;
  }

  const dateFormat = "YYYY-MM-DD HH:mm";
  const statusInfo = getClassStatus(classItem.status);

  // Status action buttons based on current status
  const renderStatusActions = () => {
    switch (statusInfo.key) {
      case 'Draft':
        return (
          <div className="flex flex-wrap gap-3">
            <Popconfirm
              title={t('class.publishConfirm', 'Publish Class')}
              description={t('class.publishConfirmDesc', 'Are you sure you want to publish this class?')}
              onConfirm={() => handleStatusAction(openClass, 'publish')}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ className: 'rounded-none' }}
              cancelButtonProps={{ className: 'rounded-none' }}
            >
              <button
                disabled={statusLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 border-2 border-green-600 text-white font-bold uppercase tracking-wider hover:bg-green-600 transition-all text-xs disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {t('class.publishClass', 'Publish')}
              </button>
            </Popconfirm>
            <Popconfirm
              title={t('class.cancelConfirm', 'Cancel Class')}
              description={t('class.cancelConfirmDesc', 'Are you sure you want to cancel this class?')}
              onConfirm={() => handleStatusAction(cancelClass, 'cancel')}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ danger: true, className: 'rounded-none' }}
              cancelButtonProps={{ className: 'rounded-none' }}
            >
              <button
                disabled={statusLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-transparent border-2 border-red-500 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all text-xs disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                {t('class.cancelClass', 'Cancel')}
              </button>
            </Popconfirm>
          </div>
        );
      case 'Open':
        return (
          <Popconfirm
            title={t('class.startConfirm', 'Start Class')}
            description={t('class.startConfirmDesc', 'Are you sure you want to start this class?')}
            onConfirm={() => handleStatusAction(startClass, 'start')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            okButtonProps={{ className: 'rounded-none' }}
            cancelButtonProps={{ className: 'rounded-none' }}
          >
            <button
              disabled={statusLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 border-2 border-blue-600 text-white font-bold uppercase tracking-wider hover:bg-blue-600 transition-all text-xs disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {t('class.startClass', 'Start Class')}
            </button>
          </Popconfirm>
        );
      case 'Inprogress':
        return (
          <Popconfirm
            title={t('class.completeConfirm', 'Complete Class')}
            description={t('class.completeConfirmDesc', 'Are you sure you want to complete this class?')}
            onConfirm={() => handleStatusAction(completeClass, 'complete')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            okButtonProps={{ className: 'rounded-none' }}
            cancelButtonProps={{ className: 'rounded-none' }}
          >
            <button
              disabled={statusLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 border-2 border-black text-black font-bold uppercase tracking-wider hover:bg-yellow-500 transition-all text-xs disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {t('class.completeClass', 'Complete Class')}
            </button>
          </Popconfirm>
        );
      case 'Cancelled':
      case 'Completed':
        return (
          <div className="text-neutral-500 italic text-sm">
            {t('admin.classes.status.noActionsAvailable', 'No status actions available for this class.')}
          </div>
        );
      default:
        return null;
    }
  };

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
        {/* Status Management Section */}
        <div id="class-status" className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={Activity} title={t('admin.classes.status.title', 'Status Management')} />

          <div className="flex flex-col gap-6">
            {/* Current Status Display */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                {t('admin.classes.status.currentStatus', 'Current Status')}:
              </span>
              <div className={`px-4 py-2 text-sm font-black uppercase tracking-wider border-2 ${statusInfo.key === 'Open' || statusInfo.key === 'Inprogress'
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : statusInfo.key === 'Completed'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : statusInfo.key === 'Cancelled'
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-yellow-100 border-yellow-500 text-yellow-700'
                }`}>
                {t(`common.classStatus.${statusInfo.key}`, statusInfo.key)}
              </div>
            </div>

            {/* Status Actions */}
            <div className="border-t-2 border-neutral-100 pt-6">
              <span className="text-sm font-bold uppercase tracking-wider text-neutral-500 block mb-4">
                {t('admin.classes.status.availableActions', 'Available Actions')}:
              </span>
              {renderStatusActions()}
            </div>

            {/* Loading Indicator */}
            {statusLoading && (
              <div className="flex items-center gap-2 text-neutral-500">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">{t('common.processing', 'Processing...')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructor Section */}
        <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={UserCheck} title={t('admin.classes.instructor.title', 'Instructor')} />
          <InstructorCard classItem={classItem} />
        </div>

        {/* Members / Trainees Table */}
        <div className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
          <SectionHeader icon={Users} title={t('admin.classes.members.title', 'Class Members')} />
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

        {/* NEW EXAM WEIGHTS SECTION */}
        <ClassExamWeights classId={classItem?.id} />

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