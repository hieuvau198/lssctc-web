import React from "react";

/**
 * @param {Object} props
 * @param {Object} props.classItem
 * @param {Function} props.onDetail
 */
const PMClassCard = ({ classItem, onDetail }) => (
  <div
    className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white cursor-pointer"
    onClick={() => onDetail && onDetail(classItem.id)}
    title="View class detail"
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-lg">{classItem.name}</h3>
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
        {classItem.status === "1" ? "Active" : "Inactive"}
      </span>
    </div>
    <div className="text-sm text-gray-600 mb-1">
      <span>Start: {classItem.startDate?.slice(0, 10)}</span>
      {" | "}
      <span>End: {classItem.endDate?.slice(0, 10)}</span>
    </div>
    <div className="text-sm mb-1">
      <span>Capacity: {classItem.capacity}</span>
    </div>
    <div className="text-sm mb-1">
      <span>Class Code: {classItem.classCode?.name}</span>
    </div>
    <div className="text-sm text-gray-500">{classItem.description}</div>
  </div>
);

export default PMClassCard;
