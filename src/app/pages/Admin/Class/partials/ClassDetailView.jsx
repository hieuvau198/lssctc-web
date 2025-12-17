import { Divider, Empty, Skeleton } from "antd";
import { useTranslation } from 'react-i18next';
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import InstructorCard from "./InstructorCard";
import ClassMembersTable from "./ClassMembersTable";
import ClassTimeslotManage from "./ClassTimeslotManage";
import ClassCertificate from './ClassCertificate';
import ClassCourseInfo from './ClassCourseInfo';
import dayjs from "dayjs";

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
    <div className="space-y-10">
      
       {/* Top Section: Image & Metadata Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Column 2: Metadata & Description */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Metadata Grid - Flat Design */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('admin.classes.columns.capacity')}</div>
                <div className="font-semibold text-slate-700 mt-1">{classItem.capacity}</div>
            </div>
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('admin.classes.form.startDate')}</div>
                <div className="font-semibold text-slate-700 mt-1"><DayTimeFormat value={classItem.startDate} /></div>
            </div>
            <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('admin.classes.form.endDate')}</div>
                <div className="font-semibold text-slate-700 mt-1"><DayTimeFormat value={classItem.endDate} /></div>
            </div>
            {classItem.createdAt && (
                <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Created</div>
                    <div className="text-sm font-medium text-slate-700 mt-1">{dayjs(classItem.createdAt).format(dateFormat)}</div>
                </div>
            )}
             {classItem.updatedAt && (
                <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Updated</div>
                    <div className="text-sm font-medium text-slate-700 mt-1">{dayjs(classItem.updatedAt).format(dateFormat)}</div>
                </div>
            )}
          </div>

          <Divider className="my-4" />

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{t('common.description')}</h3>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
              {classItem.description || <span className="text-slate-400 italic">No description provided.</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {/* Instructor Section */}
        <div>
            <InstructorCard classItem={classItem} />
        </div>

        {/* Members / Trainees Table */}
        <div>
            <ClassMembersTable classItem={classItem} />
        </div>

        {/* Schedule / Timeslots */}
        <div>
            <ClassTimeslotManage classItem={classItem} />
        </div>
      </div>

      {classItem?.courseId && (
          <div >
            <ClassCourseInfo courseId={classItem.courseId} />
          </div>
       )}

      {/* Certificates Section */}
      <div id="class-certificates">
          <ClassCertificate classId={classItem?.id} />
       </div>
    </div>
  );
};

export default ClassDetailView;