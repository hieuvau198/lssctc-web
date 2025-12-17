import React, { useEffect, useState } from 'react';
import { Alert, Empty, Pagination, Skeleton, Input } from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Search, BookOpen } from 'lucide-react';
import CourseCard from '../../../components/CourseCard/CourseCard';
import PageNav from '../../../components/PageNav/PageNav';
import { fetchCourses } from '../../../apis/ProgramManager/CourseApi';

export default function Course() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setSearchValue(searchInput.trim()), 450);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCourses({
      pageNumber,
      pageSize,
      searchTerm: searchValue || '',
      isActive: true,
    })
      .then((res) => {
        if (cancelled) return;
        const items = res?.items || res?.data || res?.records || [];
        setData(items);
        const t = res?.totalItems ?? res?.total ?? res?.totalCount ?? res?.meta?.total ?? items.length;
        setTotal(typeof t === 'number' ? t : Number(t) || 0);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load courses');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pageNumber, pageSize, searchValue]);

  useEffect(() => { setPageNumber(1); }, [searchValue]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Industrial Style */}
      <section className="relative bg-black text-white py-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/crane-background.jpg";
            }}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6">
          <PageNav
            nameMap={{ course: t('trainee.courses.title') }}
            className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
          />

          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              LSSCTC ACADEMY
            </span>
            <span className="h-1 w-1 rounded-full bg-yellow-400" />
            <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
              Khóa học
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
            {t('trainee.courses.title')}
          </h1>

          <p className="text-lg text-white max-w-2xl mb-8 leading-relaxed font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Khám phá các khóa đào tạo vận hành cần cẩu chuyên nghiệp
          </p>

          {/* Search Box */}
          <div className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder={t('trainee.courses.searchPlaceholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-white text-black border-2 border-yellow-400 font-medium placeholder:text-neutral-400 focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-10">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Danh sách
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              Tất cả khóa học
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="error" showIcon message={t('trainee.courses.loadFailed')} description={error} />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div key={i} className="bg-white border-2 border-neutral-900 overflow-hidden">
                  <div className="h-2 bg-neutral-200" />
                  <div className="aspect-[16/9] w-full bg-neutral-100 flex items-center justify-center">
                    <Skeleton.Image active className="!w-full !h-full" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-neutral-200 flex items-center justify-center mb-6">
                <BookOpen className="w-12 h-12 text-neutral-400" />
              </div>
              <p className="text-neutral-900 font-black uppercase">{t('trainee.courses.noCourses')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/course/${c.id}`)}
                    className="text-left"
                  >
                    <CourseCard course={{
                      id: c.id,
                      title: c.title || c.name,
                      provider: c.provider || 'LSSCTC Academy',
                      level: c.levelName || c.level || null,
                      duration: c.duration || c.estimatedDuration || null,
                      thumbnail: c.imageUrl,
                      tags: c.tags || c.keywords || [],
                    }} />
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <div className="bg-white border-2 border-neutral-900 px-6 py-4">
                  <Pagination
                    current={pageNumber}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    onChange={(p, s) => { setPageNumber(p); setPageSize(s); }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
