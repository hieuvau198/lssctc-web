import React from "react";
import { Card, Tag, Button, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { getProgramName } from "../../../../mock/instructorClasses";
import slugify from "../../../../lib/slugify";

const ClassCard = ({ classItem, onView }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    return status === '1' ? 'green' : 'red';
  };

  const getStatusText = (status) => {
    return status === '1' ? 'Active' : 'Inactive';
  };

  const handleViewDetail = () => {
    const slug = slugify(classItem.name);
    navigate(`/instructor/classes/${slug}`);
  };

  return (
    <Card
      hoverable
      className="rounded-lg shadow h-full flex flex-col w-full max-w-[380px]"
      bodyStyle={{ 
        height: '280px', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px'
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <Tooltip title={classItem.name}>
            <h3
              className="font-semibold text-slate-900 line-clamp-2 flex-1 cursor-pointer text-lg leading-6 h-12 flex items-center"
              onClick={handleViewDetail}
            >
              {classItem.name}
            </h3>
          </Tooltip>
        </div>

        <div className="flex items-center justify-between mb-4 h-8">
          <div className="text-base text-blue-600 font-medium truncate max-w-[60%]">
            {classItem.classCode.name}
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