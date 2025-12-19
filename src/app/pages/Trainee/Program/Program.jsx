import { SearchOutlined } from "@ant-design/icons";
import { Alert, Button, Pagination, Skeleton } from "antd";
import { GraduationCap, Search, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchPrograms } from "../../../apis/Trainee/TraineeProgramApi";
import PageNav from "../../../components/PageNav/PageNav";
import ProgramCard from "../../../components/ProgramCard";

const Program = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    () => Number(searchParams.get("pageSize")) || 12
  );
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchValue) params.set("search", searchValue);
    params.set("page", pageNumber);
    params.set("pageSize", pageSize);
    setSearchParams(params);
  }, [pageNumber, pageSize, searchValue, setSearchParams]);

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
        const rawItems = data?.items || data?.data || data || [];

        const mapProgram = (p) => ({
          id: p.id ?? p.programId ?? p.program_id,
          name: p.name ?? p.title ?? '',
          description: p.description ?? p.summary ?? '',
          isActive: p.isActive ?? p.is_active ?? p.active ?? false,
          durationHours: p.durationHours ?? p.duration ?? p.duration_hours ?? 0,
          totalCourses: p.totalCourses ?? p.total_courses ?? p.courseCount ?? 0,
          imageUrl: p.imageUrl ?? p.image ?? p.image_url ?? p.thumbnailUrl ?? p.thumbnail_url ?? '',
          _raw: p,
        });

        const items = Array.isArray(rawItems) ? rawItems.map(mapProgram) : [];
        setPrograms(items);
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Industrial Style */}
      <section className="relative bg-black text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://i.ibb.co/fGDt4tzT/hinh-anh-xe-cau-3-1024x683.jpg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/industrial-crane-construction-site.jpg";
            }}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative max-w-7xl mx-auto px-6">
          <PageNav
            nameMap={{ program: t('trainee.programs.title') }}
            className="mb-4 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  LSSCTC ACADEMY
                </span>
                <span className="h-1 w-1 rounded-full bg-yellow-400" />
                <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
                  Chương trình đào tạo
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tight mb-5 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
                {t('trainee.programs.title')}
              </h1>

              <p className="text-xl text-white max-w-xl mb-6 leading-relaxed font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Khám phá các chương trình đào tạo toàn diện về vận hành cần cẩu, an toàn lao động và kỹ năng logistics chuyên nghiệp.
              </p>
            </div>

            {/* Right: Search Box */}
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              <div className="bg-white border-4 border-black p-6">
                <div className="h-2 bg-yellow-400 -mx-6 -mt-6 mb-6" />
                <h3 className="font-black text-black mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Search className="w-5 h-5 text-yellow-500" />
                  Tìm kiếm chương trình
                </h3>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
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
                      className="w-full px-4 py-3.5 bg-neutral-50 border-2 border-neutral-900 focus:outline-none focus:border-yellow-400 transition-all duration-300 text-neutral-900 placeholder-neutral-400"
                      style={{ color: '#000' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-all flex items-center justify-center gap-2"
                  >
                    <SearchOutlined />
                    Tìm kiếm
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-6 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-6">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Danh sách
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-1">
              Tất cả chương trình
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {error ? (
            <div className="max-w-md mx-auto">
              <Alert message="Error" description={error} type="error" showIcon />
            </div>
          ) : (
            <>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="bg-white border-2 border-neutral-900 overflow-hidden">
                      <div className="h-2 bg-neutral-200" />
                      <div className="w-full h-44 overflow-hidden">
                        <Skeleton.Image active className="!w-full !h-44" />
                      </div>
                      <div className="p-5">
                        <Skeleton active title={{ width: '70%' }} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : programs.length === 0 ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center">
                  <div className="w-32 h-32 bg-neutral-200 flex items-center justify-center mb-6">
                    <GraduationCap className="w-16 h-16 text-neutral-400" />
                  </div>
                  <p className="text-neutral-900 text-xl font-black uppercase mb-2">{t('trainee.programs.noPrograms')}</p>
                  <p className="text-neutral-500 text-sm">Không tìm thấy chương trình nào phù hợp với tìm kiếm của bạn</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {programs.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        onClick={() => {
                          window.scrollTo({ top: 0 });
                          navigate(`/program/${program.id}`);
                        }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-12 flex justify-center">
                    <div className="bg-white border-2 border-neutral-900 px-6 py-4">
                      <Pagination
                        current={pageNumber}
                        pageSize={pageSize}
                        total={total}
                        showSizeChanger
                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} chương trình`}
                        onChange={(page, size) => {
                          window.scrollTo({ top: 300 });
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
      </section>
    </div>
  );
};

export default Program;
