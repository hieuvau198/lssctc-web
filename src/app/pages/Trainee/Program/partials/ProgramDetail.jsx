import React, { useEffect, useState } from "react";
import { fetchProgramDetail } from "../../../../apis/Trainee/TraineeProgramApi";
import { Skeleton, Alert, Tag, Empty, Button } from "antd";
import { InfoCircleOutlined, ClockCircleOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";
import ProgramCourseCard from "./ProgramCourseCard"; // still may be used elsewhere
import CurriculumCourseItem from "./CurriculumCourseItem";
import { useNavigate, useParams } from "react-router";
import PageNav from "../../../../components/PageNav/PageNav";

const ProgramDetail = ({ id: idProp, onBack }) => {
  const { id: idParam } = useParams();
  const navigate = useNavigate();
  const id = idProp ?? idParam;
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProgramDetail(id)
      .then((data) => {
        setProgram(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
            <h3 className="text-2xl font-semibold mb-6">Curriculum</h3>
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
    return <Empty description="Program not found." className="mt-16" />;

  return (
    <div className="w-full">
      {/* Two-column hero */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <PageNav
            className="mb-6"
            items={[
              { title: 'Programs', href: '/program' },
              { title: program.name },
            ]}
            rootLabel="Home"
            rootHref="/"
            hideIds
          />
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-stretch">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold mb-5 leading-tight text-slate-900 max-w-3xl">{program.name}</h1>
              <p className="text-lg text-slate-600 mb-6 max-w-2xl">{program.description}</p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-700 mb-6">
                <span className="flex items-center"><ClockCircleOutlined className="mr-2 text-slate-500" />{program.durationHours} hours</span>
                <span className="flex items-center"><BookOutlined className="mr-2 text-slate-500" />{program.totalCourses} courses</span>
                <Tag color={program.isActive ? 'green' : 'default'} className="m-0">{program.isActive ? 'Active' : 'Inactive'}</Tag>
              </div>
              {program.prerequisites && program.prerequisites.length > 0 && (
                <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-md p-4 border border-slate-200 max-w-2xl">
                  <h4 className="font-semibold flex items-center mb-2 text-base text-slate-800">
                    <InfoCircleOutlined className="mr-2 text-blue-500" /> Prerequisites
                  </h4>
                  <ul className="list-disc ml-6 space-y-1 text-slate-700 text-sm">
                    {program.prerequisites.map((pre, idx) => (
                      <li key={idx}><span className="font-medium text-slate-900">{pre.name}:</span> {pre.description}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button type="primary" size="large" icon={<UserOutlined />}>
                Enroll Now
              </Button>
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
                    <span className="text-slate-500 text-sm">No image available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Curriculum */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-3xl font-semibold mb-6">Curriculum</h2>
          {program.courses && program.courses.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 px-4 sm:px-6 divide-y">
              {[...program.courses]
                .sort((a, b) => a.courseOrder - b.courseOrder)
                .map((course) => (
                  <CurriculumCourseItem
                    key={course.id}
                    courseId={course.coursesId}
                    order={course.courseOrder}
                  />
                ))}
            </div>
          ) : (
            <Empty description="No courses in this program." />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
