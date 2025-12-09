import React, { useEffect, useState } from 'react';
import { Alert, Empty, Pagination, Skeleton, Input } from 'antd';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
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

  // Debounce search commit (simple timeout)
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
        // Try to normalize response (support various shapes)
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

  // Reset to first page on new search value
  useEffect(() => { setPageNumber(1); }, [searchValue]);

  return (
    <div className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageNav nameMap={{ course: t('trainee.courses.title') }} />
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-2xl mb-4">{t('trainee.courses.title')}</span>
            <div>
              <Input.Search
                placeholder={t('trainee.courses.searchPlaceholder')}
                allowClear
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSearch={(v) => setSearchInput(v)}
                className="w-full sm:w-64"
                enterButton
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-6">
            <Alert type="error" showIcon message={t('trainee.courses.loadFailed')} description={error} />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-0">
                <div className="aspect-[16/9] w-full bg-slate-100 flex items-center justify-center">
                  <Skeleton.Image active className="!w-full !h-full" />
                </div>
                <div className="p-4 space-y-2">
                  <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2 }} />
                  <Skeleton.Button active size="small" className="!w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div>
            <Empty description={t('trainee.courses.noCourses')} className="mt-16  min-h-[350px]" />
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
              <Pagination
                current={pageNumber}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                onChange={(p, s) => { setPageNumber(p); setPageSize(s); }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
