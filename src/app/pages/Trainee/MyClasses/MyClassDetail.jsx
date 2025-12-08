// src\app\pages\Trainee\MyClasses\MyClassDetail.jsx
import { Empty, Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
      <div className="max-w-7xl flex flex-col min-h-screen mx-auto px-4 py-8 text-center justify-center">
        <Spin size="large" tip={t('trainee.myClassDetail.loading')} />
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageNav items={[{ title: 'My Classes', href: '/my-classes' }]} />
        <div className="min-h-screen flex flex-col items-center justify-center mt-2 text-center">
          <Empty description={t('trainee.myClassDetail.noClasses')} className="py-16" />
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'learning',
      label: t('trainee.myClassDetail.learning'),
      children: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Sections classId={classData.id} />
          </div>
          <div className="space-y-8">
            <InstructorInfo classId={classData.id}/>
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
      label: t('attendance.attendance') || 'Attendance',
      children: (
        <TraineeAttendance classId={id} />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav items={[{ title: 'My Classes', href: '/my-classes' }, { title: classData?.name }]} />
      <div className="mt-2">
        <ClassHeader classData={classData} />
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <Tabs items={tabItems} defaultActiveKey="learning" />
        </div>
      </div>
    </div>
  );
}


