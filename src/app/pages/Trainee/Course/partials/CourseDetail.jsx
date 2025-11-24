import { Alert, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { fetchCourseDetail } from '../../../../apis/ProgramManager/CourseApi';
import PageNav from '../../../../components/PageNav/PageNav';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCourseDetail(id)
      .then((res) => {
        if (cancelled) return;
        setData(res);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav items={breadcrumbItems} />
      {error && (
        <div className="mt-4">
          <Alert type="error" showIcon message="Error" description={error} />
        </div>
      )}
      {loading ? (
        <div className="space-y-8">
          {/* Hero skeleton */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
              <Skeleton.Image active className="!w-full !h-full" />
            </div>
            <div className="flex-1 space-y-4">
              <Skeleton active title={{ width: '70%' }} paragraph={{ rows: 3 }} />
              <Skeleton.Button active size="small" className="!w-32" />
            </div>
          </div>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : !data ? (
        <div className="mt-10">
          <Alert type="warning" showIcon message="Course not found" />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.name}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-50 to-blue-100" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-4">
                {data.name}
              </h1>
              <div className="mb-4 space-y-1 text-sm text-slate-700">
                {data.levelName && (
                  <div><span className="font-medium text-slate-900">Level:</span> {data.levelName}</div>
                )}
                {data.categoryName && (
                  <div><span className="font-medium text-slate-900">Category:</span> {data.categoryName}</div>
                )}
                {data.durationHours != null && (
                  <div><span className="font-medium text-slate-900">Duration:</span> {data.durationHours}h</div>
                )}
                {data.courseCodeName && (
                  <div><span className="font-medium text-slate-900">Code:</span> {data.courseCodeName}</div>
                )}
                {data.price != null && (
                  <div><span className="font-medium text-slate-900">Price:</span> {Intl.NumberFormat('vi-VN').format(data.price)}</div>
                )}
              </div>
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line mb-6 line-clamp-6 md:line-clamp-none">
                {data.description || 'No description provided.'}
              </p>
              {/* <div className="flex flex-wrap gap-3">
                <Button type="primary" size="large" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button size="large" disabled>
                  Enroll (coming soon)
                </Button>
              </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
