import React, { useEffect, useState } from 'react';
import { App, Tag, Pagination, Skeleton, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getMyEnrollmentsPaged } from '../../../apis/Trainee/TraineeEnrollment';
import { getEnrollmentStatus } from '../../../utils/enrollmentStatus';
import DayTimeFormat from '../../../components/DayTimeFormat/DayTimeFormat';
import PageNav from '../../../components/PageNav/PageNav';

export default function MyEnrollments() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadEnrollments();
  }, [page, pageSize]);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const data = await getMyEnrollmentsPaged({ page, pageSize });
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      setEnrollments(items);
      const total = typeof data?.totalCount === 'number' ? data.totalCount : items.length;
      setTotalCount(total);
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || 'Failed to load enrollments');
      setEnrollments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((item) => {
    if (statusFilter === 'all') return true;
    const st = getEnrollmentStatus(item.status);
    return st.key.toLowerCase() === statusFilter;
  });

  const filterOptions = [
    { label: t('trainee.myEnrollments.allTab'), value: 'all' },
    { label: t('trainee.myEnrollments.enrolledTab'), value: 'enrolled' },
    { label: t('trainee.myEnrollments.inProgressTab'), value: 'inprogress' },
    { label: t('trainee.myEnrollments.completedTab'), value: 'completed' },
  ];

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
            nameMap={{ 'my-enrollments': 'My Enrollments' }}
            className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
          />

          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              LSSCTC ACADEMY
            </span>
            <span className="h-1 w-1 rounded-full bg-yellow-400" />
            <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
              Học viên
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
            {t('trainee.myEnrollments.title')}
          </h1>

          <p className="text-lg text-white max-w-2xl leading-relaxed font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Xem danh sách các lớp học bạn đã đăng ký
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b-2 border-neutral-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-6 py-4 font-bold uppercase tracking-wider text-sm border-b-4 transition-all whitespace-nowrap ${statusFilter === option.value
                  ? "border-yellow-400 text-black"
                  : "border-transparent text-neutral-400 hover:text-black hover:border-neutral-300"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border-2 border-neutral-900 p-6">
                  <div className="h-2 bg-neutral-200 -mx-6 -mt-6 mb-4" />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredEnrollments.length === 0 && (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-neutral-200 flex items-center justify-center mb-6">
                <ClipboardList className="w-12 h-12 text-neutral-400" />
              </div>
              <p className="text-neutral-900 font-black uppercase">{t('trainee.myEnrollments.noEnrollments')}</p>
            </div>
          )}

          {!loading && filteredEnrollments.length > 0 && (
            <>
              <div className="space-y-4">
                {filteredEnrollments.map((enrollment, index) => {
                  const status = getEnrollmentStatus(enrollment.status);
                  return (
                    <div
                      key={enrollment.id}
                      className="bg-white border-2 border-neutral-900 hover:border-yellow-400 transition-all group cursor-pointer"
                      onClick={() => navigate(`/my-classes/${enrollment.classId}`)}
                    >
                      {/* Status bar */}
                      <div className={`h-2 ${status.color === 'green' ? 'bg-yellow-400' : status.color === 'blue' ? 'bg-neutral-400' : 'bg-neutral-200'}`} />

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Order badge */}
                            <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center flex-shrink-0 font-black text-xl text-black">
                              {index + 1 + (page - 1) * pageSize}
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Meta */}
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                                  {enrollment.classCode}
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${status.color === 'green' ? 'bg-yellow-400 text-black' :
                                  status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                    'bg-neutral-100 text-neutral-600'
                                  }`}>
                                  {status.label}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-lg font-black uppercase text-neutral-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                                {enrollment.className}
                              </h3>

                              {/* Enrolled date */}
                              <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                                <Calendar className="w-4 h-4" />
                                <span className="uppercase tracking-wider font-semibold">
                                  {t('trainee.myEnrollments.enrolledLabel')}: <DayTimeFormat value={enrollment.enrollDate} />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="w-10 h-10 border-2 border-neutral-900 group-hover:bg-yellow-400 group-hover:border-yellow-400 flex items-center justify-center transition-all group-hover:translate-x-1 flex-shrink-0">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalCount > pageSize && (
                <div className="mt-8 flex justify-center">
                  <div className="bg-white border-2 border-neutral-900 px-6 py-4">
                    <Pagination
                      current={page}
                      pageSize={pageSize}
                      total={totalCount}
                      onChange={(p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                      }}
                      showSizeChanger
                      pageSizeOptions={['10', '20', '35', '50']}
                      showTotal={(total, range) =>
                        t('trainee.myEnrollments.pagination', { start: range[0], end: range[1], total })
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
