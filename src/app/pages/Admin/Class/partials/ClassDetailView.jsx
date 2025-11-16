import { Avatar, Button, Card, Divider, Empty, Pagination, Skeleton, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClassInstructor, fetchClassTrainees } from "../../../../apis/ProgramManager/ClassesApi";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import EditClassStatus from "../../../../components/ClassStatus/EditClassStatus";
import { getClassStatus } from "../../../../utils/classStatus";
import { getEnrollmentStatus } from "../../../../utils/enrollmentStatus";
import AddInstructor from "./AddInstructor";
import AddTrainee from "./AddTrainee";
import { ArrowLeft } from "lucide-react";

const ClassDetailView = ({ classItem, loading, onRefresh }) => {
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [instructorLoading, setInstructorLoading] = useState(false);
  const [instructorError, setInstructorError] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [traineesLoading, setTraineesLoading] = useState(false);
  const [traineesError, setTraineesError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!classItem?.id) {
        setInstructor(null);
        return;
      }
      setInstructorLoading(true);
      setInstructorError(null);
      try {
        const data = await fetchClassInstructor(classItem.id);
        if (!active) return;
        // API may return instructor object or a wrapper; normalize
        const inst = data?.id ? data : (data?.instructor ? data.instructor : null);
        setInstructor(inst || null);
      } catch (err) {
        if (!active) return;
        console.error('Failed to fetch class instructor', err);
        setInstructorError(err?.message || 'Failed to load instructor');
        setInstructor(null);
      } finally {
        if (active) setInstructorLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [classItem?.id]);

  // load trainees list (calls /Classes/{id}/trainees) with pagination
  useEffect(() => {
    let active = true;
    async function loadTrainees() {
      if (!classItem?.id) {
        setTrainees([]);
        setTotalCount(0);
        return;
      }
      setTraineesLoading(true);
      setTraineesError(null);
      try {
        const data = await fetchClassTrainees(classItem.id, { page, pageSize });
        if (!active) return;
        // normalize: expect { items: [], totalCount }
        const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
        setTrainees(items || []);
        const total = typeof data?.totalCount === 'number' ? data.totalCount : (Array.isArray(data) ? data.length : (data?.items?.length || 0));
        setTotalCount(total);
      } catch (err) {
        if (!active) return;
        console.error('Failed to fetch trainees:', err);
        setTraineesError(err?.message || 'Failed to load trainees');
        setTrainees([]);
        setTotalCount(0);
      } finally {
        if (active) setTraineesLoading(false);
      }
    }
    loadTrainees();
    return () => { active = false; };
  }, [classItem?.id, page, pageSize]);

  const handleAssigned = () => {
    // parent refresh (if provided) and reload instructor
    onRefresh?.();
    // reload instructor
    if (classItem?.id) {
      setInstructorLoading(true);
      fetchClassInstructor(classItem.id)
        .then((d) => setInstructor(d?.id ? d : (d?.instructor ? d.instructor : null)))
        .catch((e) => console.error('Failed to reload instructor', e))
        .finally(() => setInstructorLoading(false));
    }
  };

  const handleTraineeAdded = () => {
    // parent refresh and reload trainees
    onRefresh?.();
    // reload trainees by resetting page to 1 and refetching
    if (classItem?.id) {
      setPage(1);
      setTraineesLoading(true);
      fetchClassTrainees(classItem.id, { page: 1, pageSize })
        .then((data) => {
          const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
          setTrainees(items || []);
          const total = typeof data?.totalCount === 'number' ? data.totalCount : (Array.isArray(data) ? data.length : (data?.items?.length || 0));
          setTotalCount(total);
        })
        .catch((e) => console.error('Failed to reload trainees', e))
        .finally(() => setTraineesLoading(false));
    }
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!classItem) {
    return <Empty description="No class data" />;
  }

  const members = (trainees && trainees.length > 0) ? trainees : (Array.isArray(classItem.members) ? classItem.members : []);

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 ">
            <Button type="default" icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/class')}/>
            <span className="text-xl font-semibold">{classItem.name}</span>
            {(() => {
              const s = getClassStatus(classItem.status);
              return <Tag color={s.color}>{s.label}</Tag>;
            })()}
            <EditClassStatus 
              classId={classItem.id} 
              status={classItem.status} 
              onSuccess={onRefresh} 
            />
          </div>
          <div>
            <Button onClick={() => navigate(`/admin/class/${classItem.id}/edit`)}>Edit Class Details</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <span className="font-medium">Start Date:</span>{' '}
            <DayTimeFormat value={classItem.startDate} />
          </div>
          <div>
            <span className="font-medium">End Date:</span>{' '}
            <DayTimeFormat value={classItem.endDate} />
          </div>
          <div>
            <span className="font-medium">Capacity:</span> {classItem.capacity}
          </div>
          <div>
            <span className="font-medium">Class Code:</span> {classItem.classCode?.name || classItem.classCode || "-"}
          </div>
        </div>
        {classItem.description && (
          <div className="text-sm text-slate-600">
            <span className="font-medium">Description:</span>{" "}
            <span className="whitespace-pre-line">{classItem.description}</span>
          </div>
        )}
      </div>

      {/* Instructor */}
      <div>
        <Divider orientation="left">Instructor</Divider>
        {/* only show AddInstructor if there is no instructor assigned */}
        <div className="ml-3">
          {!instructor && !instructorLoading && (
            <AddInstructor classItem={classItem} onAssigned={handleAssigned} />
          )}
        </div>
        {instructorLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : instructor ? (
          <Card size="small" className="border-slate-200">
            <div className="flex items-start gap-4">
              {instructor.avatarUrl ? (
                <Avatar src={instructor.avatarUrl} size={80} className="shadow-sm" />
              ) : (
                <Avatar size={80} className="shadow-sm">{(instructor.fullname || instructor.fullName || instructor.name || 'I').charAt(0)}</Avatar>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{instructor.fullname || instructor.fullName || instructor.name || 'N/A'}</div>
                    <div className="text-sm text-slate-600">{instructor.email || 'No email'}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
                  <div>
                    <span className="font-medium">Code:</span> {instructor.instructorCode || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {instructor.phoneNumber || instructor.phone || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Hire Date:</span>{' '}
                    <DayTimeFormat value={instructor.hireDate} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Empty description="No instructor assigned" />
        )}
      </div>

      {/* Members / Trainees - Antd Table with pagination */}
      <div>
        <Divider orientation="left">Members ({totalCount})</Divider>
        {/* Add Trainee button - only show when class is Draft */}
        {(() => {
          const s = getClassStatus(classItem.status);
          if (s.key === 'Draft') {
            return (
              <div className="ml-3">
                <AddTrainee classItem={classItem} onAssigned={handleTraineeAdded} />
              </div>
            );
          }
          return null;
        })()}
        {traineesLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : members.length === 0 ? (
          <Empty description="No members" />
        ) : (
          <div>
            {/* map members to rows similar to TraineeTable */}
            {/** build rows for antd Table */}
            {
              (() => {
                const rows = members.map((it, idx) => ({
                  key: it.id || it.traineeId || idx,
                  idx: (page - 1) * pageSize + idx + 1,
                  avatar: it.avatarUrl || it.avatar || '',
                  fullName: it.traineeName || it.trainee?.fullName || it.traineeName || '-',
                  email: it.email || it.trainee?.email || '-',
                  phoneNumber: it.phoneNumber || it.phone || '-',
                  traineeCode: it.traineeCode || it.classCode || '',
                  enrollDate: it.enrollDate,
                  status: it.status,
                }));

                return (
                  <>
                    <Table
                      dataSource={rows}
                      columns={[
                        { title: '#', dataIndex: 'idx', width: 60 },
                        {
                          title: 'Avatar',
                          dataIndex: 'avatar',
                          width: 80,
                          render: (src, record) => (
                            <Avatar src={src} alt={record.fullName} style={{ backgroundColor: '#f3f4f6' }}>
                              {!src && (record.fullName || '-').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                            </Avatar>
                          ),
                        },
                        { title: 'Full name', dataIndex: 'fullName' },
                        { title: 'Email', dataIndex: 'email' },
                        { title: 'Phone', dataIndex: 'phoneNumber', width: 160 },
                        {
                          title: 'Enroll Date',
                          dataIndex: 'enrollDate',
                          render: (d) => <DayTimeFormat value={d} />,
                        },
                        {
                          title: 'Status',
                          dataIndex: 'status',
                          render: (s) => {
                            const st = getEnrollmentStatus(s);
                            return <Tag color={st.color}>{st.label}</Tag>;
                          },
                          width: 120,
                        },
                      ]}
                      pagination={false}
                      rowKey="key"
                      size="middle"
                      loading={traineesLoading}
                      scroll={{ y: 320 }}
                    />

                    <div className="p-4 bg-white flex justify-center">
                      <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalCount}
                        onChange={(p, s) => { setPage(p); setPageSize(s); }}
                        showSizeChanger
                        pageSizeOptions={["10", "20", "35", "50"]}
                        showTotal={(t, range) => `${range[0]}-${range[1]} of ${t} trainees`}
                      />
                    </div>
                  </>
                );
              })()
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailView;