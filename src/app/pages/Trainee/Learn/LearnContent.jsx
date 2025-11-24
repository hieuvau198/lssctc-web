// src/app/pages/Trainee/Learn/LearnContent.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import VideoContent from "./partials/VideoContent";
import ReadingContent from "./partials/ReadingContent";
import QuizContent from "./partials/QuizContent";
import PracticeContent from "./partials/PracticeContent";
import {
  markSectionMaterialAsCompleted,
  markSectionMaterialAsNotCompleted,
  getActivityRecordsByClassAndSection,
  getMaterialsByActivityId,
} from "../../../apis/Trainee/TraineeLearningApi";
import {
  getQuizByActivityIdForTrainee,
  submitQuizAttempt,
} from '../../../apis/Trainee/TraineeQuizApi';
import {
  getPracticeByActivityRecordId
} from '../../../apis/Trainee/TraineePracticeApi';

import { getAuthToken } from "../../../libs/cookies";
import { decodeToken } from "../../../libs/jwtDecode";
import useAuthStore from "../../../store/authStore";

export default function LearnContent() {
  const { courseId, sectionId, partitionId } = useParams();
  const activityId = parseInt(partitionId, 10);

  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;
  const [traineeId, setTraineeId] = useState(null);

  const [activityRecord, setActivityRecord] = useState(null);
  const [materialsList, setMaterialsList] = useState([]);
  const [sectionQuiz, setSectionQuiz] = useState(null);
  const [sectionPractice, setSectionPractice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    const decoded = token ? decodeToken(token) : null;
    const resolvedTraineeId =
      traineeIdFromStore ||
      decoded?.nameid ||
      decoded?.nameId ||
      decoded?.sub ||
      null;

    if (!resolvedTraineeId) {
      setError("Trainee ID not available. Please log in again.");
      setLoading(false);
    } else {
      setTraineeId(resolvedTraineeId);
    }
  }, [traineeIdFromStore]);

  const fetchPartitionData = useCallback(async () => {
    if (!traineeId || !activityId || !courseId || !sectionId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMaterialsList([]);
      setSectionQuiz(null);
      setSectionPractice(null); // <-- RESET PRACTICE STATE
      setActivityRecord(null);

      console.log("Fetching activity record for activityId:", activityId);

      // 1. Get Activity Record
      let matchedRecord = null;
      try {
        const activityRecords = await getActivityRecordsByClassAndSection(
          courseId,
          sectionId
        );
        matchedRecord = activityRecords.find(
          (r) => r.activityId === activityId
        );
        
        if (matchedRecord) {
          setActivityRecord(matchedRecord);
          console.log("Found Activity Record:", matchedRecord);
        } else {
          throw new Error("Activity record not found for this user.");
        }
      } catch (e) {
        console.error("Failed to fetch activity record:", e);
        throw new Error(`Failed to load activity record: ${e.message}`);
      }
      
      const activityType = matchedRecord.activityType; // "Material", "Quiz", "Practice"

      // 2. Load content
      if (activityType === 'Material') {
        const materialResArray = await getMaterialsByActivityId(activityId);
        setMaterialsList(materialResArray || []);
      } else if (activityType === 'Quiz') {
        const quizData = await getQuizByActivityIdForTrainee(activityId);
        const combinedQuizData = {
          ...quizData,
          quizId: quizData.id,
          quizName: matchedRecord.activityName || quizData.name,
          isCompleted: matchedRecord.isCompleted,
          attemptScore: matchedRecord.score,
          lastAttemptDate: matchedRecord.completedDate,
          activityRecord: matchedRecord,
          sectionQuizId: activityId,
          learningRecordPartitionId: activityId,
        };
        setSectionQuiz(combinedQuizData);
      } else if (activityType === 'Practice') {
        // --- LOGIC MỚI ĐỂ LOAD PRACTICE DATA ---
        const practiceData = await getPracticeByActivityRecordId(matchedRecord.activityRecordId); 
        const combinedPracticeData = {
          ...practiceData,
          // Ghi đè các trường từ activity record để đảm bảo đúng
          title: matchedRecord.activityName || practiceData.practiceName,
          isCompleted: matchedRecord.isCompleted,
          activityRecord: matchedRecord,
        };
        setSectionPractice(combinedPracticeData);
        // --- KẾT THÚC LOGIC MỚI ---
      } else {
        throw new Error(`Unsupported content type: ${activityType}`);
      }
    } catch (err) {
      console.error('Error fetching partition data:', err);
      setError(err.message || 'Failed to load learning content.');
    } finally {
      setLoading(false);
    }
  }, [activityId, traineeId, courseId, sectionId]);

  useEffect(() => {
    fetchPartitionData();
  }, [fetchPartitionData]);

  const handleQuizSubmit = async (answers) => {
    console.log('[LearnContent] handleQuizSubmit triggered.'); // <-- LOG
    if (!activityRecord || activityRecord.activityType !== 'Quiz') {
      console.error('[LearnContent] Missing activityRecord for quiz.');
      throw new Error('Activity record for this quiz is missing.');
    }

    const payload = {
      activityRecordId: activityRecord.activityRecordId, // This is the 'Id' from ActivityRecordDto
      answers: answers,
    };

    console.log('[LearnContent] Calling submitQuizAttempt with payload:', payload); // <-- LOG

    try {
      const result = await submitQuizAttempt(payload);
      console.log('[LearnContent] API call successful, result:', result); // <-- LOG
      
      // Reload all data to show the result screen
      await fetchPartitionData();
      return result;
    } catch (err) {
      console.error('[LearnContent] API call failed:', err);
      alert(`Failed to submit quiz: ${err.message || 'Unknown error'}`);
      throw err; // Re-throw error
    }
  };

  // Các hàm markAsComplete/NotComplete giờ chỉ áp dụng cho "Material"
  const handleMarkAsComplete = async () => {
    if (!activityRecord || activityRecord.activityType !== 'Material' || !traineeId) return;
    
    const success = await markSectionMaterialAsCompleted(
      activityRecord.activityId, // Dùng activityId
      traineeId
    );
    if (success) {
      await fetchPartitionData();
    } else {
      alert("Failed to mark as complete. Please try again.");
    }
  };

  const handleMarkAsNotComplete = async () => {
    if (!activityRecord || activityRecord.activityType !== 'Material' || !traineeId) return;

    const success = await markSectionMaterialAsNotCompleted(
      activityRecord.activityId, // Dùng activityId
      traineeId
    );
    if (success) {
      await fetchPartitionData();
    } else {
      alert("Failed to mark as not complete. Please try again.");
    }
  };

  // --- PHẦN RENDER ---
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (!activityRecord) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Content Not Found
        </h2>
        <p className="text-slate-600">
          The requested lesson content could not be found.
        </p>
      </div>
    );
  }

  // Lấy trạng thái hoàn thành chung của Activity
  const isActivityCompleted = activityRecord?.isCompleted || false;

  switch (activityRecord.activityType) {
    case "Material":
      return (
        <div className="space-y-6">
          {materialsList.length > 0 ? (
            materialsList.map((material) => {
              // Dùng learningMaterialType (chuỗi)
              if (material.learningMaterialType === 'Video') {
                return (
                  <VideoContent
                    key={material.id}
                    title={material.name || "Untitled Video"}
                    completed={isActivityCompleted}
                    videoUrl={material.materialUrl}
                    onMarkAsComplete={handleMarkAsComplete}
                    onMarkAsNotComplete={handleMarkAsNotComplete}
                  />
                );
              } else if (material.learningMaterialType === 'Document') {
                return (
                  <ReadingContent
                    key={material.id}
                    title={material.name || "Untitled Document"}
                    completed={isActivityCompleted}
                    documentUrl={material.materialUrl}
                    onMarkAsComplete={handleMarkAsComplete}
                    onMarkAsNotComplete={handleMarkAsNotComplete}
                  />
                );
              }
              return (
                <div key={material.id} className="text-center py-4 text-red-500">
                  Unknown material type: {material.learningMaterialType}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                No Materials Found
              </h2>
              <p className="text-slate-600">
                This activity has no learning materials attached.
              </p>
            </div>
          )}
        </div>
      );

    case 'Quiz':
      // Cần một "partition" giả lập cho QuizContent
      const quizPartition = {
        sectionPartitionId: activityRecord.activityId,
      };
      return (
        sectionQuiz && (
          <QuizContent
            sectionQuiz={sectionQuiz} // Dữ liệu quiz MỚI
            partition={quizPartition}
            onReload={fetchPartitionData}
            onSubmitAttempt={handleQuizSubmit} // <-- Truyền hàm nộp bài MỚI
          />
        )
      );
    
    case "Practice":
      // --- CẬP NHẬT RENDER CHO PRACTICE ---
      return (
        sectionPractice && (
          <PracticeContent 
            title={sectionPractice.title} // Dùng title đã gộp
            completed={sectionPractice.isCompleted} // Dùng isCompleted đã gộp
            description={sectionPractice.practiceDescription} // Dùng mô tả từ practice
            duration={`${sectionPractice.estimatedDurationMinutes || 0} min`} // Dùng duration từ practice
            tasks={sectionPractice.tasks} // <-- THÊM DÒNG NÀY ĐỂ TRUYỀN TASKS
          />
        )
      );
      // --- KẾT THÚC CẬP NHẬT ---

    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Unsupported Content Type
          </h2>
          <p className="text-slate-600">
            This type of content (type {activityRecord.activityType}) is not yet
            supported.
          </p>
        </div>
      );
  }
}