import { Tag, Empty, Modal, App, Button, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { enrollMyClass } from '../../../../apis/Trainee/TraineeEnrollment';
import { fetchClassesByCourse } from '../../../../apis/ProgramManager/CourseApi';
import { Calendar, Users, Info, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { getClassStatus } from '../../../../utils/classStatus';

export default function ClassesSection({ courseId }) {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchClassesByCourse(courseId)
      .then((result) => {
        if (cancelled) return;
        setClasses(result || []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setClasses([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    setEnrollModalOpen(true);
  };

  const handleEnrollConfirm = async () => {
    if (!selectedClass) return;

    setEnrolling(true);
    try {
      await enrollMyClass({ classId: selectedClass.id });
      message.success(t('trainee.classes.enrollSuccess', { name: selectedClass.name || selectedClass.className }));
      setEnrollModalOpen(false);
      setTimeout(() => {
        navigate('/my-enrollments');
      }, 1500);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to enroll in class';
      message.error(errorMsg);
    } finally {
      setEnrolling(false);
    }
  };

  const handleEnrollCancel = () => {
    setEnrollModalOpen(false);
    setSelectedClass(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return <Empty description={t('trainee.classes.noClasses')} className="py-8" />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const status = getClassStatus(cls.status ?? cls._statusMapped ?? (cls.isActive ? 'Open' : null));
          return (
            <div
              key={cls.id}
              className="group bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 hover:border-cyan-200 transition-all duration-300 flex flex-col"
            >
              {/* Gradient top bar */}
              <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1 min-h-[3rem] group-hover:text-cyan-700 transition-colors">
                    {cls.name || cls.className || 'Unnamed Class'}
                  </h3>
                  <Tag
                    color={status.color}
                    className="ml-2 text-xs uppercase font-semibold shrink-0 rounded-lg"
                  >
                    {status.label}
                  </Tag>
                </div>

                {cls.classCode && (
                  <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{t('trainee.classes.code')}</span>
                    <span className="font-mono font-medium text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">{cls.classCode}</span>
                  </div>
                )}

                <div className="space-y-2.5 text-sm text-slate-600 mb-4 flex-grow">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span>
                      {cls.startDate ? (
                        <>{t('trainee.classes.start')} <span className="font-medium">{new Date(cls.startDate).toLocaleDateString('vi-VN')}</span></>
                      ) : (
                        <span className="text-slate-400">{t('trainee.classes.start')} TBD</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-500" />
                    </div>
                    <span>
                      {cls.endDate ? (
                        <>{t('trainee.classes.end')} <span className="font-medium">{new Date(cls.endDate).toLocaleDateString('vi-VN')}</span></>
                      ) : (
                        <span className="text-slate-400">{t('trainee.classes.end')} TBD</span>
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => handleClassClick(cls)}
                  disabled={enrolling}
                  className="mt-auto !rounded-xl !h-11 !font-semibold"
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  {t('trainee.classes.enrollButton')}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enroll Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">{t('trainee.classes.confirmTitle')}</span>
          </div>
        }
        open={enrollModalOpen}
        onOk={handleEnrollConfirm}
        onCancel={handleEnrollCancel}
        confirmLoading={enrolling}
        okText={t('trainee.classes.confirmEnrollment')}
        cancelText={t('common.cancel')}
        centered
        width={550}
        okButtonProps={{
          size: 'large',
          className: '!rounded-xl !h-11 !font-semibold',
        }}
        cancelButtonProps={{
          size: 'large',
          className: '!rounded-xl !h-11',
        }}
      >
        {selectedClass && (
          <div className="py-4">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/60 rounded-2xl p-6 mb-4">
              <h3 className="font-bold text-xl mb-4 text-slate-800">
                {selectedClass.name || selectedClass.className}
              </h3>

              <div className="space-y-3">
                {selectedClass.classCode && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Info className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Class Code:</span>
                      <span className="font-mono font-semibold text-cyan-600 ml-2">
                        {selectedClass.classCode}
                      </span>
                    </div>
                  </div>
                )}

                {selectedClass.startDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">Start Date:</span>
                      <span className="font-medium ml-2">
                        {new Date(selectedClass.startDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                )}

                {selectedClass.endDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm">End Date:</span>
                      <span className="font-medium ml-2">
                        {new Date(selectedClass.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Info className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">Status:</span>
                    <Tag
                      color={getClassStatus(selectedClass.status ?? selectedClass._statusMapped ?? (selectedClass.isActive ? 'Open' : null)).color}
                      className="text-xs uppercase font-semibold rounded-lg"
                    >
                      {getClassStatus(selectedClass.status ?? selectedClass._statusMapped ?? (selectedClass.isActive ? 'Open' : null)).label}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <p className="text-sm text-slate-700">
                <strong className="text-cyan-700">{t('trainee.classes.noteTitle')}</strong> {t('trainee.classes.noteBody')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
