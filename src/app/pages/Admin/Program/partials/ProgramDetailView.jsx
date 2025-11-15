import React, { useEffect, useState } from "react";
import { Tag, Divider, Empty, Skeleton } from "antd";
import { fetchCoursesByProgram } from "../../../../apis/ProgramManager/CourseApi";
import CourseCard from "./CourseCard";
import AssignCourse from "./AssignCourse";

const ProgramDetailView = ({ program, loading }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (program?.id) {
      setLoadingCourses(true);
      fetchCoursesByProgram(program.id)
        .then((data) => {
          setCourses(data.items || []);
        })
        .catch((err) => {
          console.error('Failed to fetch courses:', err);
          setCourses([]);
        })
        .finally(() => {
          setLoadingCourses(false);
        });
    }
  }, [program?.id]);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!program) {
    return <Empty description="No program data" />;
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border h-64 md:h-auto">
            <img
              src={program.imageUrl}
              alt={program.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{program.name}</h3>
            <Tag color={program.isActive ? 'green' : 'red'}>
              {program.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span>
              <span className="font-medium">Duration:</span> {program.durationHours}h
            </span>
            <span>
              <span className="font-medium">Total Courses:</span> {program.totalCourses || 0}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-800 mb-1">Description</div>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line max-h-[120px] overflow-auto pr-2">
              {program.description}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <Divider orientation="left">Courses</Divider>
        <div className="ml-3">
          <AssignCourse program={program} onAssigned={() => {
            // refresh courses after assign
            setLoadingCourses(true);
            fetchCoursesByProgram(program.id)
              .then((data) => setCourses(data.items || []))
              .catch(() => setCourses([]))
              .finally(() => setLoadingCourses(false));
          }} />
        </div>
        {loadingCourses ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : courses && courses.length > 0 ? (
          <div className="space-y-4 max-h-[360px] overflow-auto">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Empty description="No courses assigned" />
        )}
      </div>

      {/* Entry Requirements */}
      {/* <div>
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
      </div> */}
    </div>
  );
};

export default ProgramDetailView;