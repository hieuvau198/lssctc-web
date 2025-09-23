import React from "react";
import { Card, Tag, Space } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

const CourseCard = ({ course, onView, onEdit }) => (
  <Card
    hoverable
    className="rounded-lg shadow flex flex-col h-full"
    actions={[
      <EyeOutlined key="view" onClick={() => onView(course.id)} />,
      <EditOutlined key="edit" onClick={() => onEdit(course)} />,
    ]}
  >
    <img
      alt={course.name}
      src={course.imageUrl}
      className="object-cover h-40 w-full mb-2"
    />
    <Card.Meta
      title={
        <Space>
          <span className="font-semibold">{course.name}</span>
          {course.isActive ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="default">Inactive</Tag>
          )}
        </Space>
      }
      description={
        <div>
          <p className="mb-2">{course.description}</p>
          <p>
            <span className="font-medium">Category:</span> {course.categoryName}
          </p>
          <p>
            <span className="font-medium">Level:</span> {course.levelName}
          </p>
          <p>
            <span className="font-medium">Price:</span> ${course.price}
          </p>
        </div>
      }
    />
    <div className="mt-auto pt-4 border-t flex flex-col gap-1">
      <p>
        <span className="font-medium">Duration:</span> {course.durationHours}{" "}
        hours
      </p>
      <p>
        <span className="font-medium">Code:</span>{" "}
        {course.courseCodeName || "-"}
      </p>
    </div>
  </Card>
);

export default CourseCard;
