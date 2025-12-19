
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { fetchProgramDetail, fetchCoursesByProgram } from "../../../../apis/Trainee/TraineeProgramApi";
import { Alert, Empty } from "antd";
import { BookOpen, GraduationCap, Info, CheckCircle, ChevronRight, Clock, Users } from "lucide-react";
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
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
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

  if (!program) {
    return <Empty description={t('trainee.programDetail.notFound')} className="mt-16" />;
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section - Industrial Style */}
      <section className="relative bg-black text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          {program.imageUrl ? (
            <img
              src={program.imageUrl}
              alt={program.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-900" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6">
          <PageNav
            className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
            items={[
              { title: t('trainee.programs.title'), href: '/program' },
              { title: program.name },
            ]}
            rootLabel={t('common.home')}
            rootHref="/"
            hideIds
          />

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <div className="mb-4 flex items-center gap-4 flex-wrap">
                <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  LSSCTC ACADEMY
                </span>
                <span className="h-1 w-1 rounded-full bg-yellow-400" />
                <span className={`px-4 py-1 text-xs font-bold tracking-wider uppercase ${program.isActive
                  ? 'bg-yellow-400 text-black'
                  : 'bg-neutral-700 text-white'
                  }`}>
                  {program.isActive ? t('common.active') : t('common.inactive')}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
                {program.name}
              </h1>

              {/* Stats row */}
              <div className="flex items-center gap-6 mb-8 flex-wrap">
                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3">
                  <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{program.totalCourses}</div>
                    <div className="text-xs text-yellow-400 uppercase tracking-wider font-semibold">Khóa học</div>
                  </div>
                </div>

                {program.durationHours && (
                  <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3">
                    <div className="w-10 h-10 bg-white flex items-center justify-center">
                      <Clock className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{program.durationHours}</div>
                      <div className="text-xs text-yellow-400 uppercase tracking-wider font-semibold">Giờ</div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right image panel */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="border-4 border-yellow-400 overflow-hidden bg-black">
                <div className="h-72 w-full relative bg-neutral-900 flex items-center justify-center">
                  {program.imageUrl ? (
                    <img
                      src={program.imageUrl}
                      alt={program.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-800 flex items-center justify-center">
                      <GraduationCap className="w-16 h-16 text-yellow-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section - Industrial Style */}
      <section className="py-10 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              {t('trainee.programDetail.description', 'Mô tả')}
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {t('trainee.programDetail.programInfo', 'Thông tin chương trình')}
            </h2>
            <div className="h-1 w-16 bg-yellow-400 mt-2" />
          </div>
          <div className="bg-white border-2 border-neutral-900 p-6">
            <p className="whitespace-pre-line text-neutral-600 leading-relaxed">
              {program.description || t('trainee.programDetail.noDescription', 'Chưa có mô tả chi tiết cho chương trình này.')}
            </p>
          </div>
        </div>
      </section>

      {/* Prerequisites Section */}
      {program.prerequisites && program.prerequisites.length > 0 && (
        <section className="bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                <Info className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wider">
                {t('trainee.programDetail.prerequisites')}
              </h2>
            </div>
            <ul className="space-y-3 max-w-2xl">
              {program.prerequisites.map((pre, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-white border-2 border-neutral-900">
                  <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center flex-shrink-0 font-black">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 uppercase">{pre.name}:</span>
                    <span className="text-neutral-600 ml-2">{pre.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-10">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Nội dung chương trình
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              {t('trainee.courses.title')}
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
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
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-24 h-24 bg-neutral-200 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-neutral-400" />
              </div>
              <p className="text-neutral-900 font-black uppercase">{t('trainee.programDetail.noCourses')}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProgramDetail;