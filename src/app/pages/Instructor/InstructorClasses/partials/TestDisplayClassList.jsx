// src\app\pages\Instructor\InstructorClasses\partials\TestDisplayClassList.jsx

import { Alert, Skeleton, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { getInstructorClasses } from "../../../../apis/Instructor/InstructorApi";

const { Title } = Typography;

export default function TestDisplayClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Change instructorId to test different instructors
  const instructorId = 2;

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const result = await getInstructorClasses(instructorId);
        setClasses(result);
      } catch (err) {
        setError(err?.message || "Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, [instructorId]);

  const columns = [
    { title: "Class ID", dataIndex: "classId", key: "classId", width: 90 },
    { title: "Class Name", dataIndex: "name", key: "name" },
    { title: "Code", dataIndex: "classCode", key: "classCode", width: 100 },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleString(),
    },
    { title: "Capacity", dataIndex: "capacity", key: "capacity", width: 100 },
    {
      title: "Program Course ID",
      dataIndex: "programCourseId",
      key: "programCourseId",
      width: 150,
    },
    { title: "Status", dataIndex: "status", key: "status", width: 100 },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Skeleton.Button style={{ width: 240, height: 28 }} active />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border-b last:border-b-0">
              <Skeleton.Avatar size={48} shape="square" active />
              <div className="flex-1">
                <Skeleton.Input style={{ width: '60%', height: 16, marginBottom: 8 }} active />
                <Skeleton.Input style={{ width: '40%', height: 12 }} active />
              </div>
              <div className="w-24">
                <Skeleton.Button size="small" active />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Title level={3} className="mb-4">
        Instructor’s Classes
      </Title>
      <Table
        dataSource={classes}
        columns={columns}
        rowKey="classId"
        pagination={false}
      />
    

    </div>
  );
}
