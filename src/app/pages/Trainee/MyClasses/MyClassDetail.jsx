// src\app\pages\Trainee\MyClasses\MyClassDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageNav from "../../../components/PageNav/PageNav";
import ClassHeader from "./partials/ClassHeader";
import ClassOverview from "./partials/ClassOverview";
import Sections from "./partials/Sections";
import InstructorInfo from "./partials/InstructorInfo";
import ClassSchedule from "./partials/ClassSchedule";
import { 
	getLearningClassByIdAndTraineeId,
	getLearningSectionsByClassIdAndTraineeId
 } from "../../../apis/Trainee/TraineeLearningApi";

export default function MyClassDetail() {
  const { id } = useParams();
  const traineeId = 1; // hardcoded

  const [classData, setClassData] = useState(null);
  const [sections, setSections] = useState([]);
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

  // Fetch learning class data, learning section data from API
  useEffect(() => {
    const fetchClassDetailAndSections = async () => {
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
		  courseDurationHours: data.courseDurationHours,
          status: data.classStatus,
		  progress: data.classProgress,
          provider: "Global Crane Academy",
          badge: "Foundational",
          color: "from-cyan-500 to-blue-600",
        });

		// Fetch sections
        const sectionsRes = await getLearningSectionsByClassIdAndTraineeId(id, traineeId);
        setSections(sectionsRes || []);
      } catch (err) {
        console.error("Failed to fetch class detail:", err);
        setError("Unable to load class details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetailAndSections();
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
        <ClassHeader classData={classData} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ClassOverview classData={classData} />
            <Sections sections = {sections} classId = {classData.id} />
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

