// src/app/pages/Trainee/Learn/LearnContent.jsx

// Ghi chú refactor của bạn đã được giải quyết
// trainee id sẽ được lấy từ token
// get section records / activity records (được xử lý trong CourseSection.jsx)
// merge... (được xử lý trong CourseSection.jsx)
// for each type of activity... (được xử lý trong component này)

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import VideoContent from "./partials/VideoContent";
import ReadingContent from "./partials/ReadingContent";
import QuizContent from "./partials/QuizContent";
import {
  getLearningPartitionByIdAndTraineeId, // API này có thể không còn dùng nữa nếu partitionId là activityId
  getLearningSectionMaterial,
  markSectionMaterialAsCompleted,
  markSectionMaterialAsNotCompleted,
  getLearningSectionQuiz,
  getActivityRecordsByClassAndSection,
  getActivityById,
} from "../../../apis/Trainee/TraineeLearningApi";

// --- IMPORT MỚI ĐỂ XỬ LÝ AUTH ---
import { getAuthToken } from "../../../libs/cookies";
import { decodeToken } from "../../../libs/jwtDecode";
import useAuthStore from "../../../store/authStore";
// --- KẾT THÚC IMPORT MỚI ---

export default function LearnContent() {
  const { courseId, sectionId, partitionId } = useParams(); // partitionId bây giờ là activityId
  
  // --- LOGIC TRAINEE ID MỚI ---
  // const traineeId = 1; // Hardcoded trainee ID - ĐÃ XÓA
  const traineeIdFromStore = useAuthStore((s) => s.nameid);
  const [traineeId, setTraineeId] = useState(null);
  // --- KẾT THÚC LOGIC TRAINEE ID MỚI ---

  // 'partition' bây giờ có nghĩa là 'activity'
  const [partition, setPartition] = useState(null); // Sẽ lưu trữ dữ liệu từ getActivityById
  const [partitionMaterial, setPartitionMaterial] = useState(null);
  const [sectionQuiz, setSectionQuiz] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EFFECT MỚI ĐỂ LẤY TRAINEE ID ---
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
      console.error("Trainee ID could not be resolved.");
      setError("Trainee ID not available. Please log in again.");
      setLoading(false);
    } else {
      setTraineeId(resolvedTraineeId);
    }
  }, [traineeIdFromStore]);
  // --- KẾT THÚC EFFECT MỚI ---

  const fetchPartitionData = useCallback(async () => {
    // --- Thêm Guard Clause ---
    if (!traineeId || !partitionId || !courseId || !sectionId) {
      // Đợi cho đến khi tất cả ID
      return;
    }
    // --- KẾT THÚC Guard Clause ---

    try {
      setLoading(true);
      setError(null);
      setPartitionMaterial(null);
      setSectionQuiz(null);

      console.log("Fetching activity (partition):", partitionId, "for trainee:", traineeId);
      
      // 1. Lấy metadata của Activity (tên, loại, v.v.)
      // Chúng ta sử dụng getActivityById thay vì getLearningPartitionByIdAndTraineeId
      const activityMeta = await getActivityById(partitionId);
      
      // Giả lập đối tượng 'partitionRes' cũ dựa trên activityMeta
      const partitionRes = {
        sectionPartitionId: activityMeta.activityId, // Ánh xạ ID
        partitionType: activityMeta.activityType,    // Ánh xạ Loại
        partitionName: activityMeta.activityTitle,   // Ánh xạ Tên
        //... các trường khác nếu cần
      };
      setPartition(partitionRes);
      console.log("Activity (Partition) response:", partitionRes);

      // 2. Lấy Activity Record (để biết trạng thái hoàn thành, điểm số)
      let activityRecord = null;
      try {
        const activityRecords = await getActivityRecordsByClassAndSection(courseId, sectionId);
        activityRecord = activityRecords.find(
          (r) => r.activityId === partitionId
        );
      } catch (e) {
        console.debug('No activity records available for section', sectionId, e);
      }

      // 3. Xử lý dựa trên loại (partitionType)
      if ([1, 2].includes(partitionRes.partitionType)) { // Video (1) hoặc Document (2)
        console.log("Fetching section material for activity (partition):", partitionId);
        
        // API 'getLearningSectionMaterial' có thể vẫn cần thiết nếu nó trả về URL
        // Giả sử partitionId (activityId) có thể được dùng ở đây
        const materialRes = await getLearningSectionMaterial(partitionId, traineeId);
        console.log("Material response:", materialRes);

        // Gộp metadata
        materialRes.materialName = materialRes.materialName || activityMeta.activityTitle;
        materialRes.materialDescription = materialRes.materialDescription || activityMeta.activityDescription;
        materialRes.estimatedDurationMinutes = materialRes.estimatedDurationMinutes || activityMeta.estimatedDurationMinutes;

        // Gộp activity record (nếu có)
        if (activityRecord) {
          materialRes.isCompleted = activityRecord.isCompleted;
          materialRes.activityRecord = activityRecord;
        }

        setPartitionMaterial(materialRes);

      } else if (partitionRes.partitionType === 3) { // Quiz (3)
        console.log("Fetching section quiz for activity (partition):", partitionId);
        
        // API 'getLearningSectionQuiz' có thể vẫn cần thiết
        const quizRes = await getLearningSectionQuiz(partitionId, traineeId);
        console.log("Quiz response:", quizRes);

        // Gộp metadata
        quizRes.quizName = quizRes.quizName || activityMeta.activityTitle;
        quizRes.description = quizRes.description || activityMeta.activityDescription;
        quizRes.timelimitMinute = quizRes.timelimitMinute || activityMeta.estimatedDurationMinutes;

        // Gộp activity record (nếu có)
        if (activityRecord) {
          quizRes.isCompleted = activityRecord.isCompleted;
          quizRes.attemptScore = activityRecord.score ?? quizRes.attemptScore;
          quizRes.lastAttemptDate = activityRecord.completedDate ?? quizRes.lastAttemptDate;
          quizRes.activityRecord = activityRecord;
        }

        setSectionQuiz(quizRes);
      }
      // TODO: Thêm xử lý cho 'Practice' (partitionType = 4?)
      
    } catch (err) {
      console.error("Error fetching partition/material/quiz:", err);
      setError("Failed to load learning content. Check console for details.");
    } finally {
      setLoading(false);
    }
  }, [partitionId, traineeId, courseId, sectionId]); // <-- Cập nhật dependencies

  useEffect(() => {
    // Chỉ fetch khi tất cả ID đã sẵn sàng
    if (traineeId && partitionId && courseId && sectionId) {
      fetchPartitionData();
    }
  }, [fetchPartitionData, traineeId, partitionId, courseId, sectionId]); // <-- Cập nhật dependencies

  // handle mark material as complete
  const handleMarkAsComplete = async () => {
    if (!partition || !partitionMaterial || !traineeId) return; // Thêm kiểm tra traineeId
    const success = await markSectionMaterialAsCompleted(
      partition.sectionPartitionId, // Vẫn dùng sectionPartitionId (mà chúng ta đã gán bằng activityId)
      traineeId
    );
    if (success) {
      await fetchPartitionData();
    } else {
      alert("Failed to mark as complete. Please try again.");
    }
  };

  // handle mark material as not complete
  const handleMarkAsNotComplete = async () => {
    if (!partition || !partitionMaterial || !traineeId) return; // Thêm kiểm tra traineeId
    const success = await markSectionMaterialAsNotCompleted(
      partition.sectionPartitionId,
      traineeId
    );
    if (success) {
      await fetchPartitionData();
    } else {
      alert("Failed to mark as not complete. Please try again.");
    }
  };

  // --- PHẦN RENDER (Không thay đổi) ---
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

  if (!partition) {
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

  switch (partition.partitionType) {
    case 1: // Video
      return (
        partitionMaterial && (
          <VideoContent
            title={partitionMaterial.materialName || "Untitled Video"}
            completed={partitionMaterial.isCompleted}
            videoUrl={partitionMaterial.materialUrl}
            onMarkAsComplete={handleMarkAsComplete}
            onMarkAsNotComplete={handleMarkAsNotComplete}
          />
        )
      );

    case 2: // Document
      return (
        partitionMaterial && (
          <ReadingContent
            title={partitionMaterial.materialName || "Untitled Document"}
            completed={partitionMaterial.isCompleted}
            documentUrl={partitionMaterial.materialUrl}
            onMarkAsComplete={handleMarkAsComplete}
            onMarkAsNotComplete={handleMarkAsNotComplete}
          />
        )
      );

    case 3: // Quiz
      return (
        sectionQuiz && (
          <QuizContent
            sectionQuiz={sectionQuiz}
            partition={partition}
            onReload={fetchPartitionData}
          />
        )
      );
    
    // TODO: Thêm Case 4 cho PracticeContent
    // case 4: // Practice
    //   return (
    //     <PracticeContent 
    //       title={partition.partitionName}
    //       ...
    //     />
    //   )

    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Unsupported Content Type
          </h2>
          <p className="text-slate-600">
            This type of content (type {partition.partitionType}) is not yet
            supported.
          </p>
        </div>
      );
  }
}