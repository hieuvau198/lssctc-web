import React, { useEffect, useState } from "react";
import { fetchCourseDetail } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { fetchClassesByProgramCourse } from "../../../../apis/ProgramManager/ClassApi";
import { Card, Spin, Tag, Alert, Button } from "antd";
import { DownOutlined, UpOutlined, PlusOutlined } from "@ant-design/icons";
import PMClassCard from "../../../Admin/Class/partials/PMClassCard";
import AddClassForm from "../../../Admin/Class/partials/AddClassForm";

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
  const loadClasses = () => {
    setLoadingClasses(true);
    fetchClassesByProgramCourse(programCourseId)
      .then((data) => {
        setClasses(data);
        setLoadingClasses(false);
      })
      .catch(() => setLoadingClasses(false));
  };

  useEffect(() => {
    if (showClasses) {
      loadClasses();
    }
  }, [showClasses, programCourseId]);

  const handleClassCreated = () => {
    setAddOpen(false);
    setShowClasses(true);
    loadClasses();
  };

  if (loading) return <Spin size="small" />;
  if (error) return <Alert type="error" message={error} />;
  if (!course) return null;

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
            #{order}
          </span>
          <span className="font-medium">{course.name}</span>
        </div>
      }
      className="mb-2 border-slate-200 hover:border-blue-300 transition-colors"
      extra={
        <div className="flex gap-1">
          <Button
            type="text"
            size="small"
            icon={showClasses ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setShowClasses((v) => !v)}
            title={showClasses ? "Hide classes" : "Show classes"}
          />
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setAddOpen(true)}
            title="Add class"
          />
        </div>
      }
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Course Image */}
        <div className="md:w-32 md:h-20 w-full h-32 flex-shrink-0">
          <img
            alt={course.name}
            src={course.imageUrl}
            className="object-cover w-full h-full rounded border"
          />
        </div>
        
        {/* Course Info */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-1">
            <Tag color="blue" size="small">{course.categoryName}</Tag>
            <Tag color="purple" size="small">{course.levelName}</Tag>
            <Tag color={course.isActive ? "green" : "red"} size="small">
              {course.isActive ? "Active" : "Inactive"}
            </Tag>
          </div>
          
          {course.description && (
            <div className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span><span className="font-medium">Duration:</span> {course.durationHours}h</span>
            <span><span className="font-medium">Price:</span> ${course.price}</span>
            <span><span className="font-medium">Code:</span> {course.courseCodeName}</span>
          </div>
        </div>
      </div>
      
      {showClasses && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-gray-700">Classes ({classes.length})</h4>
          </div>
          {loadingClasses ? (
            <div className="flex justify-center py-4">
              <Spin size="small" />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No classes for this course.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {classes.map((classItem) => (
                <PMClassCard 
                  key={classItem.id} 
                  classItem={classItem}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <AddClassForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        programCourseId={courseId}
        onCreated={handleClassCreated}
      />
    </Card>
  );
};

export default ManagerCourseCard;
