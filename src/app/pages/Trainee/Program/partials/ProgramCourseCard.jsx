import React, { useEffect, useState } from "react";
import { fetchCourseDetail } from "../../../../apis/Trainee/TraineeProgramApi";
import { Card, Skeleton, Alert, Tag } from "antd";

const ProgramCourseCard = ({ courseId, order }) => {
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

  if (loading)
    return (
      <div className="mb-2">
        <Card size="small" className="mb-2">
          <Skeleton active title paragraph={{ rows: 2 }} />
        </Card>
      </div>
    );
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;
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
      style={{
        background: "#f6ffed",
        borderColor: "#b7eb8f",
        borderRadius: 8,
      }}
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

export default ProgramCourseCard;
