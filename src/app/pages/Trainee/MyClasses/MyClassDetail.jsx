// src\app\pages\Trainee\MyClasses\MyClassDetail.jsx
import { Empty, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap } from 'lucide-react';
import PageNav from '../../../components/PageNav/PageNav';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import useAuthStore from '../../../store/authStore';
import ClassHeader from './partials/ClassHeader';
import ClassOverview from './partials/ClassOverview';
import ClassSchedule from './partials/ClassSchedule';
import InstructorInfo from './partials/InstructorInfo';
import Sections from './partials/Sections';
import TraineeClassSchedule from './partials/TraineeClassSchedule';
import TraineeAttendance from './partials/TraineeAttendance';
import FinalExamTab from './partials/FinalExamTab';
import { getLearningClassByIdAndTraineeId } from '../../../apis/Trainee/TraineeClassApi';

export default function MyClassDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetailAndSections = async () => {
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const resolvedTraineeId = traineeIdFromStore || decoded?.nameid || decoded?.nameId || decoded?.sub || null;

      if (!resolvedTraineeId) {
        setError('Trainee id not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getLearningClassByIdAndTraineeId(resolvedTraineeId, id);

        setClassData({
          id: data.id,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          classCapacity: data.capacity,
          classCode: data.classCode,
          programId: data.programId,
          courseId: data.courseId,
          capacity: data.capacity,
          description: data.description,
          status: data.status,
          progress: data.classProgress ?? 0,
          courseDurationHours: data.durationHours ?? 80,
          provider: 'Global Crane Academy',
          badge: 'Foundational',
          color: 'from-cyan-500 to-blue-600',
        });
      } catch (err) {
        console.error('Failed to fetch class detail:', err);
        setError('Unable to load class details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetailAndSections();
  }, [id, traineeIdFromStore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">{t('trainee.myClassDetail.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageNav items={[{ title: 'My Classes', href: '/my-classes' }]} />
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <GraduationCap className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg font-medium">{t('trainee.myClassDetail.noClasses')}</p>
            <p className="text-slate-400 text-sm mt-2">{t('trainee.myClassDetail.noClassInfo')}</p>
          </div>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'learning',
      label: t('trainee.myClassDetail.learning'),
      children: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Sections classId={classData.id} />
          </div>
          <div className="space-y-6">
            <InstructorInfo classId={classData.id} />
            <ClassSchedule classData={classData} />
          </div>
        </div>
      ),
    },
    {
      key: 'schedule',
      label: t('attendance.classSchedule'),
      children: (
        <TraineeClassSchedule
          classId={id}
          className={classData?.name}
        />
      ),
    },
    {
      key: 'attendance',
      label: t('attendance.attendance'),
      children: (
        <TraineeAttendance classId={id} />
      ),
    },
    {
      key: 'finalExam',
      label: t('trainee.finalExam.tabLabel'),
      children: (
        <FinalExamTab classId={id} />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageNav items={[{ title: 'My Classes', href: '/my-classes' }, { title: classData?.name }]} />
        <div className="mt-4">
          <ClassHeader classData={classData} />
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6 mt-6">
            <Tabs items={tabItems} defaultActiveKey="learning" />
          </div>
        </div>
      </div>
    </div>
  );
}



