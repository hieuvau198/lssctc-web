// src/app/pages/Trainee/Learn/LearnContent.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import VideoContent from "./partials/VideoContent";
import ReadingContent from "./partials/ReadingContent";
import QuizContent from "./partials/QuizContent";
import PracticeContent from "./partials/PracticeContent";
import {
  markSectionMaterialAsCompleted,
  markSectionMaterialAsNotCompleted,
  getActivityRecordsByClassAndSection,
  getMaterialsByActivityRecordId, // [UPDATED] Import hàm API mới
  submitActivity, 
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

// Import context for sidebar refresh
import { useLearningSidebar } from "../../../contexts/LearningSidebarContext";

export default function LearnContent() {
  const { t } = useTranslation();
  const { courseId, sectionId, partitionId } = useParams();
  const activityId = parseInt(partitionId, 10);

  // Get refreshSidebar function from context
  const { refreshSidebar } = useLearningSidebar();

  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;
  const [traineeId, setTraineeId] = useState(null);

  const [activityRecord, setActivityRecord] = useState(null);
  const [materialsList, setMaterialsList] = useState([]);
  
  // [UPDATED] State mới để lưu trạng thái Session
  const [sessionStatus, setSessionStatus] = useState(null);

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
      setError(t('trainee.learn.traineeIdNotAvailable'));
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
      setSessionStatus(null); // [UPDATED] Reset session status
      setSectionQuiz(null);
      setSectionPractice(null); 
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

      // 2. Load content based on type
      if (activityType === 'Material') {
        // [UPDATED] Sử dụng API mới nhận activityRecordId để lấy cả material và session status
        try {
            const { materials, sessionStatus } = await getMaterialsByActivityRecordId(matchedRecord.activityRecordId);
            setMaterialsList(materials || []);
            setSessionStatus(sessionStatus); // Lưu trạng thái session
        } catch (matError) {
            console.error("Error loading materials with session:", matError);
            throw new Error("Failed to verify session status or load materials.");
        }

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
        const practiceData = await getPracticeByActivityRecordId(matchedRecord.activityRecordId); 
        const combinedPracticeData = {
          ...practiceData,
          title: matchedRecord.activityName || practiceData.practiceName,
          isCompleted: matchedRecord.isCompleted,
          activityRecord: matchedRecord,
        };
        setSectionPractice(combinedPracticeData);
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
    console.log('[LearnContent] handleQuizSubmit triggered.');
    if (!activityRecord || activityRecord.activityType !== 'Quiz') {
      console.error('[LearnContent] Missing activityRecord for quiz.');
      throw new Error('Activity record for this quiz is missing.');
    }

    const payload = {
      activityRecordId: activityRecord.activityRecordId,
      answers: answers,
    };

    console.log('[LearnContent] Calling submitQuizAttempt with payload:', payload);

    try {
      const result = await submitQuizAttempt(payload);
      console.log('[LearnContent] API call successful, result:', result);
      
      await fetchPartitionData();
      refreshSidebar();
      return result;
    } catch (err) {
      console.error('[LearnContent] API call failed:', err);
      alert(`Failed to submit quiz: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };

  const handleMarkAsComplete = async () => {
    if (!activityRecord || activityRecord.activityType !== 'Material') return;

    // [UPDATED] Kiểm tra logic session trước khi cho phép gọi API (Client-side validation)
    if (sessionStatus && !sessionStatus.isOpen) {
        alert(t('trainee.learn.sessionNotOpenAlert')); // Cần đảm bảo có key translation này hoặc dùng text cứng
        return;
    }

    try {
      const payload = {
        activityRecordId: activityRecord.activityRecordId
      };

      await submitActivity(payload);
      
      await fetchPartitionData();
      refreshSidebar();
      
    } catch (err) {
      console.error("Error submitting activity:", err);
      const msg = err.response?.data?.message || "Failed to mark as complete.";
      alert(msg);
    }
  };

  const handleMarkAsNotComplete = async () => {
    alert("Unmarking is not supported at this time.");
  };

  // --- PHẦN RENDER ---
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">{t('trainee.learn.loadingContent')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">{t('common.error')}</h2>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (!activityRecord) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {t('trainee.learn.contentNotFound')}
        </h2>
        <p className="text-slate-600">
          {t('trainee.learn.contentNotFoundDesc')}
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
              // Logic detect type giữ nguyên
              const url = (material.materialUrl || '').toLowerCase();
              const isDocumentByUrl = url.endsWith('.pdf') || url.endsWith('.doc') || url.endsWith('.docx') || url.endsWith('.txt');
              const isVideoByUrl = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.endsWith('.avi') || url.includes('youtube.com') || url.includes('vimeo.com');

              const materialType = String(material.learningMaterialType || '').toLowerCase();
              const isDocument = isDocumentByUrl || (!isVideoByUrl && (materialType === 'document' || materialType === '0' || material.learningMaterialType === 0));
              const isVideo = isVideoByUrl || (!isDocumentByUrl && (materialType === 'video' || materialType === '1' || material.learningMaterialType === 1));

              if (isDocument) {
                return (
                  <ReadingContent
                    key={material.id}
                    title={material.name || "Untitled Document"}
                    completed={isActivityCompleted}
                    documentUrl={material.materialUrl}
                    onMarkAsComplete={handleMarkAsComplete}
                    onMarkAsNotComplete={handleMarkAsNotComplete}
                    sessionStatus={sessionStatus} // [UPDATED] Truyền session status xuống
                  />
                );
              } else if (isVideo) {
                return (
                  <VideoContent
                    key={material.id}
                    title={material.name || "Untitled Video"}
                    completed={isActivityCompleted}
                    videoUrl={material.materialUrl}
                    onMarkAsComplete={handleMarkAsComplete}
                    onMarkAsNotComplete={handleMarkAsNotComplete}
                    sessionStatus={sessionStatus} // [UPDATED] Truyền session status xuống
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
                {t('trainee.learn.noMaterials')}
              </h2>
              <p className="text-slate-600">
                {t('trainee.learn.noMaterialsDesc')}
              </p>
            </div>
          )}
        </div>
      );

    case 'Quiz':
      const quizPartition = {
        sectionPartitionId: activityRecord.activityId,
      };
      return (
        sectionQuiz && (
          <QuizContent
            sectionQuiz={sectionQuiz}
            partition={quizPartition}
            onReload={fetchPartitionData}
            onSubmitAttempt={handleQuizSubmit}
          />
        )
      );
    
    case "Practice":
      return (
        sectionPractice && (
          <PracticeContent 
            title={sectionPractice.title}
            completed={sectionPractice.isCompleted}
            description={sectionPractice.practiceDescription}
            duration={`${sectionPractice.estimatedDurationMinutes || 0} min`}
            tasks={sectionPractice.tasks}
          />
        )
      );

    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {t('trainee.learn.unsupportedType')}
          </h2>
          <p className="text-slate-600">
            {t('trainee.learn.unsupportedTypeDesc', { type: activityRecord.activityType })}
          </p>
        </div>
      );
  }
}