import React, { useEffect, useState } from "react";
import { fetchCourseDetail } from "../../../../apis/ProgramManager/CourseApi";
import { Card, Skeleton, Alert, Button } from "antd";

const CourseDetail = ({ id, onBack }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCourseDetail(id)
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Button className="mb-4" onClick={onBack}>
        Back
      </Button>
      <Card
        title={course.name}
        cover={
          <img
            alt={course.name}
            src={course.imageUrl}
            className="object-cover h-56 w-full"
          />
        }
      >
        <p>
          <span className="font-medium">Description:</span> {course.description}
        </p>
        <p>
          <span className="font-medium">Category:</span> {course.categoryName}
        </p>
        <p>
          <span className="font-medium">Level:</span> {course.levelName}
        </p>
        <p>
          <span className="font-medium">Duration:</span> {course.durationHours}{" "}
          hours
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span
            className={
              course.isActive ? "text-green-600 font-semibold" : "text-gray-400"
            }
          >
            {course.isActive ? "Active" : "Inactive"}
          </span>
        </p>
        <p>
          <span className="font-medium">Price:</span> ${course.price}
        </p>
      </Card>
    </div>
  );
};

export default CourseDetail;
