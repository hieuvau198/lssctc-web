import { Avatar, Card, Divider, Empty, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { fetchClassInstructor } from "../../../../apis/ProgramManager/ClassesApi";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import AddInstructor from "./AddInstructor";

const InstructorCard = ({ classItem }) => {
  const [instructor, setInstructor] = useState(null);
  const [instructorLoading, setInstructorLoading] = useState(false);
  const [instructorError, setInstructorError] = useState(null);

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

  const handleAssigned = () => {
    if (classItem?.id) {
      setInstructorLoading(true);
      fetchClassInstructor(classItem.id)
        .then((d) => setInstructor(d?.id ? d : (d?.instructor ? d.instructor : null)))
        .catch((e) => console.error('Failed to reload instructor', e))
        .finally(() => setInstructorLoading(false));
    }
  };

  return (
    <div>
      <Divider orientation="left">Instructor</Divider>
      <div className="ml-3 mb-4">
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
              <Avatar size={80} className="shadow-sm">
                {(instructor.fullname || instructor.fullName || instructor.name || 'I').charAt(0)}
              </Avatar>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {instructor.fullname || instructor.fullName || instructor.name || 'N/A'}
                  </div>
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
  );
};

export default InstructorCard;
