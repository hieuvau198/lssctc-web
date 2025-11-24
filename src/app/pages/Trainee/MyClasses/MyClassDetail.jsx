// src\app\pages\Trainee\MyClasses\MyClassDetail.jsx
import { Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageNav from '../../../components/PageNav/PageNav';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import useAuthStore from '../../../store/authStore';
import ClassHeader from './partials/ClassHeader';
import ClassOverview from './partials/ClassOverview';
import ClassSchedule from './partials/ClassSchedule';
import InstructorInfo from './partials/InstructorInfo';
import Sections from './partials/Sections';
import { getLearningClassByIdAndTraineeId } from '../../../apis/Trainee/TraineeClassApi';
import { getLearningSectionsByClassIdAndTraineeId } from '../../../apis/Trainee/TraineeLearningApi';

export default function MyClassDetail() {
  const { id } = useParams();
  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;

  const [classData, setClassData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockInstructor = {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@lssctc.edu',
    phone: '+84 123 456 789',
    specialization: 'Mobile Crane Operations',
    yearsOfExperience: 15,
    certifications: ['Certified Crane Operator', 'Safety Training Specialist', 'OSHA 30-Hour'],
  };

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

        const sectionsRes = await getLearningSectionsByClassIdAndTraineeId(id, resolvedTraineeId);
        setSections(Array.isArray(sectionsRes) ? sectionsRes : []);
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
        <Spin size="large" tip="Loading class details..." />
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageNav items={[{ title: 'My Classes', href: '/my-classes' }]} />
        <div className="min-h-screen flex flex-col items-center justify-center mt-2 text-center">
          <Empty description="No classes found" className="py-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav items={[{ title: 'My Classes', href: '/my-classes' }, { title: classData?.name }]} />
      <div className="mt-2">
        <ClassHeader classData={classData} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ClassOverview classData={classData} />
            <Sections sections={sections} classId={classData.id} />
          </div>
          <div className="space-y-8">
            <InstructorInfo mockInstructor={mockInstructor} />
            <ClassSchedule classData={classData} />
          </div>
        </div>
      </div>
    </div>
  );
}


