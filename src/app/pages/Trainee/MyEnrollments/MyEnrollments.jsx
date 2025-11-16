import React, { useEffect, useState } from 'react';
import { App, Card, Tag, Pagination, Skeleton, Empty, Segmented } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { getMyEnrollmentsPaged } from '../../../apis/Trainee/TraineeEnrollment';
import { getEnrollmentStatus } from '../../../utils/enrollmentStatus';
import DayTimeFormat from '../../../components/DayTimeFormat/DayTimeFormat';
import PageNav from '../../../components/PageNav/PageNav';

export default function MyEnrollments() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'enrolled' | 'inprogress' | 'completed'

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

  // Filter enrollments by status
  const filteredEnrollments = enrollments.filter((item) => {
    if (statusFilter === 'all') return true;
    const st = getEnrollmentStatus(item.status);
    return st.key.toLowerCase() === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <PageNav nameMap={{ 'my-enrollments': 'My Enrollments' }} />
      <div className="mt-2 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">My Enrollments</h1>
          <Segmented
            options={[
              { label: 'All', value: 'all' },
              { label: 'Enrolled', value: 'enrolled' },
              { label: 'In Progress', value: 'inprogress' },
              { label: 'Completed', value: 'completed' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            className="bg-slate-100"
          />
        </div>

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-xl shadow-sm">
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredEnrollments.length === 0 && (
          <div className="min-h-[400px] flex items-center justify-center">
            <Empty description="No enrollments found" className="py-16" />
          </div>
        )}

        {!loading && filteredEnrollments.length > 0 && (
          <>
            <div className="space-y-6">
              {filteredEnrollments.map((enrollment) => {
                const status = getEnrollmentStatus(enrollment.status);
                return (
                  <div className="my-4" key={enrollment.id}>
                    <Card
                      className="group rounded-2xl shadow-xl border hover:shadow-lg transition-all duration-300 overflow-hidden relative cursor-pointer"
                      onClick={() => navigate(`/trainee/classes/${enrollment.classId}`)}
                    >
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-80 from-transparent via-slate-200 to-transparent" />
                      <div className="flex">
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <div className="text-xs text-slate-500">
                                    {enrollment.classCode}
                                  </div>
                                  <Tag color={status.color} className="m-0">
                                    {status.label}
                                  </Tag>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 leading-snug m-0 line-clamp-2 group-hover:text-slate-700 transition">
                                  {enrollment.className}
                                </h3>
                                <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span>Enrolled: <DayTimeFormat value={enrollment.enrollDate} /></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>

            {totalCount > pageSize && (
              <div className="mt-6 flex justify-center">
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
                    `${range[0]}-${range[1]} of ${total} enrollments`
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
