import React, { useEffect, useState } from "react";
import { fetchPrograms } from "../../../apis/Trainee/TraineeProgramApi";
import { Input, Skeleton, Alert, Empty, Pagination } from "antd";
import ProgramCard from "./partials/ProgramCard";
import { useNavigate } from "react-router";
import PageNav from "../../../components/PageNav/PageNav";

const { Search } = Input;

const Program = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // searchInput: current text user is typing (no fetch on each key)
  // searchValue: committed term (Enter / search button) used to fetch
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    fetchPrograms({
      PageNumber: pageNumber,
      PageSize: pageSize,
      IsActive: true,
      IsDeleted: false,
      SearchTerm: searchValue || undefined,
    })
      .then((data) => {
        if (isCancelled) return;
        const items = data?.items || data?.data || [];
        setPrograms(items);
        // Try to find total from common keys; fallback to items length
        const t = data?.totalItems ?? data?.total ?? data?.totalCount ?? items.length ?? 0;
        setTotal(typeof t === 'number' ? t : Number(t) || 0);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [pageNumber, pageSize, searchValue]);

  // Optional: Reset to first page when searching
  useEffect(() => {
    setPageNumber(1);
  }, [searchValue]);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageNav nameMap={{ program: 'Programs' }} />
        <h2 className="text-2xl font-bold mb-6">Programs</h2>
        <div className="mb-8">
          <Skeleton.Input active size="large" className="!w-full md:!w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow">
              <div className="w-full h-40 overflow-hidden rounded-t-lg">
                <Skeleton.Image active className="!w-full !h-40" />
              </div>
              <div className="p-4">
                <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav nameMap={{ program: 'Programs' }} />
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Programs</h2>
      <Search
        placeholder="Search programs by name"
        allowClear
        size="large"
        className="mb-8"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onSearch={(v) => {
          setSearchValue(v.trim());
        }}
        enterButton
      />
      {programs.length === 0 ? (
        <Empty description="No programs found." className="mt-16" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => navigate(`/program/${program.id}`)}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              onChange={(page, size) => {
                setPageNumber(page);
                setPageSize(size);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Program;
