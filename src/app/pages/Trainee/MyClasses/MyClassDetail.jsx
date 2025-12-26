import { Empty, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { fetchClassInstructor } from "../../../apis/ProgramManager/ClassesApi";
import { getLearningClassByIdAndTraineeId } from "../../../apis/Trainee/TraineeClassApi";
import {
  getActivityRecordsByClassAndSection,
  getLearningSectionsByClassIdAndTraineeId,
} from "../../../apis/Trainee/TraineeLearningApi";
import { getAuthToken } from "../../../libs/cookies";
import { decodeToken } from "../../../libs/jwtDecode";
import useAuthStore from "../../../store/authStore";
import ClassDetailHero from "./partials/ClassDetailHero";
import QuickStats from "./partials/QuickStats";
import TabNavigation from "./partials/TabNavigation";
import CourseCurriculum from "./partials/CourseCurriculum";
import InstructorCard from "./partials/InstructorCard";
import FinalExamTab from "./partials/FinalExamTab";
import TraineeAttendance from "./partials/TraineeAttendance";
import TraineeClassSchedule from "./partials/TraineeClassSchedule";

export default function MyClassDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;
  const [activeTab, setActiveTab] = useState("learning");
  const [classData, setClassData] = useState(null);
  const [sections, setSections] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);

  const totalActivities = sections.reduce((acc, s) => acc + (s.activities || 0), 0);
  const completedSections = sections.filter((s) => s.sectionProgress === 100).length;
  const completedActivities = Math.floor(totalActivities * ((classData?.progress || 0) / 100));

  // Fetch class data
  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const resolvedTraineeId =
        traineeIdFromStore || decoded?.nameid || decoded?.nameId || decoded?.sub || null;

      if (!resolvedTraineeId) {
        message.error("Trainee id not available");
        setLoadingClass(false);
        return;
      }

      setLoadingClass(true);
      try {
        const data = await getLearningClassByIdAndTraineeId(resolvedTraineeId, id);
        setClassData({
          id: data.id,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          capacity: data.capacity,
          classCode: data.classCode,
          provider: "LSSCTC Academy",
          description: data.description || "Master the essential skills for operating vehicle loading cranes safely and efficiently.",
          status: data.status,
          progress: data.classProgress ?? 0,
          courseDurationHours: data.durationHours ?? 60,
          badge: "Professional",
          backgroundImageUrl: data.backgroundImageUrl, // [UPDATED] Mapped background image
        });
      } catch (err) {
        console.error("Failed to fetch class detail:", err);
        message.error("Unable to load class details.");
      } finally {
        setLoadingClass(false);
      }
    };

    fetchData();
  }, [id, traineeIdFromStore]);

  // Fetch sections
  useEffect(() => {
    async function fetchSections() {
      if (!id) return;
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const resolvedTraineeId =
        traineeIdFromStore || decoded?.nameid || decoded?.nameId || decoded?.sub || null;

      if (!resolvedTraineeId) return;

      setLoadingSections(true);
      try {
        const sectionsRes = await getLearningSectionsByClassIdAndTraineeId(id, resolvedTraineeId);

        const sectionsWithActivities = await Promise.all(
          sectionsRes.map(async (section) => {
            try {
              const activities = await getActivityRecordsByClassAndSection(id, section.sectionId);
              const firstActivity = activities && activities.length > 0 ? activities[0] : null;
              return {
                ...section,
                firstActivity,
                activities: activities ? activities.length : 5
              };
            } catch (err) {
              console.error(`Failed to fetch activities for section ${section.sectionId}:`, err);
              return { ...section, firstActivity: null, activities: 0 };
            }
          })
        );

        setSections(Array.isArray(sectionsWithActivities) ? sectionsWithActivities : []);
      } catch (err) {
        console.error("Failed to fetch sections:", err);
        setSections([]);
      } finally {
        setLoadingSections(false);
      }
    }

    if (activeTab === 'learning') {
      fetchSections();
    }
  }, [id, traineeIdFromStore, activeTab]);

  // Fetch instructor
  useEffect(() => {
    async function loadInstructor() {
      if (!id) return;
      try {
        const data = await fetchClassInstructor(id);
        setInstructor(data);
      } catch (err) {
        console.error('fetchClassInstructor error', err);
      }
    }
    loadInstructor();
  }, [id]);

  // Loading state
  if (loadingClass) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not found state
  if (!classData) {
    return <div className="p-8 min-h-[500px] flex items-center justify-center text-center"><Empty description={t('trainee.myClassDetail.noClassInfo', 'Class not found')} /></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ClassDetailHero
        classData={classData}
        completedActivities={completedActivities}
        totalActivities={totalActivities}
      />

      {/* Quick Stats */}
      <QuickStats />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <section className="py-16 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-6">
          {activeTab === "learning" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lessons/Sections - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <div className="mb-8">
                  <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
                    {t('trainee.myClassDetail.courseCurriculum', 'Course Curriculum')}
                  </h2>
                  <div className="h-1 w-24 bg-yellow-400" />
                </div>

                <CourseCurriculum
                  sections={sections}
                  loading={loadingSections}
                  classId={classData.id}
                />
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                <InstructorCard instructor={instructor} />
                
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <TraineeClassSchedule
              classId={id}
              className={classData?.name}
            />
          )}
          {activeTab === "attendance" && (
            <TraineeAttendance classId={id} />
          )}
          {activeTab === "exam" && (
            <FinalExamTab classId={id} />
          )}
        </div>
      </section>
    </div>
  );
}