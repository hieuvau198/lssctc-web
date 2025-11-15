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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border h-64 md:h-auto">
            <img
              src={course.imageUrl}
              alt={course.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{course.name}</h3>
            <Tag color={course.isActive ? 'green' : 'red'}>
              {course.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span>
              <span className="font-medium">Category:</span> {course.category}
            </span>
            <span>
              <span className="font-medium">Level:</span> {course.level}
            </span>
            <span>
              <span className="font-medium">Duration:</span> {course.durationHours}h
            </span>
            <span>
              <span className="font-medium">Price:</span> ${course.price}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-800 mb-1">Description</div>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line max-h-20 md:max-h-40 overflow-auto pr-2">
              {course.description}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="max-w-xl mx-auto px-4 py-8">
  //     <Button className="mb-4" onClick={onBack}>Back</Button>
  //     <Card
  //       title={course.name}
  //       cover={
  //         <div className="w-full h-56 overflow-hidden flex items-center justify-center bg-slate-100">
  //           <img
  //             alt={course.name}
  //             src={course.imageUrl}
  //             className="max-h-full max-w-full object-cover object-center"
  //           />
  //         </div>
  //       }
  //     >
  //       <p><span className="font-medium">Description:</span> {course.description}</p>
  //       <p><span className="font-medium">Category:</span> {course.categoryName}</p>
  //       <p><span className="font-medium">Level:</span> {course.levelName}</p>
  //       <p><span className="font-medium">Duration:</span> {course.durationHours} hours</p>
  //       <p><span className="font-medium">Status:</span> <Tag color={course.isActive ? 'green' : 'red'} className="ml-1 m-0">{course.isActive ? 'Active' : 'Inactive'}</Tag></p>
  //       <p><span className="font-medium">Price:</span> ${course.price}</p>
  //     </Card>
  //   </div>
  // );
};

export default CourseDetail;
