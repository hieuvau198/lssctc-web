// src/app/pages/Trainee/Learn/LearnContent.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import VideoContent from "./partials/VideoContent";
import ReadingContent from "./partials/ReadingContent";
import QuizContent from "./partials/QuizContent";
import PracticeContent from "./partials/PracticeContent"; // <-- Import PracticeContent
import {
  // APIs được giữ lại
  markSectionMaterialAsCompleted,
  markSectionMaterialAsNotCompleted,
  getActivityRecordsByClassAndSection,
  // API mới cho Material
  getMaterialsByActivityId,
} from "../../../apis/Trainee/TraineeLearningApi";
import { 
  getQuizWithoutAnswers, 
  submitSectionQuizAttempt, 
  mapQuizAttempt,
} from "../../../apis/Trainee/TraineeQuizApi"; // <-- Import API Quiz MỚI

// --- IMPORT ĐỂ XỬ LÝ AUTH ---
import { getAuthToken } from "../../../libs/cookies";
import { decodeToken } from "../../../libs/jwtDecode";
import useAuthStore from "../../../store/authStore";
// --- KẾT THÚC IMPORT ---

export default function LearnContent() {
  const { courseId, sectionId, partitionId } = useParams(); // partitionId là activityId
  const activityId = parseInt(partitionId, 10); // Đảm bảo là số

  // --- LOGIC TRAINEE ID ---
  const traineeIdFromStore = useAuthStore((s) => s.nameid);
  const [traineeId, setTraineeId] = useState(null);
  // --- KẾT THÚC LOGIC ---

  const [activityRecord, setActivityRecord] = useState(null); // Bản ghi chứa mọi thông tin
  const [materialsList, setMaterialsList] = useState([]);
  const [sectionQuiz, setSectionQuiz] = useState(null); // Sẽ lưu trữ dữ liệu từ getQuizWithoutAnswers

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EFFECT LẤY TRAINEE ID ---
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
  // --- KẾT THÚC EFFECT ---

  const fetchPartitionData = useCallback(async () => {
    if (!traineeId || !activityId || !courseId || !sectionId) {
      return; // Chờ tất cả các ID
    }

    try {
      setLoading(true);
      setError(null);
      setMaterialsList([]);
      setSectionQuiz(null);
      setActivityRecord(null);

      console.log("Fetching activity record for activityId:", activityId);

      // 1. Lấy Activity Record (Đây là nguồn thông tin chính)
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

      // 2. Tải nội dung cụ thể dựa trên loại
      if (activityType === "Material") {
        console.log("Fetching materials for activity:", activityId);
        const materialResArray = await getMaterialsByActivityId(activityId);
        console.log("Materials list response:", materialResArray);
        setMaterialsList(materialResArray || []);

      } else if (activityType === "Quiz") {
        console.log("Fetching quiz data for activity (quizId):", activityId);
        // Giả sử activityId cũng chính là quizId
        // Gọi API từ TraineeQuizApi.js
        const quizData = await getQuizWithoutAnswers(activityId); 
        console.log("Quiz data response:", quizData);

        // Gộp dữ liệu từ activityRecord vào
        const combinedQuizData = {
          ...quizData, // Chứa questions, passScoreCriteria, v.v.
          quizId: quizData.id, // Đảm bảo quizId tồn tại
          quizName: matchedRecord.activityName || quizData.name, // Ưu tiên tên từ record
          isCompleted: matchedRecord.isCompleted,
          attemptScore: matchedRecord.score,
          lastAttemptDate: matchedRecord.completedDate,
          activityRecord: matchedRecord,
          // Ánh xạ các trường cũ mà QuizContent có thể cần
          sectionQuizId: activityId, // Dùng tạm
          learningRecordPartitionId: activityId, // Dùng tạm
        };
        
        setSectionQuiz(combinedQuizData);
      
      } else if (activityType === "Practice") {
        // Không cần làm gì thêm, chỉ cần activityRecord là đủ
        console.log("Setting up Practice content");
      } else {
        console.warn("Unknown activityType:", activityType);
        throw new Error(`Unsupported content type: ${activityType}`);
      }

    } catch (err) {
      console.error("Error fetching partition data:", err);
      setError(err.message || "Failed to load learning content.");
    } finally {
      setLoading(false);
    }
  }, [activityId, traineeId, courseId, sectionId]); // Đổi partitionId -> activityId

  useEffect(() => {
    fetchPartitionData();
  }, [fetchPartitionData]);

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

    case "Quiz":
      // Cần một "partition" giả lập cho QuizContent
      const quizPartition = {
        sectionPartitionId: activityRecord.activityId,
        // ... các trường khác mà QuizContent có thể cần
      };
      return (
        sectionQuiz && (
          <QuizContent
            sectionQuiz={sectionQuiz} // Dữ liệu quiz từ getQuizWithoutAnswers + record
            partition={quizPartition}  // ID
            onReload={fetchPartitionData}
          />
        )
      );
    
    case "Practice":
      return (
        <PracticeContent 
          title={activityRecord.activityName}
          completed={isActivityCompleted}
          description={"This is a simulation practice."} // TODO: Lấy mô tả từ đâu đó?
          duration={activityRecord.estimatedDurationMinutes || "N/A"} // TODO: DTO không có
        />
      );

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