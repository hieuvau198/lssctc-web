import { Alert, Skeleton, Tag, Empty } from 'antd';
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
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-4"><Skeleton.Button active size="small" style={{ width: 240 }} /></div>
            <div className="flex flex-col lg:flex-row gap-10 items-stretch">
              <div className="flex-1 min-w-0">
                <Skeleton.Input active className="!w-3/4 !h-12 mb-6" />
                <Skeleton active paragraph={{ rows: 4 }} className="max-w-2xl" />
              </div>
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="h-72 w-full rounded-2xl overflow-hidden bg-slate-200">
                  <Skeleton.Image active className="!w-full !h-full" />
                </div>
              </div>
            </div>
          </div>
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PageNav
            className="mb-4"
            items={breadcrumbItems}
            rootLabel={t('common.home')}
            rootHref="/"
            hideIds
          />
          <div className="flex flex-col-reverse lg:flex-row gap-10 items-stretch">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <span className="text-3xl font-bold mb-4 leading-tight text-slate-900 max-w-3xl">
                {data.name}
              </span>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {data.durationHours != null && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 text-sm text-slate-700">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    {data.durationHours} {t('trainee.courseDetail.hours')}
                  </span>
                )}
                {data.levelName && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 text-sm text-slate-700">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    {data.levelName}
                  </span>
                )}
                {data.categoryName && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 text-sm text-cyan-700 font-medium">
                    <FolderOpen className="w-4 h-4" />
                    {data.categoryName}
                  </span>
                )}
                {data.price != null && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 text-sm text-emerald-700 font-medium">
                    <Wallet className="w-4 h-4" />
                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 mb-6 max-w-2xl">
                <div className="overflow-y-auto" style={{ maxHeight: '8rem' }}>
                  <p className="whitespace-pre-line text-sm text-slate-600 leading-relaxed">
                    {data.description || t('trainee.courseDetail.noDescription')}
                  </p>
                </div>
              </div>

              {/* Course Code */}
              {data.courseCodeName && (
                <div className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-200/60 max-w-md">
                  <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm text-cyan-800">
                    <Info className="w-4 h-4 text-cyan-500" />
                    {t('trainee.courseDetail.courseCode')}
                  </h4>
                  <p className="text-cyan-700 text-sm font-mono bg-white/60 px-3 py-1.5 rounded-lg inline-block">
                    {data.courseCodeName}
                  </p>
                </div>
              )}
            </div>

            {/* Right image panel */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-xl shadow-slate-200/50 h-full flex flex-col">
                <div className="h-72 w-full relative bg-slate-100 flex items-center justify-center">
                  {data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt={data.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center">
                      <GraduationCap className="w-16 h-16 text-cyan-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200/50">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{t('trainee.courseDetail.availableClasses')}</span>
          </div>
          <ClassesSection courseId={id} />
        </div>
      </div>
    </div>
  );
}
