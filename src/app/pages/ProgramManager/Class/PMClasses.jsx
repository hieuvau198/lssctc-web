import React, { useEffect, useState } from "react";
import { Pagination, Spin, Alert, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchClasses } from "../../../apis/ProgramManager/ClassApi";
import PMClassCard from "./partials/PMClassCard";

const PMClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchClasses({ page, pageSize })
      .then((data) => {
        setClasses(data.items || []);
        setTotal(data.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch classes");
        setLoading(false);
      });
  }, [page, pageSize]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading classes..." />
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
      <h2 className="text-2xl font-bold mb-6">All Classes</h2>
      {classes.length === 0 ? (
        <Empty description="No classes found." className="mt-16" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <PMClassCard
                key={classItem.id}
                classItem={classItem}
                onDetail={(id) => navigate(`/programManager/classes/${id}`)}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(p, s) => {
                setPage(p);
                setPageSize(s);
              }}
              showSizeChanger
              pageSizeOptions={["5", "10", "20", "50"]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PMClasses;
