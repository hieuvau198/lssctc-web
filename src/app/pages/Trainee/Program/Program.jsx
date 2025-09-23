import React, { useEffect, useState } from "react";
import { fetchPrograms } from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import { Input, Card, Spin, Alert, Empty } from "antd";
import ProgramCard from "./partials/ProgramCard";

const { Search } = Input;

const Program = () => {
  const [programs, setPrograms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(""); // Add state for search input

  useEffect(() => {
    setLoading(true);
    fetchPrograms()
      .then((data) => {
        setPrograms(data.items);
        setFiltered(data.items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Real-time search effect
  useEffect(() => {
    const val = searchValue.trim().toLowerCase();
    if (!val) {
      setFiltered(programs);
      return;
    }
    setFiltered(programs.filter((p) => p.name.toLowerCase().includes(val)));
  }, [searchValue, programs]);

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
      <h2 className="text-2xl font-bold mb-6">Programs</h2>
      <Search
        placeholder="Search programs by name"
        allowClear
        size="large"
        className="mb-8"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {filtered.length === 0 ? (
        <Empty description="No programs found." className="mt-16" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Program;
