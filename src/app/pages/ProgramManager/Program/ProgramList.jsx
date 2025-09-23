import React, { useEffect, useState } from "react";
import { fetchPrograms } from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import { Input, Spin, Alert, Empty, Button } from "antd";
import ProgramCard from "./partials/ProgramCard";

const { Search } = Input;

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchPrograms({ searchTerm: searchValue })
      .then((data) => {
        setPrograms(data.items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [searchValue]);

  const handleEdit = (program) => {
    // Implement edit logic here
  };

  const handleDelete = (program) => {
    // Implement delete logic here
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading programs..." />
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Program Management</h2>
        <Button type="primary">+ Add Program</Button>
      </div>
      <Search
        placeholder="Search programs by name"
        allowClear
        size="large"
        className="mb-8"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ maxWidth: 320 }}
      />
      {programs.length === 0 ? (
        <Empty description="No programs found." className="mt-16" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onEdit={() => handleEdit(program)}
              onDelete={() => handleDelete(program)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramList;
