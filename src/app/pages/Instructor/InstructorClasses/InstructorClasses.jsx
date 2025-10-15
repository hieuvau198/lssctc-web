import {
  Alert,
  Skeleton
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getInstructorClasses } from "../../../apis/Instructor/InstructorApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import slugify from "../../../lib/slugify";
import ClassFilters from "./partials/ClassFilters";
import ClassList from "./partials/ClassList";

export default function InstructorClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(undefined);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'
  
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const instructorId = 2; // TODO: replace with real instructor id from auth/context
    setLoading(true);
    (async () => {
      try {
        const res = await getInstructorClasses(instructorId, { page: pageNumber, pageSize });
        if (cancelled) return;
        // res may be paged response with items + totalCount
        if (res && Array.isArray(res.items)) {
          setClasses(res.items);
          setTotal(Number(res.totalCount) || res.items.length || 0);
        } else if (Array.isArray(res)) {
          setClasses(res);
          setTotal(res.length || 0);
        } else {
          setClasses([]);
          setTotal(0);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Failed to load classes");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pageNumber, pageSize]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const handlePageChange = (page, size) => {
    setPageNumber(page);
    setPageSize(size);
  };

  const handleViewClass = (classItem) => {
    const slug = slugify(classItem.name);
    navigate(`/instructor/classes/${slug}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton.Button style={{ width: 200, height: 32 }} active />
        </div>

        {/* Search and Controls Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Skeleton.Input style={{ width: 320, height: 40 }} active />
          <div className="flex gap-2">
            <Skeleton.Button style={{ width: 80, height: 40 }} active />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-lg shadow p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-b-0">
              <Skeleton.Avatar size={48} shape="square" active />
              <div className="flex-1">
                <Skeleton.Input style={{ width: '60%', height: 20, marginBottom: 8 }} active />
                <Skeleton.Input style={{ width: '40%', height: 16 }} active />
              </div>
              <div className="flex gap-2">
                <Skeleton.Button size="small" active />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Classes</h2>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <ClassFilters
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          status={status}
          setStatus={setStatus}
          onSearch={handleSearch}
        />
        <div className="flex gap-2">
          <ViewModeToggle 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
        </div>
      </div>

      {/* Content */}
      <ClassList
        classes={classes}
        viewMode={viewMode}
        pageNumber={pageNumber}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onView={handleViewClass}
      />

      {/* <TestDisplayClassList /> */}
      
    </div>
  );
}
