import React, { useEffect, useState } from "react";
import { fetchProgramDetail } from "../../../../apis/Trainee/TraineeProgramApi";
import { Spin, Alert, Card, Tag, Empty, Timeline, Button } from "antd";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ProgramCourseCard from "./ProgramCourseCard";

const ProgramDetail = ({ id, onBack }) => {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading program detail..." />
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  if (!program)
    return <Empty description="Program not found." className="mt-16" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        className="mb-4 px-0"
        onClick={onBack}
        style={{ fontSize: 16 }}
      >
        Back to Programs
      </Button>
      <Card
        className="mb-8 shadow-lg"
        cover={
          <img
            alt={program.name}
            src={program.imageUrl}
            className="object-cover h-64 w-full rounded-t"
            style={{ objectPosition: "center" }}
          />
        }
        bodyStyle={{ paddingBottom: 20 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <h2 className="text-3xl font-bold mb-2 md:mb-0">{program.name}</h2>
          <Tag
            color={program.isActive ? "green" : "default"}
            style={{ fontSize: 16, padding: "4px 16px" }}
          >
            {program.isActive ? "Active" : "Inactive"}
          </Tag>
        </div>
        <div className="flex flex-wrap gap-6 mb-4 text-base text-gray-700">
          <span>
            <ClockCircleOutlined className="mr-1" />
            <strong>Duration:</strong> {program.durationHours} hours
          </span>
          <span>
            <BookOutlined className="mr-1" />
            <strong>Courses:</strong> {program.totalCourses}
          </span>
        </div>
        <p className="mb-4 text-lg text-gray-800">{program.description}</p>
        {program.prerequisites && program.prerequisites.length > 0 && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-semibold flex items-center mb-2 text-base">
              <InfoCircleOutlined className="mr-1 text-blue-500" />
              Prerequisites
            </h4>
            <ul className="list-disc ml-6 text-gray-800">
              {program.prerequisites.map((pre, idx) => (
                <li key={idx}>
                  <span className="font-medium">{pre.name}:</span>{" "}
                  {pre.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <Button type="primary" size="large" icon={<UserOutlined />}>
            Enroll Now
          </Button>
        </div>
      </Card>
      <h3 className="text-2xl font-semibold mb-4">Program Courses</h3>
      {program.courses && program.courses.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-4">
          {[...program.courses]
            .sort((a, b) => a.courseOrder - b.courseOrder)
            .map((course) => (
              <ProgramCourseCard
                key={course.id}
                courseId={course.coursesId}
                order={course.courseOrder}
              />
            ))}
        </div>
      ) : (
        <Empty description="No courses in this program." />
      )}
    </div>
  );
};

export default ProgramDetail;
