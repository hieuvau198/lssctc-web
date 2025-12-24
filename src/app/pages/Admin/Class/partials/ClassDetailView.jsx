import React, { useState } from 'react';
import { Empty, Skeleton, Popconfirm, App } from "antd";
import { useTranslation } from 'react-i18next';
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import InstructorCard from "./InstructorCard";
import ClassMembersTable from "./ClassMembersTable";
import ClassTimeslotManage from "./ClassTimeslotManage";
import ClassCertificate from './ClassCertificate';
import ClassCourseInfo from './ClassCourseInfo';
import ClassFinalExam from './ClassFinalExam'; // [UPDATED] Import ClassFinalExam
import IndustrialTabs from "../../../../components/Common/IndustrialTabs";
import { openClass, startClass, completeClass, cancelClass } from '../../../../apis/ProgramManager/ClassesApi';
import { getClassStatus } from '../../../../utils/classStatus';
import {
  Users,
  Calendar,
  Clock,
  FileText,
  Award,
  Activity,
  Play,
  CheckCircle,
  XCircle,
  Send,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';

// ... (InfoCard and SectionHeader components remain the same)
const InfoCard = ({ icon: Icon, label, value, subValue, highlight = false }) => (
  <div className={`p-4 border-2 ${highlight ? 'border-yellow-400 bg-yellow-50' : 'border-slate-200 bg-white'} flex flex-col items-start gap-2 hover:border-black transition-colors group`}>
    <div className="flex items-center gap-2 text-slate-500 group-hover:text-black transition-colors">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className={`text-lg font-bold ${highlight ? 'text-black' : 'text-slate-800'}`}>
      {value}
    </div>
    {subValue && (
      <div className="text-xs text-slate-400 font-mono">
        {subValue}
      </div>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-100 pb-4">
    <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <span className="text-xl font-bold uppercase tracking-wide text-slate-900">
      {title}
    </span>
  </div>
);

const ClassDetailView = ({ classItem, loading, onRefresh }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [statusLoading, setStatusLoading] = useState(false);
  const [hasTimeSlots, setHasTimeSlots] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const statusInfo = getClassStatus(classItem.status);
  const readOnly = statusInfo.key !== 'Draft';

  // Shared Button Styles
  const primaryBtnClass = "flex items-center gap-2 px-5 py-2.5 bg-black border-2 border-black text-white font-bold uppercase tracking-wider hover:bg-yellow-400 hover:text-black hover:border-yellow-500 transition-all text-xs disabled:opacity-50 w-full justify-center shadow-sm";
  const secondaryBtnClass = "flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 font-bold uppercase tracking-wider hover:border-black hover:text-black hover:bg-slate-50 transition-all text-xs disabled:opacity-50 w-full justify-center";

  const renderStatusActions = () => {
     switch (statusInfo.key) {
      case 'Draft':
        return (
          <div className="flex flex-col gap-3">
            <Popconfirm
              title={t('class.publishConfirm', 'Publish Class')}
              description={t('class.publishConfirmDesc', 'Are you sure you want to publish this class?')}
              onConfirm={() => handleStatusAction(openClass, 'publish')}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ className: 'bg-black' }}
            >
              <a disabled={statusLoading} className={primaryBtnClass}>
                <Send className="w-4 h-4" />
                {t('class.publishClass', 'Publish')}
              </a>
            </Popconfirm>
            <Popconfirm
              title={t('class.cancelConfirm', 'Cancel Class')}
              description={t('class.cancelConfirmDesc', 'Are you sure you want to cancel this class?')}
              onConfirm={() => handleStatusAction(cancelClass, 'cancel')}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ danger: true }}
            >
              <button disabled={statusLoading} className={secondaryBtnClass}>
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
            okButtonProps={{ className: 'bg-black' }}
          >
            <a disabled={statusLoading} className={primaryBtnClass}>
              <Play className="w-4 h-4" />
              {t('class.startClass', 'Start Class')}
            </a>
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
            okButtonProps={{ className: 'bg-black' }}
          >
            <a disabled={statusLoading} className={primaryBtnClass}>
              <CheckCircle className="w-4 h-4" />
              {t('class.completeClass', 'Complete Class')}
            </a>
          </Popconfirm>
        );
      case 'Cancelled':
      case 'Completed':
        return (
          <div className="text-slate-400 italic text-sm text-center border border-slate-100 py-3 bg-slate-50">
            {t('admin.classes.status.noActionsAvailable', 'No status actions available.')}
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { key: 'exam', label: 'Thi cuối khóa', icon: GraduationCap },
    { key: 'certificate', label: 'Chứng chỉ', icon: Award }
  ];

  return (
    <div className="flex flex-col gap-8 font-sans text-slate-800">
      {/* Metadata & Description */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Column 1: Class Info Card */}
        <div className="lg:col-span-1">
          <div className="relative group">
            {/* Shadow Block */}
            <div className="absolute inset-0 border-2 border-black translate-x-2 translate-y-2 bg-black" />
            
            {/* Main Card */}
            <div className="relative border-2 border-black bg-yellow-400 p-6">
              <div className="flex flex-col items-center text-center pt-4">
                <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-yellow-400" />
                </div>
                <span className="text-2xl font-black uppercase tracking-tight text-black mb-2 leading-none">
                  {classItem.name}
                </span>
                <div className="text-black font-mono text-sm font-bold opacity-80 mt-2 border-t border-black pt-2 w-full">
                  {(() => {
                    const code = classItem.classCode?.name || classItem.classCode || classItem.courseCode || classItem.code;
                    return code ? `${code}` : 'CLASS';
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3 px-1">
            {classItem.createdAt && (
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold uppercase tracking-wide">{t('common.createdAt', 'Created')}</span>
                <span className="font-mono font-medium text-slate-700"><DayTimeFormat value={classItem.createdAt} /></span>
              </div>
            )}
            {classItem.updatedAt && (
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-bold uppercase tracking-wide">{t('common.updatedAt', 'Updated')}</span>
                <span className="font-mono font-medium text-slate-700"><DayTimeFormat value={classItem.updatedAt} /></span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Metadata & Description */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard icon={Users} label={t('admin.classes.columns.capacity')} value={classItem.capacity} />
            <InfoCard icon={Calendar} label={t('admin.classes.form.startDate')} value={<DayTimeFormat value={classItem.startDate} />} />
            <InfoCard icon={Clock} label={t('admin.classes.form.endDate')} value={<DayTimeFormat value={classItem.endDate} />} />
          </div>

          <div className="relative p-6 border-2 border-slate-200 bg-slate-50 hover:bg-white hover:border-black transition-all">
            <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-2 -translate-y-1/2 translate-x-4">
              <FileText className="w-3 h-3 text-yellow-400" />
              {t('common.description')}
            </div>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium mt-2">
              {classItem.description || <span className="text-slate-400 italic">{t('common.noDescription', 'No description provided.')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <IndustrialTabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8">
              <div id="class-schedule" className="p-6 border-2 border-slate-200 bg-white h-full">
                <ClassTimeslotManage classItem={classItem} onTimeSlotsChange={setHasTimeSlots} readOnly={readOnly} />
              </div>
            </div>
            <div className="xl:col-span-4">
              <div id="class-status" className="p-6 border-2 border-slate-200 bg-white h-full">
                <SectionHeader icon={Activity} title={t('admin.classes.status.title', 'Status Management')} />
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('admin.classes.status.currentStatus', 'Current Status')}</span>
                    <div className="relative">
                      <div className={`px-4 py-4 text-center border-2 border-black flex flex-col items-center justify-center gap-1 ${
                        statusInfo.key === 'Inprogress' || statusInfo.key === 'Open' ? 'bg-black text-yellow-400' : 'bg-slate-50 text-slate-900'
                      }`}>
                        <span className="text-lg font-black uppercase tracking-widest">{t(`common.classStatus.${statusInfo.key}`, statusInfo.key)}</span>
                        {statusInfo.key === 'Draft' && <span className="text-[10px] uppercase font-bold text-slate-500">Not Published</span>}
                      </div>
                    </div>
                  </div>
                  <div className="border-t-2 border-slate-100 pt-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">{t('admin.classes.status.availableActions', 'Available Actions')}</span>
                    <div className="flex flex-col gap-3">{renderStatusActions()}</div>
                  </div>
                  {statusLoading && (
                    <div className="flex items-center gap-2 text-slate-400 justify-center pt-2">
                      <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold uppercase">{t('common.processing', 'Processing...')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8">
              <div className="p-6 border-2 border-slate-200 bg-white h-full">
                <ClassMembersTable classItem={classItem} />
              </div>
            </div>
            <div className="xl:col-span-4">
              <div className="p-6 border-2 border-slate-200 bg-white h-full">
                <InstructorCard classItem={classItem} allowAssign={hasTimeSlots} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINAL EXAM */}
      {activeTab === 'exam' && (
        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
           {/* [UPDATED] Replaced ClassExamWeights with ClassFinalExam */}
          <ClassFinalExam classId={classItem?.id} readOnly={readOnly} />
        </div>
      )}

      {/* TAB 3: CERTIFICATE & PARENT COURSE */}
      {activeTab === 'certificate' && (
        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
          {classItem?.courseId && (
            <div id="parent-course" className="p-6 border-2 border-slate-200 bg-white">
              <ClassCourseInfo courseId={classItem.courseId} />
            </div>
          )}
          <div id="class-certificates" className="p-6 border-2 border-slate-200 bg-white">
            <ClassCertificate classId={classItem?.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetailView;