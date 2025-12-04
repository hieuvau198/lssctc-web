import { Button, Empty, Skeleton, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import EditClassStatus from "../../../../components/ClassStatus/EditClassStatus";
import { getClassStatus } from "../../../../utils/classStatus";
import InstructorCard from "./InstructorCard";
import ClassMembersTable from "./ClassMembersTable";
import { ArrowLeft } from "lucide-react";

const ClassDetailView = ({ classItem, loading, onRefresh }) => {
  const navigate = useNavigate();

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!classItem) {
    return <Empty description="No class data" />;
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
              return <Tag color={s.color}>{s.label}</Tag>;
            })()}
            <EditClassStatus 
              classId={classItem.id} 
              status={classItem.status} 
              onSuccess={onRefresh} 
            />
          </div>
          <div>
            <Button onClick={() => navigate(`/admin/class/${classItem.id}/edit`)}>Edit Class Details</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <span className="font-medium">Start Date:</span>{' '}
            <DayTimeFormat value={classItem.startDate} />
          </div>
          <div>
            <span className="font-medium">End Date:</span>{' '}
            <DayTimeFormat value={classItem.endDate} />
          </div>
          <div>
            <span className="font-medium">Capacity:</span> {classItem.capacity}
          </div>
          <div>
            <span className="font-medium">Class Code:</span> {classItem.classCode?.name || classItem.classCode || "-"}
          </div>
        </div>
        {classItem.description && (
          <div className="text-sm text-slate-600">
            <span className="font-medium">Description:</span>{" "}
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