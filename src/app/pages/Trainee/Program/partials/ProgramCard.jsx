import React from "react";
import { Card, Button, Tag } from "antd";


const ProgramCard = ({ program, onClick }) => {
  const {
    name,
    imageUrl,
    durationHours,
    totalCourses,
    isActive,
  } = program || {};

  return (
    <Card
      hoverable
      onClick={onClick}
      cover={
        imageUrl ? (
          <img
            alt={name}
            src={imageUrl}
            className="object-cover h-40 w-full"
            loading="lazy"
          />
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-blue-50 to-blue-100" />
        )
      }
      className="rounded-lg shadow flex flex-col h-full max-w-[300px] mx-auto"
      // bodyStyle={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div className="flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
        <div className="text-[13px] text-slate-600 space-y-1 mb-3 leading-relaxed">
          {durationHours != null && (
            <div><span className="font-medium text-slate-700">Duration:</span> {durationHours} h</div>
          )}
          {totalCourses != null && (
            <div><span className="font-medium text-slate-700">Courses:</span> {totalCourses}</div>
          )}
          <div className="flex items-center gap-1"><span className="font-medium text-slate-700">Status:</span>
            <Tag color={isActive ? 'green' : 'red'} className="m-0">{isActive ? 'Active' : 'Inactive'}</Tag>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgramCard;