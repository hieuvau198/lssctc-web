import React from "react";
import { Card, Tag, Button, Tooltip, Popconfirm, Pagination } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Individual Card component
const ProgramCard = ({ program, onView, onEdit, onDelete, deletingId }) => (
  <Card
    hoverable
    className="rounded-lg shadow flex flex-col h-full"
    cover={
      <div
        className="h-40 overflow-hidden cursor-pointer"
        onClick={() => onView(program)}
      >
        <img
          alt={program.name}
          src={program.imageUrl}
          className="object-cover h-full w-full"
        />
      </div>
    }
    actions={[
      <Tooltip title="View Details" key="view">
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => onView(program)}
        />
      </Tooltip>,
      <Tooltip title="Edit Program" key="edit">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(program)}
        />
      </Tooltip>,
      <Tooltip title="Delete Program" key="delete">
        <Popconfirm
          title="Delete program?"
          description="Are you sure you want to delete this program?"
          onConfirm={() => onDelete(program.id)}
          okButtonProps={{ loading: deletingId === program.id }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deletingId === program.id}
          />
        </Popconfirm>
      </Tooltip>,
    ]}
  >
    <div className="flex-1 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3
          className="font-semibold text-slate-900 line-clamp-2 flex-1 cursor-pointer"
          onClick={() => onView(program)}
        >
          {program.name}
        </h3>
        <Tag color={program.isActive ? "green" : "red"} className="m-0">
          {program.isActive ? "Active" : "Inactive"}
        </Tag>
      </div>
      <p className="text-xs text-slate-600 line-clamp-2 mb-2">
        {program.description}
      </p>
      <div className="mt-auto pt-3 border-t text-xs text-slate-700 space-y-1">
        <div>
          <span className="font-medium">Duration:</span> {program.durationHours}h
        </div>
        <div>
          <span className="font-medium">Total Courses:</span> {program.totalCourses || 0}
        </div>
      </div>
    </div>
  </Card>
);

// Main Card View component
const ProgramCardView = ({ 
  programs, 
  pageNumber, 
  pageSize, 
  total, 
  onPageChange, 
  onView, 
  onEdit, 
  onDelete, 
  deletingId 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programs.map((program) => (
          <ProgramCard 
            key={program.id} 
            program={program} 
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            deletingId={deletingId}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger={true}
          pageSizeOptions={["10", "20", "50"]}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} programs`
          }
        />
      </div>
    </>
  );
};

export default ProgramCardView;