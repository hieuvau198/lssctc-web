// src\app\pages\Instructor\InstructorClasses\partials\TestDisplayClassList.jsx

import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Typography } from "antd";
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
      <div className="flex justify-center items-center h-64">
        <Spin tip="Loading classes..." />
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
