import React, { useEffect, useState } from "react";
import { fetchCourseDetail } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { Card, Spin, Tag, Alert } from "antd";

const ManagerCourseCard = ({ courseId, order }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCourseDetail(courseId)
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) return <Spin size="small" />;
  if (error) return <Alert type="error" message={error} />;
  if (!course) return null;

  return (
    <Card
      size="small"
      title={
        <span>
          #{order} - {course.name}
        </span>
      }
      className="mb-2"
      cover={
        <img
          alt={course.name}
          src={course.imageUrl}
          className="object-cover h-40 w-full"
        />
      }
    >
      <div className="mb-2">
        <Tag color="blue">{course.categoryName}</Tag>
        <Tag color="purple">{course.levelName}</Tag>
        <Tag color={course.isActive ? "green" : "default"}>
          {course.isActive ? "Active" : "Inactive"}
        </Tag>
      </div>
      <div className="text-gray-700 mb-2">{course.description}</div>
      <div className="flex flex-wrap gap-4 text-sm">
        <span>
          <strong>Duration:</strong> {course.durationHours} hours
        </span>
        <span>
          <strong>Price:</strong> ${course.price}
        </span>
        <span>
          <strong>Code:</strong> {course.courseCodeName}
        </span>
      </div>
    </Card>
  );
};

export default ManagerCourseCard;
