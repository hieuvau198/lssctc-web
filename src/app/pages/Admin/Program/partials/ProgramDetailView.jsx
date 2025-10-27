import React from "react";
import { Tag, Divider, Card, Empty, Skeleton } from "antd";
import ManagerCourseCard from "./ManagerCourseCard";

const ProgramDetailView = ({ program, loading }) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!program) {
    return <Empty description="No program data" />;
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border">
            <img
              src={program.imageUrl}
              alt={program.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{program.name}</h3>
            <Tag color={program.isActive ? 'green' : 'red'}>
              {program.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {program.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span>
              <span className="font-medium">Duration:</span> {program.durationHours}h
            </span>
            <span>
              <span className="font-medium">Total Courses:</span> {program.totalCourses || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <Divider orientation="left">Courses</Divider>
        {program.courses && program.courses.length > 0 ? (
          <div className="space-y-4">
            {program.courses
              .sort((a, b) => (a.courseOrder || 0) - (b.courseOrder || 0))
              .map((course) => (
                <ManagerCourseCard
                  key={course.id}
                  courseId={course.coursesId || course.id}
                  order={course.courseOrder || 1}
                  programCourseId={course.programCourseId || course.id}
                />
              ))}
          </div>
        ) : (
          <Empty description="No courses assigned" />
        )}
      </div>

      {/* Entry Requirements */}
      <div>
        <Divider orientation="left">Entry Requirements</Divider>
        {program.entryRequirements && program.entryRequirements.length > 0 ? (
          <ul className="list-disc ml-5 text-sm space-y-2">
            {program.entryRequirements.map((requirement, index) => (
              <li key={index}>
                <span className="font-medium">{requirement.name}:</span>{" "}
                {requirement.description}
                {requirement.documentUrl && (
                  <a
                    href={requirement.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 ml-2 text-xs"
                  >
                    View Document
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Empty description="No entry requirements" />
        )}
      </div>
    </div>
  );
};

export default ProgramDetailView;