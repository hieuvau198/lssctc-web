import React from "react";
import { Empty } from "antd";
import CourseCard from "./CourseCard";

const CourseList = ({ courses, onSelect }) =>
  courses.length === 0 ? (
    <Empty description="No courses found." className="mt-16" />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onSelect={onSelect} />
      ))}
    </div>
  );

export default CourseList;
