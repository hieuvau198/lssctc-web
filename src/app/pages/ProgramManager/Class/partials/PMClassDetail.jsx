/**
 * AC: Class Detail Page
 * - [x] Fetch class detail by id using fetchClassDetail from ClassApi.js
 * - [x] Show basic info: name, dates, capacity, code, description, status
 * - [x] Show instructor info (only one)
 * - [x] Show member list (trainee)
 * - [x] Loading & error state
 * - [x] TailwindCSS only, no new dependencies
 * - [x] Responsive, accessible, clean UI
 */

// filepath: d:\FPT_Uni\Semester_9\SEP\Frontend\lssctc-web\src\app\pages\ProgramManager\Class\partials\PMClassDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert, Button } from "antd";
import { fetchClassDetail } from "../../../../apis/ProgramManager/ClassApi";
import EditDeleteClassForm from "./EditDeleteClassForm";

const PMClassDetail = () => {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit/Delete modal state
  const [editOpen, setEditOpen] = useState(false);

  // Refresh class detail
  const refreshDetail = () => {
    setLoading(true);
    fetchClassDetail(id)
      .then((data) => {
        setClassDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch class detail");
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshDetail();
    // eslint-disable-next-line
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading class detail..." />
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  if (!classDetail) return null;

  const instructor = classDetail.instructors?.[0]?.instructor;
  const members = classDetail.members || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{classDetail.name}</h1>
        <Button type="primary" onClick={() => setEditOpen(true)}>
          Edit / Delete
        </Button>
      </div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <div className="mb-2 flex flex-col gap-1">
            <span className="text-sm text-gray-600">
              <span className="font-medium">Start:</span>{" "}
              {classDetail.startDate?.slice(0, 10) || "-"}
            </span>
            <span className="text-sm text-gray-600">
              <span className="font-medium">End:</span>{" "}
              {classDetail.endDate?.slice(0, 10) || "-"}
            </span>
            <span className="text-sm text-gray-600">
              <span className="font-medium">Capacity:</span>{" "}
              {classDetail.capacity}
            </span>
            <span className="text-sm text-gray-600">
              <span className="font-medium">Class Code:</span>{" "}
              {classDetail.classCode?.name || "-"}
            </span>
            <span className="text-sm text-gray-600">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={
                  classDetail.status === "1"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {classDetail.status === "1" ? "Active" : "Inactive"}
              </span>
            </span>
          </div>
        </section>
        <section>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Description:</span>{" "}
            {classDetail.description || "-"}
          </div>
        </section>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Instructor</h2>
        {instructor ? (
          <div className="border rounded p-4 bg-gray-50 flex flex-col gap-1">
            <div className="font-medium text-base">
              {instructor.fullName || "N/A"}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Email:</span>{" "}
              {instructor.email || "No email"}
            </div>
            <div className="text-sm">
              <span className="font-medium">Code:</span>{" "}
              {instructor.instructorCode}
            </div>
            <div className="text-sm">
              <span className="font-medium">Specialization:</span>{" "}
              {instructor.specialization || "-"}
            </div>
            <div className="text-sm">
              <span className="font-medium">Experience:</span>{" "}
              {instructor.experienceYears} years
            </div>
            <div className="text-sm">
              <span className="font-medium">Active:</span>{" "}
              {instructor.isActive ? (
                <span className="text-green-600 font-semibold">Yes</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No instructor assigned.</div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Members</h2>
        {members.length === 0 ? (
          <div className="text-gray-500">No members.</div>
        ) : (
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">#</th>
                  <th className="py-2 px-3 text-left">Full Name</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Code</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Assigned Date</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => (
                  <tr key={m.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{idx + 1}</td>
                    <td className="py-2 px-3">
                      {m.trainee?.fullName || "N/A"}
                    </td>
                    <td className="py-2 px-3">{m.trainee?.email || "N/A"}</td>
                    <td className="py-2 px-3">{m.trainee?.traineeCode}</td>
                    <td className="py-2 px-3">
                      {m.status === "1" ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {m.assignedDate?.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <EditDeleteClassForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        classItem={classDetail}
        onUpdated={refreshDetail}
        onDeleted={refreshDetail}
      />
    </div>
  );
};

export default PMClassDetail;
