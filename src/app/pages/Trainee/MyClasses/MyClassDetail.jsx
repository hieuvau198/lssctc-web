// src\app\pages\Trainee\MyClasses\MyClassDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageNav from "../../../components/PageNav/PageNav";
import ClassHeader from "./partials/ClassHeader";
import CourseOverview from "./partials/CourseOverview";
import CourseModules from "./partials/CourseModules";
import InstructorInfo from "./partials/InstructorInfo";
import ClassSchedule from "./partials/ClassSchedule";
import { getLearningClassByIdAndTraineeId } from "../../../apis/Trainee/TraineeLearningApi";

export default function MyClassDetail() {
  const { id } = useParams();
  const traineeId = 1; // hardcoded

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded instructor data
  const mockInstructor = {
    id: 1,
    name: "John Smith",
    email: "john.smith@lssctc.edu",
    phone: "+84 123 456 789",
    specialization: "Mobile Crane Operations",
    yearsOfExperience: 15,
    certifications: [
      "Certified Crane Operator",
      "Safety Training Specialist",
      "OSHA 30-Hour",
    ],
  };

  // Hardcoded course list for the class
  const mockClassCourses = [
    {
      id: 1,
      name: "Mobile Crane Operations – Level 1 (Beginner)",
      code: "MCO-L1-001",
      description: "Introduction to mobile crane operations with safety focus",
      progress: 85,
      status: "in-progress",
      duration: 48,
      price: 5000000,
      startDate: "2025-09-01",
      endDate: "2025-11-30",
      instructor: "John Smith",
      category: "Mobile Crane",
    },
    {
      id: 2,
      name: "Safety Protocols and Risk Management",
      code: "SPR-L1-002",
      description: "Comprehensive safety training for crane operations",
      progress: 100,
      status: "completed",
      duration: 24,
      price: 3000000,
      startDate: "2025-08-15",
      endDate: "2025-09-15",
      instructor: "John Smith",
      category: "Safety Training",
    },
  ];

  // Fetch class data from API
  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const data = await getLearningClassByIdAndTraineeId(id, traineeId);
        setClassData({
          id: data.classId,
          name: data.className,
          startDate: data.classStartDate,
          endDate: data.classEndDate,
          classCapacity: data.classCapacity,
		  classCode: data.classCode,
		  programCourseId: data.programCourseId,
		  courseId: data.courseId,
          courseCode: data.courseCode,
          courseName: data.courseName,
          description: data.courseDescription,
		  durationHours: data.durationHours,
          status: data.classStatus,
		  progress: data.classProgress,
          provider: "Global Crane Academy", // placeholder if API doesn’t return provider
          badge: "Foundational",
          color: "from-cyan-500 to-blue-600",
        });
      } catch (err) {
        console.error("Failed to fetch class detail:", err);
        setError("Unable to load class details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-600">Loading class details...</p>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageNav nameMap={{ "my-classes": "My Classes" }} />
        <div className="mt-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Class Not Found</h1>
          <p className="text-slate-600">
            {error || "The class you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav nameMap={{ "my-classes": "My Classes", [id]: classData.name }} />
      <div className="mt-2">
        {/* Class Header */}
        <ClassHeader classData={classData} />

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CourseOverview classData={classData} />
            <CourseModules mockClassCourses={mockClassCourses} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <InstructorInfo mockInstructor={mockInstructor} />
            <ClassSchedule classData={classData} />
          </div>
        </div>
      </div>
    </div>
  );
}

