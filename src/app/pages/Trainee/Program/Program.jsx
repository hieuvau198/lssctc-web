import React, { useEffect, useState } from "react";
import { fetchPrograms } from "../../../apis/Trainee/TraineeProgramApi";
import { Input, Skeleton, Alert, Empty, Pagination } from "antd";
import { useTranslation } from 'react-i18next';
import ProgramCard from "../../../components/ProgramCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageNav from "../../../components/PageNav/PageNav";

const { Search } = Input;

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav nameMap={{ program: t('trainee.programs.title') }} />
      <span className="text-2xl mb-4">{t('trainee.programs.title')}</span>
      {/* prevent full page reload when pressing Enter */}
      <form onSubmit={(e) => e.preventDefault()}>
        <Search
          placeholder={t('trainee.programs.searchPlaceholder')}
          allowClear
          className="mb-8"
          value={searchInput}
          onChange={(e) => {
            const v = e.target.value;
            setSearchInput(v);
            // if user cleared the input using the clear button, trigger search immediately
            if (v === "") {
              setSearchValue("");
              setPageNumber(1);
            }
          }}
          onSearch={(v) => {
            const trimmed = v.trim();
            setSearchValue(trimmed);
            setPageNumber(1);
          }}
          enterButton
        />
      </form>

      {/* Content area: keep search visible while swapping only cards/pagination */}
      {error ? (
        <div className="max-w-md mx-auto mt-4">
          <Alert message="Error" description={error} type="error" showIcon />
        </div>
      ) : (
        <>
          {loading ? (
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
          ) : programs.length === 0 ? (
            <Empty description={t('trainee.programs.noPrograms')} className="mt-16 min-h-[350px]" />
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
        </>
      )}
    </div>
  );
};

export default Program;
