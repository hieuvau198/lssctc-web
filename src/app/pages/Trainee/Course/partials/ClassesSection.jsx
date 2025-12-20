import { Tag, Empty, Modal, App, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { enrollMyClass } from '../../../../apis/Trainee/TraineeEnrollment';
import { fetchClassesByCourse } from '../../../../apis/ProgramManager/CourseApi';
import { Calendar, Info, CheckCircle, ChevronRight, BookOpen, UserCheck } from 'lucide-react';
import { getClassStatus } from '../../../../utils/classStatus';

export default function ClassesSection({ courseId, programId }) {
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

    // Sử dụng programId nếu có để lấy thông tin chi tiết (bao gồm isEnrolled)
    fetchClassesByCourse(courseId, programId)
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
  }, [courseId, programId]);

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
      
      // Cập nhật lại trạng thái local để hiển thị "Đã đăng ký" ngay lập tức mà không cần reload
      setClasses(prev => prev.map(c => c.id === selectedClass.id ? { ...c, isEnrolled: true } : c));
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border-2 border-neutral-900 p-5">
            <div className="h-2 bg-neutral-200 -mx-5 -mt-5 mb-4" />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-neutral-200 flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-neutral-400" />
        </div>
        <p className="text-neutral-900 font-black uppercase">{t('trainee.classes.noClasses')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, index) => {
          const status = getClassStatus(cls.status ?? cls._statusMapped ?? (cls.isActive ? 'Open' : null));
          // Kiểm tra trạng thái đã đăng ký từ API
          const isEnrolled = cls.isEnrolled === true;

          return (
            <div
              key={cls.id}
              className={`group bg-white border-2 ${isEnrolled ? 'border-green-600' : 'border-neutral-900 hover:border-yellow-400'} overflow-hidden transition-all duration-300 flex flex-col`}
            >
              {/* Status bar */}
              <div className={`h-2 ${isEnrolled ? 'bg-green-600' : (status.color === 'green' ? 'bg-yellow-400' : 'bg-neutral-200')}`} />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3 gap-3">
                  {/* Number badge */}
                  <div className={`w-8 h-8 ${isEnrolled ? 'bg-green-600 text-white' : 'bg-yellow-400 text-black'} flex items-center justify-center flex-shrink-0 font-black text-sm`}>
                    {index + 1}
                  </div>
                  <h3 className="font-black uppercase text-neutral-900 line-clamp-2 flex-1 min-h-[2.5rem] group-hover:text-yellow-600 transition-colors text-sm">
                    {cls.name || cls.className || 'Unnamed Class'}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider flex-shrink-0 ${status.color === 'green' ? 'bg-yellow-400 text-black' : 'bg-neutral-100 text-neutral-600'}`}>
                    {status.label}
                  </span>
                </div>

                {cls.classCode && (
                  <div className="text-xs text-neutral-500 mb-3 flex items-center gap-2 uppercase tracking-wider font-semibold">
                    <Info className="w-3.5 h-3.5 text-yellow-500" />
                    <span>{t('trainee.classes.code')}:</span>
                    <span className="font-mono font-bold text-neutral-900">{cls.classCode}</span>
                  </div>
                )}

                <div className="space-y-2.5 text-sm text-neutral-600 mb-4 flex-grow">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-black" />
                    </div>
                    <span className="uppercase tracking-wider text-xs font-semibold">
                      {cls.startDate ? (
                        <>{t('trainee.classes.start')}: <span className="text-neutral-900">{new Date(cls.startDate).toLocaleDateString('vi-VN')}</span></>
                      ) : (
                        <span className="text-neutral-400">{t('trainee.classes.start')}: TBD</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-200 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-neutral-600" />
                    </div>
                    <span className="uppercase tracking-wider text-xs font-semibold">
                      {cls.endDate ? (
                        <>{t('trainee.classes.end')}: <span className="text-neutral-900">{new Date(cls.endDate).toLocaleDateString('vi-VN')}</span></>
                      ) : (
                        <span className="text-neutral-400">{t('trainee.classes.end')}: TBD</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Updated Button Logic */}
                <button
                  type="button"
                  onClick={() => !isEnrolled && handleClassClick(cls)}
                  disabled={enrolling || isEnrolled}
                  className={`w-full h-11 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-auto 
                    ${isEnrolled 
                      ? 'bg-green-600 text-white cursor-default border-2 border-green-600 opacity-100' 
                      : 'bg-yellow-400 text-black hover:border-3 hover:border-black disabled:opacity-50'
                    }`}
                >
                  {isEnrolled ? (
                    <>
                      <UserCheck className="w-5 h-5" />
                      {t('trainee.classes.enrolled', 'Đã đăng ký')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {t('trainee.classes.enrollButton')}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enroll Confirmation Modal */}
      <Modal
        // ... (Modal props remain the same)
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-black uppercase text-neutral-900">{t('trainee.classes.confirmTitle')}</span>
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
          className: '!bg-yellow-400 !text-black !border-yellow-400 !font-bold !uppercase !tracking-wider hover:!bg-black hover:!text-yellow-400',
        }}
        cancelButtonProps={{
          size: 'large',
          className: '!border-2 !border-neutral-900 !font-bold !uppercase !tracking-wider',
        }}
      >
        {selectedClass && (
          <div className="py-4">
            <div className="bg-neutral-50 border-2 border-neutral-900 p-6 mb-4">
              <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
              <h3 className="font-black uppercase text-xl mb-4 text-neutral-900">
                {selectedClass.name || selectedClass.className}
              </h3>

              <div className="space-y-3">
                {/* ... (Modal content details remain the same) */}
                {selectedClass.classCode && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center">
                      <Info className="w-4 h-4 text-black" />
                    </div>
                    <div className="uppercase tracking-wider text-xs font-semibold">
                      <span className="text-neutral-500">Code:</span>
                      <span className="font-mono font-bold text-neutral-900 ml-2">
                        {selectedClass.classCode}
                      </span>
                    </div>
                  </div>
                )}
                 {/* ... (Rest of Modal content) */}
                 
                 {/* Status in Modal */}
                 <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-200 flex items-center justify-center">
                    <Info className="w-4 h-4 text-neutral-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 uppercase tracking-wider text-xs font-semibold">Status:</span>
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${getClassStatus(selectedClass.status ?? selectedClass._statusMapped ?? (selectedClass.isActive ? 'Open' : null)).color === 'green' ? 'bg-yellow-400 text-black' : 'bg-neutral-100 text-neutral-600'}`}>
                      {getClassStatus(selectedClass.status ?? selectedClass._statusMapped ?? (selectedClass.isActive ? 'Open' : null)).label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-neutral-700">
                <strong className="text-neutral-900 uppercase">{t('trainee.classes.noteTitle')}</strong> {t('trainee.classes.noteBody')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}