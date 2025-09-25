import React from "react";
import { Card, Tag } from "antd";

const ProgramCard = ({ program, onClick }) => (
  <Card
    hoverable
    onClick={onClick}
    cover={
      <img
        alt={program.name}
        src={program.imageUrl}
        className="object-cover h-48 w-full"
      />
    }
    className="rounded-lg shadow flex flex-col h-full"
    bodyStyle={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
    <div className="flex flex-col flex-1">
      <Card.Meta
        title={<span className="font-semibold">{program.name}</span>}
        description={
          <div className="mb-4">
            <p className="mb-2">{program.description}</p>
          </div>
        }
      />
      <div className="mt-auto pt-4 border-t flex flex-col gap-1">
        <p>
          <span className="font-medium">Duration:</span> {program.durationHours}{" "}
          hours
        </p>
        <p>
          <span className="font-medium">Total Courses:</span>{" "}
          {program.totalCourses}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <Tag color={program.isActive ? "green" : "red"}>
            {program.isActive ? "Active" : "Inactive"}
          </Tag>
        </p>
      </div>
    </div>
  </Card>
);

export default ProgramCard;
