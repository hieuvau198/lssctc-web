import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProgramDetail } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { Card, Spin, Alert, Tag, Button, Empty } from "antd";
import ManagerCourseCard from "./ManagerCourseCard";

const ManagerProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProgramDetail(id)
      .then((data) => {
        setProgram(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spin className="block mx-auto my-16" />;
  if (error) return <Alert type="error" message={error} className="my-8" />;
  if (!program) return <Empty description="Program not found" />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Button onClick={() => navigate(-1)} className="mb-4">
        Back
      </Button>
      <Card
        cover={
          <img
            alt={program.name}
            src={program.imageUrl}
            className="object-cover h-56 w-full"
          />
        }
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">{program.name}</h2>
        <Tag color={program.isActive ? "green" : "default"}>
          {program.isActive ? "Active" : "Inactive"}
        </Tag>
        <p className="mt-2 mb-4">{program.description}</p>
        <p>
          <span className="font-medium">Duration:</span> {program.durationHours}{" "}
          hours
        </p>
        <p>
          <span className="font-medium">Total Courses:</span>{" "}
          {program.totalCourses}
        </p>
        {program.entryRequirements && program.entryRequirements.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Entry Requirements</h4>
            <ul className="list-disc ml-6">
              {program.entryRequirements.map((pre, idx) => (
                <li key={idx}>
                  <span className="font-medium">{pre.name}:</span>{" "}
                  {pre.description}
                  {pre.documentUrl && (
                    <span className="ml-2 text-xs text-blue-600">
                      <a
                        href={pre.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        [Document]
                      </a>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
      <h3 className="text-xl font-semibold mb-3">Courses</h3>
      {program.courses && program.courses.length > 0 ? (
        <div className="space-y-4">
          {[...program.courses]
            .sort((a, b) => a.courseOrder - b.courseOrder)
            .map((course) => (
              <ManagerCourseCard
                key={course.id}
                courseId={course.coursesId || course.id}
                order={course.courseOrder}
                programCourseId={course.programCourseId || course.id}
              />
            ))}
        </div>
      ) : (
        <Empty description="No courses in this program." />
      )}
    </div>
  );
};

export default ManagerProgramDetail;
