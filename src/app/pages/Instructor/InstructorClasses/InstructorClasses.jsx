import { Alert, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getInstructorClasses } from "../../../apis/Instructor/InstructorApi";
import ViewModeToggle from "../../../components/ViewModeToggle/ViewModeToggle";
import ClassFilters from "./partials/ClassFilters";
import ClassList from "./partials/ClassList";
import useAuthStore from "../../../store/authStore";
import { getAuthToken } from "../../../libs/cookies";
import { decodeToken } from "../../../libs/jwtDecode";
import { ChevronRight } from "lucide-react";

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
  const [viewMode, setViewMode] = useState("table");

  const navigate = useNavigate();

  const authState = useAuthStore();
  const instructorIdFromStore = authState.nameid;
  const [instructorId, setInstructorId] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    const decoded = token ? decodeToken(token) : null;
    const resolvedInstructorId =
      instructorIdFromStore ||
      decoded?.nameid ||
      decoded?.nameId ||
      decoded?.sub ||
      null;

    if (!resolvedInstructorId) {
      setError("Instructor ID not available. Please log in again.");
      setLoading(false);
    } else {
      setInstructorId(resolvedInstructorId);
    }
  }, [instructorIdFromStore]);

  useEffect(() => {
    if (!instructorId) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await getInstructorClasses(instructorId, {
          page: pageNumber,
          pageSize,
        });
        if (cancelled) return;

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
  }, [instructorId, pageNumber, pageSize]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  const handlePageChange = (page, size) => {
    setPageNumber(page);
    setPageSize(size);
  };

  const handleViewClass = (classItem) => {
    const id = classItem?.id ?? classItem?.classId;
    if (id) navigate(`/instructor/classes/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <Skeleton active paragraph={{ rows: 6 }} />
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
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
            <span className="uppercase tracking-wider text-xs">Instructor</span>
            <ChevronRight className="h-4 w-4" />
            <span className="uppercase tracking-wider text-xs">Classes</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My Classes
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            View and manage your assigned classes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right px-6 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Classes</div>
          </div>
        </div>
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
    </div>
  );
}
