import { SearchOutlined } from "@ant-design/icons";
import { Alert, Button, Pagination, Skeleton } from "antd";
import { GraduationCap, Search, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-cyan-50/80 via-blue-50/50 to-white border-b border-slate-200/60 overflow-hidden">
        {/* Decorative Blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-10">
          <PageNav nameMap={{ program: t('trainee.programs.title') }} />

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full border border-cyan-200/60 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-medium text-cyan-700">Chương trình đào tạo chuyên nghiệp</span>
              </div>

              <div className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                  {t('trainee.programs.title')}
                </span>
              </div>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Khám phá các chương trình đào tạo toàn diện về vận hành cần cẩu, an toàn lao động và kỹ năng logistics chuyên nghiệp.
              </p>
            </div>

            {/* Right: Search Box */}
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-cyan-500" />
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
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-300 text-slate-700 placeholder-slate-400"
                    />
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    icon={<SearchOutlined />}
                    className="!rounded-xl !h-12 !font-semibold"
                  >
                    Tìm kiếm
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-10">
        {error ? (
          <div className="max-w-md mx-auto">
            <Alert message="Error" description={error} type="error" showIcon />
          </div>
        ) : (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
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
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <GraduationCap className="w-16 h-16 text-cyan-400" />
                </div>
                <p className="text-slate-700 text-xl font-semibold mb-2">{t('trainee.programs.noPrograms')}</p>
                <p className="text-slate-500 text-sm">Không tìm thấy chương trình nào phù hợp với tìm kiếm của bạn</p>
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
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-6 py-4 shadow-lg shadow-slate-200/50">
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
    </div>
  );
};

export default Program;
