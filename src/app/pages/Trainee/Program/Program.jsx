import React, { useEffect, useState } from "react";
import { fetchPrograms } from "../../../apis/Trainee/TraineeProgramApi";
import { Skeleton, Alert, Pagination } from "antd";
import { useTranslation } from 'react-i18next';
import ProgramCard from "../../../components/ProgramCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageNav from "../../../components/PageNav/PageNav";
import { Search, BookOpen, GraduationCap } from "lucide-react";

const Program = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read from URL params on first render, else use defaults
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || ""
  );
  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("search") || ""
  );
  const [pageNumber, setPageNumber] = useState(
    () => Number(searchParams.get("page")) || 1
  );
  const [pageSize, setPageSize] = useState(
    () => Number(searchParams.get("pageSize")) || 10
  );
  const [total, setTotal] = useState(0);

  // Sync state to URL whenever pageNumber, pageSize, or searchValue changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchValue) params.set("search", searchValue);
    params.set("page", pageNumber);
    params.set("pageSize", pageSize);
    setSearchParams(params);
  }, [pageNumber, pageSize, searchValue, setSearchParams]);

  // Fetch programs whenever params change
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
        // Normalize API response: support paged ({items, totalCount}) or plain array
        const rawItems = data?.items || data?.data || data || [];

        // Map fields from API to UI-friendly names. API may return different aliases.
        const mapProgram = (p) => ({
          id: p.id ?? p.programId ?? p.program_id,
          name: p.name ?? p.title ?? '',
          description: p.description ?? p.summary ?? '',
          isActive: p.isActive ?? p.is_active ?? p.active ?? false,
          durationHours: p.durationHours ?? p.duration ?? p.duration_hours ?? 0,
          totalCourses: p.totalCourses ?? p.total_courses ?? p.courseCount ?? 0,
          imageUrl: p.imageUrl ?? p.image ?? p.image_url ?? p.thumbnailUrl ?? p.thumbnail_url ?? '',
          // keep original raw object for other needs
          _raw: p,
        });

        const items = Array.isArray(rawItems) ? rawItems.map(mapProgram) : [];
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

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setSearchValue(trimmed);
    setPageNumber(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <PageNav nameMap={{ program: t('trainee.programs.title') }} />

        {/* Header Section */}
        <div className="mt-2 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-1">
                {t('trainee.programs.title')}
              </span>
            </div>
          </div>

          {/* Modern Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={t('trainee.programs.searchPlaceholder')}
                value={searchInput}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchInput(v);
                  if (v === "") {
                    setSearchValue("");
                    setPageNumber(1);
                  }
                }}
                className="w-full pl-12 pr-32 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-300 text-slate-700 placeholder-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>

        {/* Content Area */}
        {error ? (
          <div className="max-w-md mx-auto mt-4">
            <Alert message="Error" description={error} type="error" showIcon />
          </div>
        ) : (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
                    <div className="w-full h-40 overflow-hidden">
                      <Skeleton.Image active className="!w-full !h-40" />
                    </div>
                    <div className="p-5">
                      <Skeleton active title={{ width: '70%' }} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : programs.length === 0 ? (
              <div className="min-h-[350px] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <GraduationCap className="w-12 h-12 text-slate-400" />
                </div>
                <p className="text-slate-600 text-lg font-medium">{t('trainee.programs.noPrograms')}</p>
                <p className="text-slate-400 text-sm mt-2">Không tìm thấy chương trình nào phù hợp</p>
              </div>
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

                {/* Modern Pagination */}
                <div className="mt-10 flex justify-center">
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-4 py-3 shadow-lg shadow-slate-200/50">
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
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Program;

