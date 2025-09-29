import React, { useEffect, useState } from "react";
import { Input, Spin, Alert, Empty, Pagination, Button } from "antd";
import { fetchPrograms } from "../../../apis/ProgramManager/ProgramManagerCourseApi";
import ManagerProgramCard from "./partials/ManagerProgramCard";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const ManagerProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchPrograms({ pageNumber, pageSize, searchTerm })
      .then((data) => {
        setPrograms(data.items);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageNumber, pageSize, searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
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
        <Button
          type="primary"
          onClick={() => navigate("/programManager/programs/create")}
        >
          + Add Program
        </Button>
      </div>
      <Search
        placeholder="Search programs by name"
        allowClear
        size="large"
        className="mb-8"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
        style={{ maxWidth: 320 }}
      />
      {programs.length === 0 ? (
        <Empty description="No programs found." className="mt-16" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <ManagerProgramCard
                key={program.id}
                program={program}
                onEdit={() =>
                  navigate(`/programManager/programs/${program.id}/edit`)
                }
                onDetail={() =>
                  navigate(`/programManager/programs/${program.id}`)
                }
                onDelete={() => {
                  /* handle delete */
                }}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={total}
              onChange={(page, size) => {
                setPageNumber(page);
                setPageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={["6", "12", "24", "48"]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerProgramList;
