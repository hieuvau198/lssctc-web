import { Card, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router";
import { getProgramName } from "../../../../mocks/instructorClasses";

const ClassCard = ({ classItem, onView }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isActiveStatus = (status) => String(status) === '1' || Number(status) === 1;
  const getStatusColor = (status) => (isActiveStatus(status) ? 'green' : 'red');
  const getStatusText = (status) => (isActiveStatus(status) ? 'Active' : 'Inactive');

  const handleViewDetail = () => {
    const id = classItem?.id ?? classItem?.classId;
    if (id) navigate(`/instructor/classes/${id}`);
  };

  const handleKeyDown = (e) => {
    // Trigger navigation on Enter or Space for accessibility
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleViewDetail();
    }
  };

  return (
    <Card
      hoverable
      className="rounded-lg shadow h-full flex flex-col w-full max-w-[380px] cursor-pointer"
      bodyStyle={{ 
        height: '280px', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px'
      }}
      onClick={handleViewDetail}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <Tooltip title={classItem.name}>
            <h3
              className="font-semibold text-slate-900 line-clamp-2 flex-1 text-lg leading-6 h-12 flex items-center"
            >
              {classItem.name}
            </h3>
          </Tooltip>
        </div>

        <div className="flex items-center justify-between mb-4 h-8">
          <div className="text-base text-blue-600 font-medium truncate max-w-[60%]">
            {classItem.classCode?.name ?? classItem.classCode ?? '-'}
          </div>
          <Tag color={getStatusColor(classItem.status)} className="m-0 flex-shrink-0 text-sm px-3 py-1">
            {getStatusText(classItem.status)}
          </Tag>
        </div>

        <div className="flex-1 flex flex-col justify-end">
          <div className="pt-4 border-t text-sm text-slate-700 space-y-3">
            <div className="flex">
              <span className="font-medium w-20 flex-shrink-0">Program:</span> 
              <Tooltip title={getProgramName(classItem.programCourseId)}>
                <span className="flex-1 truncate">{getProgramName(classItem.programCourseId)}</span>
              </Tooltip>
            </div>
            <div className="flex">
              <span className="font-medium w-20 flex-shrink-0">Duration:</span> 
              <span className="flex-1 line-clamp-2 text-xs leading-4">{formatDate(classItem.startDate)} - {formatDate(classItem.endDate)}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-20 flex-shrink-0">Capacity:</span> 
              <span className="flex-1">{classItem.capacity} students</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClassCard;