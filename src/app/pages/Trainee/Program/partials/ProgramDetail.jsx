import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { fetchProgramDetail, fetchCoursesByProgram } from "../../../../apis/Trainee/TraineeProgramApi";
import { Skeleton, Alert, Tag, Empty, Button } from "antd";
import { InfoCircleOutlined, ClockCircleOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";
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
    // Load program detail and its courses
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
      <div className="w-full">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-4"><Skeleton.Button active size="small" style={{ width: 240 }} /></div>
            <div className="flex flex-col lg:flex-row gap-10 items-stretch">
              <div className="flex-1 min-w-0">
                <Skeleton.Input active className="!w-3/4 !h-12 mb-6" />
                <Skeleton active paragraph={{ rows: 4 }} className="max-w-2xl" />
                <div className="flex gap-4 mt-6 flex-wrap">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton.Button key={i} active className="!w-24" />
                  ))}
                </div>
                <Skeleton.Button active className="!w-40 mt-8" />
              </div>
              {/* Right panel skeleton (image + stats) - borderless */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="h-full flex flex-col">
                  <div className="h-72 w-full rounded-xl overflow-hidden bg-slate-200">
                    <Skeleton.Image active className="!w-full !h-full" />
                  </div>
                  <div className="mt-5 space-y-3 max-w-xs">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton.Button active size="small" className="!w-24" />
                        <Skeleton.Input active className="!w-20 !h-6" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <h3 className="text-2xl font-semibold mb-6">{t('trainee.programDetail.curriculum')}</h3>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-md p-4">
                  <Skeleton active title paragraph={{ rows: 2 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  if (!program)
    return <Empty description={t('trainee.programDetail.notFound')} className="mt-16" />;

  return (
    <div className="w-full">
      {/* Two-column hero */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <PageNav
            className="mb-4"
            items={[
              { title: t('trainee.programs.title'), href: '/program' },
              { title: program.name },
            ]}
            rootLabel="Home"
            rootHref="/"
            hideIds
          />
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-stretch">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-5 leading-tight text-slate-900 max-w-3xl">{program.name}</h1>
              <div className="text-lg text-slate-600 mb-6 max-w-2xl">
                <div className="overflow-y-scroll" style={{ minHeight:'7rem',maxHeight: '7rem' }}>
                  <p className="whitespace-pre-line text-sm">{program.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-700 mb-6">
                {/* <span className="flex items-center"><ClockCircleOutlined className="mr-2 text-slate-500" />{program.durationHours} hours</span> */}
                <span className="flex items-center"><BookOutlined className="mr-2 text-slate-500" />{program.totalCourses} {t('trainee.programDetail.courses')}</span>
                <Tag color={program.isActive ? 'green' : 'default'} className="m-0">{program.isActive ? t('common.active') : t('common.inactive')}</Tag>
              </div>
              {program.prerequisites && program.prerequisites.length > 0 && (
                <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-md p-4 border border-slate-200 max-w-2xl">
                  <h4 className="font-semibold flex items-center mb-2 text-base text-slate-800">
                    <InfoCircleOutlined className="mr-2 text-blue-500" /> {t('trainee.programDetail.prerequisites')}
                  </h4>
                  <ul className="list-disc ml-6 space-y-1 text-slate-700 text-sm">
                    {program.prerequisites.map((pre, idx) => (
                      <li key={idx}><span className="text-slate-900">{pre.name}:</span> {pre.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Right image panel */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="rounded-xl overflow-hidden border bg-white shadow-sm h-full flex flex-col">
                <div className="h-80 w-full relative bg-slate-200 flex items-center justify-center">
                  {program.imageUrl ? (
                    <img
                      src={program.imageUrl}
                      alt={program.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-slate-500 text-sm">{t('trainee.programDetail.noImage')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Curriculum */}
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold mb-6">{t('trainee.courses.title')}</h2>
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate(`/course/${c.id}`, { state: { fromProgram: { id, name: program?.name } } })}
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
