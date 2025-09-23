import React from "react";
import { Card, Button } from "antd";

const ProgramCard = ({ program, onEdit, onDelete }) => (
  <Card
    hoverable
    className="rounded-lg shadow flex flex-col h-full"
    cover={
      <img
        alt={program.name}
        src={program.imageUrl}
        className="object-cover h-40 w-full"
      />
    }
    bodyStyle={{ display: "flex", flexDirection: "column", height: "100%" }}
  >
    <div style={{ flex: 1 }}>
      <Card.Meta
        title={<span className="font-semibold">{program.name}</span>}
        description={
          <div>
            <p className="mb-2">{program.description}</p>
          </div>
        }
      />
    </div>
    <div className="flex flex-wrap gap-4 text-sm mt-4 mb-2 border-t pt-3">
      <span>
        <span className="font-medium">Duration:</span> {program.durationHours}{" "}
        hours
      </span>
      <span>
        <span className="font-medium">Total Courses:</span>{" "}
        {program.totalCourses}
      </span>
    </div>
    <div className="flex justify-end gap-2 mt-auto">
      <Button type="link" onClick={onEdit}>
        Edit
      </Button>
      <Button type="link" danger onClick={onDelete}>
        Delete
      </Button>
    </div>
  </Card>
);

export default ProgramCard;
