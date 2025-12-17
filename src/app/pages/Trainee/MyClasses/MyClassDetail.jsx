import { message, Skeleton } from "antd";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { fetchClassInstructor } from "../../../apis/ProgramManager/ClassesApi";
import { getLearningClassByIdAndTraineeId } from "../../../apis/Trainee/TraineeClassApi";
import {
  getActivityRecordsByClassAndSection,
  getLearningSectionsByClassIdAndTraineeId,
} from "../../../apis/Trainee/TraineeLearningApi";
import PageNav from "../../../components/PageNav/PageNav";
import { getAuthToken } from "../../../libs/cookies";
import { decodeToken } from "../../../libs/jwtDecode";
import { getFirstPartitionPath } from "../../../mocks/lessonPartitions";
import useAuthStore from "../../../store/authStore";

// Components for other tabs
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
  const [loadingInstructor, setLoadingInstructor] = useState(false);
  const totalActivities = sections.reduce((acc, s) => acc + s.activities, 0); // Note: Need to make sure sections have 'activities' count
  const completedSections = sections.filter((s) => s.sectionProgress === 100).length;
  const completedActivities = Math.floor(totalActivities * ((classData?.progress || 0) / 100));

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
          badge: "Professional", // Hardcoded for UI
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
                activities: activities ? activities.length : 5 // Approximate count or real count if possible
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

  useEffect(() => {
    async function loadInstructor() {
      if (!id) return;
      setLoadingInstructor(true);
      try {
        const data = await fetchClassInstructor(id);
        setInstructor(data);
      } catch (err) {
        console.error('fetchClassInstructor error', err);
      } finally {
        setLoadingInstructor(false);
      }
    }
    loadInstructor();
  }, [id]);

  if (loadingClass) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!classData) {
    return <div className="p-8 text-center">Class not found</div>;
  }

  const courseFeatures = [
    { icon: Award, title: "Industry Certification", value: "LSSCTC Standard" },
    { icon: Target, title: "Completion Rate", value: "95% Success" },
    { icon: TrendingUp, title: "Career Growth", value: "+40% Salary" },
    { icon: Calendar, title: "Course Length", value: "12 Weeks" },
  ];

  const instructorData = instructor ? {
    name: instructor.fullname || instructor.name || "Unknown Instructor",
    role: "Instructor",
    email: instructor.email || instructor.contactEmail || "email@example.com",
    phone: instructor.phoneNumber || instructor.phone || "N/A",
    avatar: instructor.avatarUrl || instructor.avatar || null,
    bio: "Certified crane operator with 15+ years of experience in industrial training and safety compliance.",
    certifications: ["LSSCTC Certified", "OSHA 30-Hour", "Advanced Rigging Specialist"],
  } : {
    name: "TBD",
    role: "Instructor",
    email: "contact@lssctc.com",
    avatar: null,
    bio: "Instructor information not available.",
    certifications: [],
    phone: ""
  };

  const initials = instructorData.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Light Wire Style */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://i.ibb.co/fGDt4tzT/hinh-anh-xe-cau-3-1024x683.jpg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/industrial-crane-construction-site.jpg";
            }}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Breadcrumb inside hero */}
          <div className="mb-8">
            <PageNav
              items={[{ title: 'My Classes', href: '/my-classes' }, { title: classData.name }]}
              className="text-lg [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
            />
          </div>

          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <span className="text-sm tracking-widest text-white uppercase font-bold drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{classData.provider}</span>
            <span className="h-1 w-1 rounded-full bg-yellow-400" />
            <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
              {classData.status}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight uppercase mb-8 leading-none text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
            {classData.name}
          </h1>

          <p className="text-xl text-white max-w-3xl mb-12 leading-relaxed font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{classData.description}</p>

          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-lg">
              <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white drop-shadow-md">{classData.capacity}</div>
                <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">Students</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-lg">
              <div className="w-12 h-12 bg-white flex items-center justify-center">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white drop-shadow-md">{classData.courseDurationHours}</div>
                <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">Hours</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-lg">
              <div className="w-12 h-12 border-2 border-yellow-400 bg-black/50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white drop-shadow-md">
                  {completedActivities}/{totalActivities}
                </div>
                <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">Activities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {courseFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-neutral-200 p-6 hover:border-yellow-400 transition-all group"
              >
                <feature.icon className="w-8 h-8 mb-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" />
                <div className="text-sm text-neutral-500 uppercase tracking-wider mb-2">{feature.title}</div>
                <div className="text-2xl font-bold text-black">{feature.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white border-b border-neutral-200 sticky top-17 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { key: "learning", label: t('trainee.myClassDetail.learning') },
              { key: "schedule", label: t('attendance.classSchedule') },
              { key: "attendance", label: t('attendance.attendance') },
              { key: "exam", label: t('trainee.finalExam.tabLabel') }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-8 py-4 font-bold uppercase tracking-wider text-sm border-b-4 transition-all whitespace-nowrap ${activeTab === tab.key
                  ? "border-yellow-400 text-black"
                  : "border-transparent text-neutral-400 hover:text-black hover:border-neutral-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-6">
          {activeTab === "learning" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lessons/Sections - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <div className="mb-8">
                  <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Course Curriculum</h2>
                  <div className="h-1 w-24 bg-yellow-400" />
                </div>

                {/* Vertical Timeline of Service Cards */}
                {loadingSections ? (
                  <Skeleton active paragraph={{ rows: 4 }} />
                ) : sections.length === 0 ? (
                  <div className="text-neutral-500 py-8">No sections available.</div>
                ) : (
                  <div className="space-y-6">
                    {sections.map((section, index) => {
                      const isCompleted = section.sectionProgress === 100;
                      const isInProgress = section.sectionProgress > 0 && section.sectionProgress < 100;

                      const deepLink = section.firstActivity
                        ? `/learnings/${classData.id}/${section.sectionId}/${section.firstActivity.activityId}`
                        : getFirstPartitionPath(classData.id) || `/learnings/${classData.id}`;

                      return (
                        <div key={section.sectionId} className="group relative">
                          {/* Timeline connector */}
                          {index < sections.length - 1 && (
                            <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-neutral-200 -translate-x-1/2" />
                          )}

                          <Link to={deepLink} className="block relative bg-white border-2 border-neutral-900 hover:border-yellow-400 transition-all">
                            {/* Status indicator bar */}
                            <div
                              className={`h-2 ${isCompleted ? "bg-yellow-400" : isInProgress ? "bg-neutral-300" : "bg-neutral-100"
                                }`}
                            />

                            <div className="p-8">
                              <div className="flex items-start gap-6">
                                {/* Number Badge */}
                                <div
                                  className={`flex-shrink-0 w-12 h-12 border-2 flex items-center justify-center font-black text-xl ${isCompleted
                                    ? "bg-yellow-400 border-yellow-400 text-black"
                                    : isInProgress
                                      ? "bg-black border-black text-white"
                                      : "bg-white border-neutral-300 text-neutral-400"
                                    }`}
                                >
                                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                                </div>

                                <div className="flex-1">
                                  {/* Meta info */}
                                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                                    <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                                      Lesson {index + 1}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                    <span className="flex items-center gap-2 text-xs text-neutral-500">
                                      <Clock className="w-3.5 h-3.5" />
                                      {section.durationMinutes} mins
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                    <span className="text-xs text-neutral-500">{section.activities} Activities</span>
                                    {isCompleted && (
                                      <>
                                        <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                        <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase">
                                          Completed
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  {/* Title */}
                                  <h3 className="text-2xl font-black uppercase mb-3 group-hover:text-yellow-400 transition-colors">
                                    {section.sectionName}
                                  </h3>

                                  {/* Description */}
                                  <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">{section.sectionDescription}</p>

                                  {/* Progress bar */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="font-bold text-neutral-500 uppercase tracking-wider">
                                        Progress
                                      </span>
                                      <span className="font-black text-xl">{section.sectionProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-neutral-100 border border-neutral-900">
                                      <div
                                        className="h-full bg-yellow-400 transition-all duration-500"
                                        style={{ width: `${section.sectionProgress}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex-shrink-0 w-12 h-12 border-2 border-neutral-900 group-hover:bg-yellow-400 group-hover:border-yellow-400 flex items-center justify-center transition-all group-hover:translate-x-1">
                                  <ChevronRight className="w-6 h-6" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                {/* Instructor Premium Card */}
                <div className="bg-black text-white border-4 border-black sticky top-24">
                  <div className="h-2 bg-yellow-400" />

                  <div className="p-8">
                    <h3 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                      <div className="w-1 h-6 bg-yellow-400" />
                      Your Instructor
                    </h3>

                    <div className="mb-6">
                      <div className="w-32 h-32 mx-auto mb-4 border-4 border-yellow-400 overflow-hidden bg-neutral-900 flex items-center justify-center">
                        {instructorData.avatar ? (
                          <img
                            src={instructorData.avatar}
                            alt={instructorData.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-yellow-500">{initials}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <h4 className="text-2xl font-black uppercase mb-1">{instructorData.name}</h4>
                        <p className="text-sm text-neutral-400 uppercase tracking-wider">{instructorData.role}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6 pb-6 border-b border-neutral-800">
                      <p className="text-sm text-neutral-300 leading-relaxed">{instructorData.bio}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {instructorData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm text-neutral-300">{cert}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800">
                        <Mail className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-neutral-300 break-all">{instructorData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800">
                        <Phone className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-neutral-300">{instructorData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overall Progress Card */}
                <div className="bg-white border-2 border-neutral-900">
                  <div className="h-2 bg-neutral-900" />
                  <div className="p-6">
                    <h3 className="text-lg font-black uppercase tracking-wider mb-4">Overall Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-neutral-600 uppercase tracking-wider">Course Completion</span>
                          <span className="font-black text-2xl">{classData.progress}%</span>
                        </div>
                        <div className="h-3 bg-neutral-100 border border-neutral-900">
                          <div className="h-full bg-yellow-400" style={{ width: `${classData.progress}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                        <div>
                          <div className="text-3xl font-black text-black">
                            {completedSections}/{sections.length}
                          </div>
                          <div className="text-xs text-neutral-500 uppercase tracking-wider">Lessons Done</div>
                        </div>
                        <div>
                          <div className="text-3xl font-black text-black">
                            {completedActivities}/{totalActivities}
                          </div>
                          <div className="text-xs text-neutral-500 uppercase tracking-wider">Activities Done</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
