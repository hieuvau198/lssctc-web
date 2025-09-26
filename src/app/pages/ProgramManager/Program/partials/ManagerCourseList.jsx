import React, { useEffect, useState } from "react";
import { fetchCourses } from "../../../../apis/ProgramManager/ProgramManagerCourseApi";
import { Input, Spin, Pagination, Button } from "antd";

const ManagerCourseList = ({ onAdd, selectedIds = [] }) => {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCourses({ pageNumber, pageSize, searchTerm: search, isActive: true })
      .then((data) => {
        setCourses(data.items);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageNumber, pageSize, search]);

  return (
    <div>
      <Input.Search
        placeholder="Search courses"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPageNumber(1);
        }}
        style={{ maxWidth: 300, marginBottom: 8 }}
        allowClear
      />
      <div className="border rounded p-2 bg-gray-50">
        {loading ? (
          <Spin />
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between py-1 border-b last:border-b-0"
            >
              <span>
                {course.name}{" "}
                <span className="text-xs text-gray-500">
                  ({course.categoryName} - {course.levelName})
                </span>
              </span>
              <Button
                size="small"
                onClick={() => onAdd(course)}
                disabled={selectedIds.includes(course.id)}
              >
                Add
              </Button>
            </div>
          ))
        )}
        <div className="flex justify-center mt-2">
          <Pagination
            current={pageNumber}
            pageSize={pageSize}
            total={total}
            onChange={(page, size) => {
              setPageNumber(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={["5", "10", "20"]}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerCourseList;
