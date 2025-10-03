import React from "react";
import { Tag, Divider, Card, Empty, Skeleton } from "antd";

const ClassDetailView = ({ classItem, loading }) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!classItem) {
    return <Empty description="No class data" />;
  }

  const instructor = classItem.instructors?.[0]?.instructor;
  const members = classItem.members || [];

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{classItem.name}</h3>
          <Tag color={classItem.status === "1" ? 'green' : 'red'}>
            {classItem.status === "1" ? 'Active' : 'Inactive'}
          </Tag>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <span className="font-medium">Start Date:</span> {classItem.startDate?.slice(0, 10) || "-"}
          </div>
          <div>
            <span className="font-medium">End Date:</span> {classItem.endDate?.slice(0, 10) || "-"}
          </div>
          <div>
            <span className="font-medium">Capacity:</span> {classItem.capacity}
          </div>
          <div>
            <span className="font-medium">Class Code:</span> {classItem.classCode?.name || classItem.classCode || "-"}
          </div>
        </div>
        {classItem.description && (
          <div className="text-sm text-slate-600">
            <span className="font-medium">Description:</span>{" "}
            <span className="whitespace-pre-line">{classItem.description}</span>
          </div>
        )}
      </div>

      {/* Instructor */}
      <div>
        <Divider orientation="left">Instructor</Divider>
        {instructor ? (
          <Card size="small" className="border-slate-200">
            <div className="space-y-2">
              <div className="font-medium text-base">
                {instructor.fullName || "N/A"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Email:</span> {instructor.email || "No email"}
                </div>
                <div>
                  <span className="font-medium">Code:</span> {instructor.instructorCode}
                </div>
                <div>
                  <span className="font-medium">Specialization:</span> {instructor.specialization || "-"}
                </div>
                <div>
                  <span className="font-medium">Experience:</span> {instructor.experienceYears} years
                </div>
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
          </Card>
        ) : (
          <Empty description="No instructor assigned" />
        )}
      </div>

      {/* Members */}
      <div>
        <Divider orientation="left">Members ({members.length})</Divider>
        {members.length === 0 ? (
          <Empty description="No members" />
        ) : (
          <div className="overflow-x-auto rounded border max-h-[360px] overflow-y-auto">
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
    </div>
  );
};

export default ClassDetailView;