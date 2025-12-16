import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { fetchProgramDetail, fetchCoursesByProgram } from "../../../../apis/Trainee/TraineeProgramApi";
import { Skeleton, Alert, Empty } from "antd";
import { BookOpen, GraduationCap, Info, CheckCircle } from "lucide-react";
import CourseCard from '../../../../components/CourseCard/CourseCard';
import { useNavigate, useParams } from "react-router";
import PageNav from "../../../../components/PageNav/PageNav";

const ProgramDetail = ({ id: idProp, onBack }) => {
  const { t } = useTranslation();
  const { id: idParam } = useParams();
  const navigate = useNavigate();
  const id = idProp ?? idParam;
  const [program, setProgram] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([fetchProgramDetail(id), fetchCoursesByProgram(id)])
      .then((results) => {
        const [progRes, coursesRes] = results;
        if (progRes.status === 'fulfilled') setProgram(progRes.value);
        else setError(progRes.reason?.message || 'Failed to load program');

        if (coursesRes.status === 'fulfilled') setCourses(Array.isArray(coursesRes.value) ? coursesRes.value : []);
        else setCourses([]);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load program data');
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  if (!program) {
    return <Empty description={t('trainee.programDetail.notFound')} className="mt-16" />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PageNav
            className="mb-4"
            items={[
              { title: t('trainee.programs.title'), href: '/program' },
              { title: program.name },
            ]}
            rootLabel={t('common.home')}
            rootHref="/"
            hideIds
          />
          <div className="flex flex-col-reverse lg:flex-row gap-10 items-stretch">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <span className="text-3xl font-bold mb-4 leading-tight text-slate-900 max-w-3xl">
                {program.name}
              </span>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 text-sm text-slate-700">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  {program.totalCourses} {t('trainee.programDetail.courses')}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${program.isActive
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                  <CheckCircle className="w-4 h-4" />
                  {program.isActive ? t('common.active') : t('common.inactive')}
                </span>
              </div>

              {/* Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-5 mb-6 max-w-2xl">
                <div className="overflow-y-auto" style={{ maxHeight: '8rem' }}>
                  <p className="whitespace-pre-line text-sm text-slate-600 leading-relaxed">
                    {program.description || t('trainee.programDetail.noDescription', 'Chưa có mô tả')}
                  </p>
                </div>
              </div>

              {/* Prerequisites */}
              {program.prerequisites && program.prerequisites.length > 0 && (
                <div className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-5 border border-cyan-200/60 max-w-2xl">
                  <h4 className="font-semibold flex items-center gap-2 mb-3 text-sm text-cyan-800">
                    <Info className="w-4 h-4 text-cyan-500" />
                    {t('trainee.programDetail.prerequisites')}
                  </h4>
                  <ul className="space-y-2">
                    {program.prerequisites.map((pre, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                        <span><span className="font-medium text-cyan-700">{pre.name}:</span> {pre.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right image panel */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-xl shadow-slate-200/50 h-full flex flex-col">
                <div className="h-72 w-full relative bg-slate-100 flex items-center justify-center">
                  {program.imageUrl ? (
                    <img
                      src={program.imageUrl}
                      alt={program.name}
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

      {/* Courses Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200/50">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{t('trainee.courses.title')}</span>
          </div>

          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    navigate(`/course/${c.id}`, { state: { fromProgram: { id, name: program?.name } } })
                  }}
                  className="text-left"
                >
                  <CourseCard
                    course={{
                      id: c.id,
                      title: c.title || c.name,
                      provider: c.provider || 'LSSCTC Academy',
                      level: c.levelName || c.level || null,
                      duration: c.duration || c.durationHours || null,
                      thumbnail: c.imageUrl,
                      tags: c.tags || c.keywords || [c.category].filter(Boolean),
                      price: c.price,
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <Empty description={t('trainee.programDetail.noCourses')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
