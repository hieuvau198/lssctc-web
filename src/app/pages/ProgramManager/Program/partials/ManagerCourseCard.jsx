import React, { useEffect, useState } from "react";
import { fetchCourseDetail } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { fetchClassesByProgramCourse } from "../../../../apis/ProgramManager/ClassApi";
import { Card, Spin, Tag, Alert, Button } from "antd";
import { DownOutlined, UpOutlined, PlusOutlined } from "@ant-design/icons";
import PMClassCard from "../../Program/partials/ManagerClassCard";
import AddClassForm from "../../Class/partials/AddClassForm";

const ManagerCourseCard = ({ courseId, order, programCourseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For class list
  const [showClasses, setShowClasses] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // For add class modal
  const [addOpen, setAddOpen] = useState(false);

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

  // Fetch classes when showClasses toggled on
  useEffect(() => {
    if (showClasses) {
      setLoadingClasses(true);
      fetchClassesByProgramCourse(programCourseId)
        .then((data) => {
          setClasses(data);
          setLoadingClasses(false);
        })
        .catch(() => setLoadingClasses(false));
    }
  }, [showClasses, programCourseId, addOpen]);

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
      extra={
        <div className="flex gap-2">
          <Button
            type="text"
            icon={showClasses ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setShowClasses((v) => !v)}
            aria-label={showClasses ? "Hide classes" : "Show classes"}
          />
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => setAddOpen(true)}
            aria-label="Add class"
          />
        </div>
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
      {showClasses && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Classes</h4>
          {loadingClasses ? (
            <Spin size="small" />
          ) : classes.length === 0 ? (
            <div className="text-gray-500">No classes for this course.</div>
          ) : (
            <div className="space-y-2">
              {classes.map((classItem) => (
                <PMClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          )}
        </div>
      )}
      <AddClassForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        programCourseId={programCourseId}
        onCreated={() => setShowClasses(true)}
      />
    </Card>
  );
};

export default ManagerCourseCard;
