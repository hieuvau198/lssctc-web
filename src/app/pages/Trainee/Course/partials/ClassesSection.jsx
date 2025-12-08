import { Card, Tag, Empty, Modal, App, Button, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { enrollMyClass } from '../../../../apis/Trainee/TraineeEnrollment';
import { fetchClassesByCourse } from '../../../../apis/ProgramManager/CourseApi';
import { CalendarOutlined, UserOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
      // Navigate to my classes page
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-lg">
            <Skeleton active paragraph={{ rows: 3 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return <Empty description={t('trainee.classes.noClasses')} className="py-8" />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const status = getClassStatus(cls.status ?? cls._statusMapped ?? (cls.isActive ? 'Open' : null));
          return (
            <Card
              key={cls.id}
              hoverable
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1 min-h-[3rem]">
                    {cls.name || cls.className || 'Unnamed Class'}
                  </h3>
                  <Tag color={status.color} className="ml-2 text-xs uppercase font-semibold shrink-0">
                    {status.label}
                  </Tag>
                </div>
                
                <div className="text-xs text-slate-500 mb-3 min-h-[1.25rem]">
                  {cls.classCode ? (
                    <>
                      {t('trainee.classes.code')} <span className="font-mono font-medium">{cls.classCode}</span>
                    </>
                  ) : (
                    <span className="invisible">-</span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-600 mb-4 flex-grow">
                  <div className="flex items-center gap-2 min-h-[1.5rem]">
                    <CalendarOutlined className="text-slate-400" />
                    <span>
                      {cls.startDate ? (
                        <>{t('trainee.classes.start')} {new Date(cls.startDate).toLocaleDateString('en-US')}</>
                      ) : (
                        <span className="text-slate-400">{t('trainee.classes.start')} TBD</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 min-h-[1.5rem]">
                    <CalendarOutlined className="text-slate-400" />
                    <span>
                      {cls.endDate ? (
                        <>{t('trainee.classes.end')} {new Date(cls.endDate).toLocaleDateString('en-US')}</>
                      ) : (
                        <span className="text-slate-400">{t('trainee.classes.end')} TBD</span>
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  type="primary"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleClassClick(cls)}
                  disabled={enrolling}
                  className="mt-auto"
                >
                  {t('trainee.classes.enrollButton')}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Enroll Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-blue-500 text-xl" />
            <span className="text-lg font-semibold">{t('trainee.classes.confirmTitle')}</span>
          </div>
        }
        open={enrollModalOpen}
        onOk={handleEnrollConfirm}
        onCancel={handleEnrollCancel}
        confirmLoading={enrolling}
        okText={t('trainee.classes.confirmEnrollment')}
        cancelText={t('common.cancel')}
        centered
        width={600}
        okButtonProps={{
          size: 'large',
          icon: <CheckCircleOutlined />,
        }}
        cancelButtonProps={{
          size: 'large',
        }}
      >
        {selectedClass && (
          <div className="py-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-4">
              <h3 className="font-bold text-xl mb-4 text-slate-800">
                {selectedClass.name || selectedClass.className}
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {selectedClass.classCode && (
                  <div className="flex items-center gap-3">
                    <InfoCircleOutlined className="text-blue-500 text-base" />
                    <div>
                      <span className="text-gray-600 text-sm">Class Code:</span>
                      <span className="font-mono font-semibold text-blue-600 ml-2">
                        {selectedClass.classCode}
                      </span>
                    </div>
                  </div>
                )}
                
                {selectedClass.startDate && (
                  <div className="flex items-center gap-3">
                    <CalendarOutlined className="text-green-500 text-base" />
                    <div>
                      <span className="text-gray-600 text-sm">Start Date:</span>
                      <span className="font-medium ml-2">
                        {new Date(selectedClass.startDate).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  </div>
                )}
                
                {selectedClass.endDate && (
                  <div className="flex items-center gap-3">
                    <CalendarOutlined className="text-orange-500 text-base" />
                    <div>
                      <span className="text-gray-600 text-sm">End Date:</span>
                      <span className="font-medium ml-2">
                        {new Date(selectedClass.endDate).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <InfoCircleOutlined className="text-gray-500 text-base" />
                  <div>
                    <span className="text-gray-600 text-sm">Status:</span>
                    <Tag 
                      color={getClassStatus(selectedClass.status ?? selectedClass._statusMapped ?? (selectedClass.isActive ? 'Open' : null)).color} 
                      className="ml-2 text-xs uppercase font-semibold"
                    >
                      {getClassStatus(selectedClass.status ?? selectedClass._statusMapped ?? (selectedClass.isActive ? 'Open' : null)).label}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong className="text-blue-700">{t('trainee.classes.noteTitle')}</strong> {t('trainee.classes.noteBody')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
