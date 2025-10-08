// src\app\pages\ProgramManager\Course\partials\CourseDetail.jsx

import React, { useEffect, useState } from "react";
import { fetchCourseDetail } from "../../../../apis/ProgramManager/CourseApi";
import { Card, Skeleton, Alert, Button, Tag } from "antd";

const CourseDetail = ({ id, onBack, course: providedCourse, embedded = false }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (providedCourse) {
      setCourse(providedCourse);
      setLoading(false);
      return;
    }
    if (!id) return;
    setLoading(true);
    fetchCourseDetail(id)
      .then((data) => { setCourse(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id, providedCourse]);

  if (loading)
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <Skeleton.Button active className="mb-4 !w-20" />
        <Card cover={<Skeleton.Image active className="!w-full !h-56" />}> 
          <Skeleton active title paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
        <Button className="mt-4" onClick={onBack}>
          Back
        </Button>
      </div>
    );

  if (embedded) {
    return (
      <div className="space-y-4">
        <div className="w-full h-3/4 rounded overflow-hidden flex items-center justify-center">
          <img
            alt={course.name}
            src={course.imageUrl}
            className="h-3/4 w-3/4 object-cover rounded object-center"
          />
        </div>
        <div className="text-sm space-y-2">
          <p><span className="font-medium">Description:</span> {course.description}</p>
          <p><span className="font-medium">Category:</span> {course.categoryName}</p>
            <p><span className="font-medium">Level:</span> {course.levelName}</p>
            <p><span className="font-medium">Duration:</span> {course.durationHours}h</p>
            <p><span className="font-medium">Code:</span> {course.courseCodeName || '-'} </p>
            <p><span className="font-medium">Status:</span> <Tag color={course.isActive ? 'green' : 'red'} className="ml-1 m-0">{course.isActive ? 'Active' : 'Inactive'}</Tag></p>
            <p><span className="font-medium">Price:</span> ${course.price}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Button className="mb-4" onClick={onBack}>Back</Button>
      <Card
        title={course.name}
        cover={
          <div className="w-full h-56 overflow-hidden flex items-center justify-center bg-slate-100">
            <img
              alt={course.name}
              src={course.imageUrl}
              className="max-h-full max-w-full object-cover object-center"
            />
          </div>
        }
      >
        <p><span className="font-medium">Description:</span> {course.description}</p>
        <p><span className="font-medium">Category:</span> {course.categoryName}</p>
        <p><span className="font-medium">Level:</span> {course.levelName}</p>
        <p><span className="font-medium">Duration:</span> {course.durationHours} hours</p>
  <p><span className="font-medium">Status:</span> <Tag color={course.isActive ? 'green' : 'red'} className="ml-1 m-0">{course.isActive ? 'Active' : 'Inactive'}</Tag></p>
        <p><span className="font-medium">Price:</span> ${course.price}</p>
      </Card>
    </div>
  );
};

export default CourseDetail;
