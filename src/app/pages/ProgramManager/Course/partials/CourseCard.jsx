import React from "react";
import { Card, Tag } from "antd";

const CourseCard = ({ course, onSelect }) => {
  return (
    <Card
      hoverable
      className="rounded-lg shadow flex flex-col h-full cursor-pointer"
      onClick={() => onSelect(course)}
    >
      <img
        alt={course.name}
        src={course.imageUrl}
        className="object-cover h-40 w-full mb-2 rounded"
      />
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">
            {course.name}
          </h3>
          <Tag color={course.isActive ? 'green' : 'red'} className="m-0">
            {course.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
          {course.description}
        </p>
        <div className="mt-auto pt-3 border-t text-xs text-slate-700 space-y-1">
          <div><span className="font-medium">Category:</span> {course.categoryName}</div>
          <div><span className="font-medium">Level:</span> {course.levelName}</div>
          <div><span className="font-medium">Duration:</span> {course.durationHours}h</div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
