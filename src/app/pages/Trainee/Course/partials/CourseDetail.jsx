import { Alert, Skeleton, Tag, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import { fetchCourseDetail } from '../../../../apis/ProgramManager/CourseApi';
import PageNav from '../../../../components/PageNav/PageNav';
import { ClockCircleOutlined, InfoCircleOutlined, BookOutlined } from '@ant-design/icons';
import { Wallet } from 'lucide-react';
import ClassesSection from './ClassesSection';

export default function CourseDetail() {
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

  // If navigated from a Program page, location.state.fromProgram should be set.
  const fromProgram = location?.state?.fromProgram;
  const breadcrumbItems = fromProgram
    ? [
        { title: 'Programs', href: '/program' },
        { title: fromProgram.name || 'Program', href: `/program/${fromProgram.id}` },
        { title: data?.name || 'Course' },
      ]
    : [ { title: 'Courses', href: '/course' }, { title: data?.name || 'Course' } ];

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
              </div>
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="h-full flex flex-col">
                  <div className="h-72 w-full rounded-xl overflow-hidden bg-slate-200">
                    <Skeleton.Image active className="!w-full !h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <h3 className="text-2xl font-semibold mb-6">Available Classes</h3>
            <ClassesSection courseId={id} />
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
    return <Empty description="Course not found." className="mt-16" />;
  }

  return (
    <div className="w-full">
      {/* Two-column hero */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <PageNav
            className="mb-4"
            items={breadcrumbItems}
            rootLabel="Home"
            rootHref="/"
            hideIds
          />
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-stretch">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-5 leading-tight text-slate-900 max-w-3xl">
                {data.name}
              </h1>
              <div className="text-lg text-slate-600 mb-6 max-w-2xl">
                <div className="overflow-y-scroll" style={{ minHeight: '7rem', maxHeight: '7rem' }}>
                  <p className="whitespace-pre-line text-sm">
                    {data.description || 'No description provided.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-slate-700 mb-6">
                {data.durationHours != null && (
                  <span className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-slate-500" />
                    {data.durationHours} hours
                  </span>
                )}
                {data.levelName && (
                  <span className="flex items-center">
                    <BookOutlined className="mr-2 text-slate-500" />
                    {data.levelName}
                  </span>
                )}
                {data.categoryName && (
                  <Tag color="blue" className="m-0">{data.categoryName}</Tag>
                )}
                {data.price != null && (
                  <span className="flex items-center">
                    <Wallet className="mr-2 text-slate-500 w-4 h-4" />
                    <span>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}</span>
                  </span>
                )}
              </div>
              {data.courseCodeName && (
                <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-md p-4 border border-slate-200 max-w-2xl">
                  <h4 className="font-semibold flex items-center mb-2 text-base text-slate-800">
                    <InfoCircleOutlined className="mr-2 text-blue-500" /> Course Code
                  </h4>
                  <p className="text-slate-700 text-sm font-mono">{data.courseCodeName}</p>
                </div>
              )}
            </div>
            {/* Right image panel */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="rounded-xl overflow-hidden border bg-white shadow-sm h-full flex flex-col">
                <div className="h-80 w-full relative bg-slate-200 flex items-center justify-center">
                  {data.imageUrl ? (
                    <img
                      src={data.imageUrl}
                      alt={data.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <span className="text-slate-500 text-sm">No image available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold mb-6">Available Classes</h2>
          <ClassesSection courseId={id} />
        </div>
      </div>
    </div>
  );
}
