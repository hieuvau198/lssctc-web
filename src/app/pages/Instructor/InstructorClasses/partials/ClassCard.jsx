import { useNavigate } from "react-router";
import { getProgramName } from "../../../../mocks/instructorClasses";
import { Calendar, Users, BookOpen, ChevronRight, GraduationCap } from "lucide-react";

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
  const getStatusColor = (status) => (isActiveStatus(status)
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-rose-50 text-rose-700 border-rose-100');
  const getStatusText = (status) => (isActiveStatus(status) ? 'Active' : 'Inactive');

  const handleViewDetail = () => {
    const id = classItem?.id ?? classItem?.classId;
    if (id) navigate(`/instructor/classes/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleViewDetail();
    }
  };

  return (
    <div
      onClick={handleViewDetail}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="group relative bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-blue-600/10 hover:border-blue-100 transition-all duration-300 flex flex-col h-full"
    >
      {/* Status Badge */}
      <div className="absolute top-6 right-6">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(classItem.status)}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isActiveStatus(classItem.status) ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          {getStatusText(classItem.status)}
        </span>
      </div>

      {/* Header */}
      <div className="mb-6 pr-20">
        <h3 className="text-xl font-extrabold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {classItem.name}
        </h3>
        <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-mono font-bold border border-gray-200">
          {classItem.classCode?.name ?? classItem.classCode ?? '-'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        {/* Program */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
          <div className="p-2 rounded-lg bg-white text-blue-600 shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Program</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1">
              {getProgramName(classItem.programCourseId) || 'N/A'}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100/50">
          <div className="p-2 rounded-lg bg-white text-orange-600 shadow-sm">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Duration</p>
            <p className="text-sm font-bold text-gray-900">
              {formatDate(classItem.startDate)} - {formatDate(classItem.endDate)}
            </p>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100/50">
          <div className="p-2 rounded-lg bg-white text-purple-600 shadow-sm">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Capacity</p>
            <p className="text-sm font-bold text-gray-900">
              {classItem.capacity} Students
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
          View Details
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default ClassCard;