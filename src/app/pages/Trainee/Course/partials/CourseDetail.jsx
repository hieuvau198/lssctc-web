import { Alert, Skeleton, Card, Tag, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { fetchCourseDetail, fetchClassesByCourse } from '../../../../apis/ProgramManager/CourseApi';
import PageNav from '../../../../components/PageNav/PageNav';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classesLoading, setClassesLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    Promise.all([
      fetchCourseDetail(id),
      fetchClassesByCourse(id).catch(() => [])
    ])
      .then(([courseRes, classesRes]) => {
        if (cancelled) return;
        setData(courseRes);
        setClasses(classesRes);
        setLoading(false);
        setClassesLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load course');
        setLoading(false);
        setClassesLoading(false);
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
            </div>
          </div>

          {/* Classes Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Available Classes</h2>
            {classesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="rounded-lg">
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Card>
                ))}
              </div>
            ) : classes.length === 0 ? (
              <Empty description="No classes available for this course yet" className="py-8" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <Card
                    key={cls.id}
                    hoverable
                    className="rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/class/${cls.id}`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">
                          {cls.name || cls.className || 'Unnamed Class'}
                        </h3>
                        <Tag color={cls.isActive ? 'green' : 'default'} className="ml-2">
                          {cls.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                      </div>
                      
                      {cls.classCode && (
                        <div className="text-xs text-slate-500">
                          Code: <span className="font-mono font-medium">{cls.classCode}</span>
                        </div>
                      )}

                      <div className="space-y-2 text-sm text-slate-600">
                        {cls.startDate && (
                          <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-slate-400" />
                            <span>Start: {new Date(cls.startDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {cls.endDate && (
                          <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-slate-400" />
                            <span>End: {new Date(cls.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {cls.instructorName && (
                          <div className="flex items-center gap-2">
                            <UserOutlined className="text-slate-400" />
                            <span>{cls.instructorName}</span>
                          </div>
                        )}
                        {cls.totalTrainee != null && (
                          <div className="flex items-center gap-2">
                            <UserOutlined className="text-slate-400" />
                            <span>{cls.totalTrainee} trainees</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
