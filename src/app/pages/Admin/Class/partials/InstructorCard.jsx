import { Avatar, Divider, Empty, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchClassInstructor } from "../../../../apis/ProgramManager/ClassesApi";
import DayTimeFormat from "../../../../components/DayTimeFormat/DayTimeFormat";
import AddInstructor from "./AddInstructor";
import { UserCog, Phone, Mail, Calendar } from "lucide-react";

const InstructorCard = ({ classItem, allowAssign }) => {
  const { t } = useTranslation();
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
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b-2 border-slate-200 pb-2">
        <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
          <UserCog size={18} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-wide text-slate-900 m-0">{t('admin.classes.detail.instructor')}</h3>
      </div>

      <div className="ml-0 mb-6">
        {!instructor && !instructorLoading && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-6 flex items-center justify-center">
            <AddInstructor classItem={classItem} onAssigned={handleAssigned} allowAssign={allowAssign} />
          </div>
        )}
      </div>

      {instructorLoading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : instructor ? (
        <div className="bg-white border-2 border-slate-200 hover:border-black transition-all p-6 group">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="shrink-0 relative">
              <div className="absolute -inset-2 bg-yellow-400 rotate-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {instructor.avatarUrl ? (
                <Avatar src={instructor.avatarUrl} size={100} shape="square" className="relative z-10 border-2 border-black" />
              ) : (
                <div className="w-[100px] h-[100px] bg-neutral-900 border-2 border-black flex items-center justify-center relative z-10">
                  <span className="text-3xl font-bold text-yellow-400">
                    {(instructor.fullname || instructor.fullName || instructor.name || 'I').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-2xl font-bold text-slate-900 leading-none mb-1">
                    {instructor.fullname || instructor.fullName || instructor.name || 'N/A'}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                    {instructor.instructorCode || '-'}
                  </div>
                </div>
                {instructor.email && (
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mt-2 md:mt-0">
                    <Mail size={14} /> {instructor.email}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 group-hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-none bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <Phone size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('admin.classes.instructorDetail.phone')}</div>
                    <div className="font-semibold text-slate-700">{instructor.phoneNumber || instructor.phone || '-'}</div>
                  </div>
                </div>

                {/* Hire Date Removed */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Empty
          description={<span className="text-slate-500 font-medium italic">{t('admin.classes.detail.noInstructor')}</span>}
          className="my-8"
        />
      )}
    </div>
  );
};

export default InstructorCard;
