import { Button, Empty, Skeleton, Tag } from "antd";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import EditClassStatus from "../../../../components/ClassStatus/EditClassStatus";
import { getClassStatus } from "../../../../utils/classStatus";
import InstructorCard from "./InstructorCard";
import ClassMembersTable from "./ClassMembersTable";
import { ArrowLeft } from "lucide-react";

const ClassDetailView = ({ classItem, loading, onRefresh }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!classItem) {
    return <Empty description={t('admin.classes.noClassData')} />;
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Button type="default" icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/class')}/>
            <span className="text-xl font-semibold">{classItem.name}</span>
            {(() => {
              const s = getClassStatus(classItem.status);
              return <Tag color={s.color}>{t(`common.classStatus.${s.key}`)}</Tag>;
            })()}
            <EditClassStatus 
              classId={classItem.id} 
              status={classItem.status} 
              onSuccess={onRefresh} 
            />
          </div>
          <div>
            <Button onClick={() => navigate(`/admin/class/${classItem.id}/edit`)}>{t('admin.classes.editClassDetails')}</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <span className="font-medium">{t('admin.classes.form.startDate')}:</span>{' '}
            <DayTimeFormat value={classItem.startDate} />
          </div>
          <div>
            <span className="font-medium">{t('admin.classes.form.endDate')}:</span>{' '}
            <DayTimeFormat value={classItem.endDate} />
          </div>
          <div>
            <span className="font-medium">{t('admin.classes.columns.capacity')}:</span> {classItem.capacity}
          </div>
          <div>
            <span className="font-medium">{t('admin.classes.columns.classCode')}:</span> {classItem.classCode?.name || classItem.classCode || "-"}
          </div>
        </div>
        {classItem.description && (
          <div className="text-sm text-slate-600">
            <span className="font-medium">{t('common.description')}:</span>{" "}
            <span className="whitespace-pre-line">{classItem.description}</span>
          </div>
        )}
      </div>

      {/* Instructor */}
      <InstructorCard classItem={classItem} />

      {/* Members / Trainees Table */}
      <ClassMembersTable classItem={classItem} />
    </div>
  );
};

export default ClassDetailView;