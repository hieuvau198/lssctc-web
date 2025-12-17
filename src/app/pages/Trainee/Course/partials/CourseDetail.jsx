import { Alert, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';
import { fetchCourseDetail } from '../../../../apis/ProgramManager/CourseApi';
import PageNav from '../../../../components/PageNav/PageNav';
import { Clock, BookOpen, FolderOpen, Wallet, Info, GraduationCap } from 'lucide-react';
import ClassesSection from './ClassesSection';

export default function CourseDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCourseDetail(id)
      .then((courseRes) => {
        if (cancelled) return;
        setData(courseRes);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load course');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const fromProgram = location?.state?.fromProgram;
  const breadcrumbItems = fromProgram
    ? [
      { title: t('trainee.programs.title'), href: '/program' },
      { title: fromProgram.name || t('trainee.programs.title'), href: `/program/${fromProgram.id}` },
      { title: data?.name || t('trainee.courses.title') },
    ]
    : [{ title: t('trainee.courses.title'), href: '/course' }, { title: data?.name || t('trainee.courses.title') }];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-neutral-500 uppercase tracking-wider font-semibold text-sm">
            {t('common.loading', 'Đang tải...')}
          </p>
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

  if (!data) {
    return <Empty description={t('trainee.courseDetail.notFound')} className="mt-16" />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Industrial Style */}
      <section className="relative bg-black text-white py-12 overflow-hidden">
        <div className="absolute inset-0">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.name}
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-40"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" />

        <div className="relative max-w-7xl mx-auto px-6">
          <PageNav
            className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
            items={breadcrumbItems}
            rootLabel={t('common.home')}
            rootHref="/"
            hideIds
          />

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm tracking-widest text-white uppercase font-bold">
                  LSSCTC ACADEMY
                </span>
                <span className="h-1 w-1 rounded-full bg-yellow-400" />
                <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
                  Khóa học
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-6 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
                {data.name}
              </h1>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {data.durationHours != null && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-sm text-white font-semibold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    {data.durationHours} {t('trainee.courseDetail.hours')}
                  </span>
                )}
                {data.levelName && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-sm text-white font-semibold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-yellow-400" />
                    {data.levelName}
                  </span>
                )}
                {data.categoryName && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-bold uppercase tracking-wider">
                    <FolderOpen className="w-4 h-4" />
                    {data.categoryName}
                  </span>
                )}
                {data.price != null && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold uppercase tracking-wider">
                    <Wallet className="w-4 h-4" />
                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
                  </span>
                )}
              </div>

              {/* Course Code */}
              {data.courseCodeName && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white">
                  <Info className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm uppercase tracking-wider font-semibold">{t('trainee.courseDetail.courseCode')}:</span>
                  <span className="text-sm font-mono font-bold text-yellow-400">{data.courseCodeName}</span>
                </div>
              )}
            </div>

            {/* Right image panel */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="border-4 border-yellow-400 overflow-hidden bg-neutral-900">
                <div className="aspect-[4/3] w-full relative flex items-center justify-center">
                  {data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt={data.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <GraduationCap className="w-16 h-16 text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-10 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Mô tả
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Thông tin khóa học
            </h2>
            <div className="h-1 w-16 bg-yellow-400 mt-2" />
          </div>
          <div className="bg-white border-2 border-neutral-900 p-6">
            <p className="whitespace-pre-line text-neutral-600 leading-relaxed">
              {data.description || t('trainee.courseDetail.noDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block">
                  Đăng ký
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {t('trainee.courseDetail.availableClasses')}
                </h2>
              </div>
            </div>
            <div className="h-1 w-24 bg-yellow-400 mt-4" />
          </div>
          <ClassesSection courseId={id} />
        </div>
      </section>
    </div>
  );
}
