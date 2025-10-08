import React from "react";
import { Card, Tag, Button, Tooltip, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CourseCard = ({ course, onSelect, onEdit, onDelete, deletingId }) => {
  return (
    <Card
      hoverable
      className="rounded-lg shadow flex flex-col h-full"
      cover={
        <div
          className="h-40 overflow-hidden cursor-pointer"
          onClick={() => onSelect(course)}
        >
          <img
            alt={course.name}
            src={course.imageUrl}
            className="object-cover h-full w-full"
          />
        </div>
      }
      actions={[
        <Tooltip title="View Details" key="view">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onSelect(course)}
          />
        </Tooltip>,
        <Tooltip title="Edit Course" key="edit">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(course)}
          />
        </Tooltip>,
        <Tooltip title="Delete Course" key="delete">
          <Popconfirm
            title="Delete course?"
            description="Are you sure you want to delete this course?"
            onConfirm={() => onDelete(course.id)}
            okButtonProps={{ loading: deletingId === course.id }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deletingId === course.id}
            />
          </Popconfirm>
        </Tooltip>,
      ]}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-semibold text-slate-900 line-clamp-2 flex-1 cursor-pointer"
            onClick={() => onSelect(course)}
          >
            {course.name}
          </h3>
          <Tag color={course.isActive ? "green" : "red"} className="m-0">
            {course.isActive ? "Active" : "Inactive"}
          </Tag>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
          {course.description}
        </p>
        <div className="mt-auto pt-3 border-t text-xs text-slate-700 space-y-1">
          <div>
            <span className="font-medium">Category:</span> {course.categoryName}
          </div>
          <div>
            <span className="font-medium">Level:</span> {course.levelName}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {course.durationHours}h
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
