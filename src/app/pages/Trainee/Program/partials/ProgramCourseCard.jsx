import React, { useEffect, useState } from "react";
import { fetchCourseDetail } from "../../../../apis/Trainee/TraineeProgramApi";
import { Card, Skeleton, Alert, Tag } from "antd";

const ProgramCourseCard = ({ courseId, order, variant = 'full' }) => {
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
  const compact = variant === 'curriculum';
  return (
    <Card
      size={compact ? 'small' : 'default'}
      title={
        <span className="text-sm md:text-base font-medium">
          <span className="text-gray-500 mr-1">{order ? `Course ${order}` : ''}</span>
          {course.name}
        </span>
      }
      className={compact ? 'mb-3 border-l-4 border-green-400 hover:shadow-sm transition' : 'mb-2'}
      style={compact ? { background: '#ffffff', borderRadius: 8 } : { background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 8 }}
      cover={!compact && (
        <img
          alt={course.name}
          src={course.imageUrl}
          className="object-cover h-40 w-full"
        />
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs md:text-sm">
        <Tag color="blue" className="m-0">{course.categoryName}</Tag>
        <Tag color="purple" className="m-0">{course.levelName}</Tag>
        <Tag color={course.isActive ? 'green' : 'default'} className="m-0">
          {course.isActive ? 'Active' : 'Inactive'}
        </Tag>
        <span className="text-gray-500">{course.durationHours}h</span>
        {course.price != null && <span className="text-gray-500">${course.price}</span>}
      </div>
      {!compact && (
        <div className="text-gray-700 mb-2 text-sm md:text-base">{course.description}</div>
      )}
      {compact && (
        <div className="text-gray-600 text-sm line-clamp-2 mb-1">{course.description}</div>
      )}
      <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-600">
        <span><strong>Code:</strong> {course.courseCodeName}</span>
      </div>
    </Card>
  );
};

export default ProgramCourseCard;
