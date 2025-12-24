// src/app/pages/Trainee/Learn/LearnContent.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { Modal } from "antd";
import { CheckCircle2, PartyPopper, X, Sparkles } from "lucide-react";
import VideoContent from "./partials/VideoContent";
import ReadingContent from "./partials/ReadingContent";
import QuizContent from "./partials/QuizContent";
import PracticeContent from "./partials/PracticeContent";
import SessionLockScreen from "./partials/SessionLockScreen";
import {
  getActivityRecordsByClassAndSection,
  getMaterialsByActivityRecordId,
  submitActivity,
} from "../../../apis/Trainee/TraineeLearningApi";
import {
  getQuizByActivityRecordId,
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

  // State mới để lưu trạng thái Session
  const [sessionStatus, setSessionStatus] = useState(null);

  const [sectionQuiz, setSectionQuiz] = useState(null);
  const [sectionPractice, setSectionPractice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for beautiful notification modal
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [completedModalMessage, setCompletedModalMessage] = useState('');

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
      setSessionStatus(null);
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

      const activityType = matchedRecord.activityType;

      // 2. Load content based on type
      if (activityType === 'Material') {
        try {
          const { materials, sessionStatus } = await getMaterialsByActivityRecordId(matchedRecord.activityRecordId);
          setMaterialsList(materials || []);
          setSessionStatus(sessionStatus);
        } catch (matError) {
          console.error("Error loading materials with session:", matError);
          throw new Error("Failed to verify session status or load materials.");
        }

      } else if (activityType === 'Quiz') {
        const response = await getQuizByActivityRecordId(matchedRecord.activityRecordId);
        const quizData = response.quiz;
        const sessionStatus = response.sessionStatus;

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
        setSessionStatus(sessionStatus);
      } else if (activityType === 'Practice') {
        // Updated to handle { practice, sessionStatus } response
        const { practice, sessionStatus } = await getPracticeByActivityRecordId(matchedRecord.activityRecordId);

        if (practice) {
          const combinedPracticeData = {
            ...practice,
            title: matchedRecord.activityName || practice.practiceName,
            isCompleted: matchedRecord.isCompleted,
            activityRecord: matchedRecord,
          };
          setSectionPractice(combinedPracticeData);
        }
        setSessionStatus(sessionStatus);
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

    if (sessionStatus && !sessionStatus.isOpen) {
      setCompletedModalMessage(t('trainee.learn.sessionNotOpenAlert'));
      setShowCompletedModal(true);
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

      // Check if error message indicates activity already completed
      const isAlreadyCompleted = msg.toLowerCase().includes('already') ||
        msg.toLowerCase().includes('completed') ||
        msg.toLowerCase().includes('đã hoàn thành');

      if (isAlreadyCompleted) {
        // Không hiển thị modal khi activity đã hoàn thành
        // Chỉ refresh data và sidebar
        await fetchPartitionData();
        refreshSidebar();
      } else {
        // For other errors, still use the beautiful modal
        setCompletedModalMessage(msg);
        setShowCompletedModal(true);
      }
    }
  };

  // Handler for closing the notification modal and optionally reloading
  const handleCloseCompletedModal = () => {
    setShowCompletedModal(false);
    // Refresh data after closing modal
    fetchPartitionData();
    refreshSidebar();
  };

  const handleMarkAsNotComplete = async () => {
    alert("Unmarking is not supported at this time.");
  };

  // --- PHẦN RENDER - Industrial Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent animate-spin mb-4" />
        <p className="text-neutral-500 uppercase tracking-wider font-semibold">{t('trainee.learn.loadingContent')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-red-500 flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-black">!</span>
        </div>
        <h2 className="text-xl font-black text-red-600 uppercase mb-2">{t('common.error')}</h2>
        <p className="text-neutral-600">{error}</p>
      </div>
    );
  }

  if (!activityRecord) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-neutral-200 flex items-center justify-center mb-4">
          <span className="text-neutral-500 text-2xl font-black">?</span>
        </div>
        <h2 className="text-xl font-black text-neutral-900 uppercase mb-2">
          {t('trainee.learn.contentNotFound')}
        </h2>
        <p className="text-neutral-600">
          {t('trainee.learn.contentNotFoundDesc')}
        </p>
      </div>
    );
  }

  // Kiểm tra và khóa nội dung nếu session chưa mở
  const isSessionOpen = sessionStatus ? sessionStatus.isOpen : true;

  if (!isSessionOpen) {
    return (
      <SessionLockScreen
        sessionStatus={sessionStatus}
        activityName={activityRecord?.activityName}
      />
    );
  }

  // Lấy trạng thái hoàn thành chung của Activity
  const isActivityCompleted = activityRecord?.isCompleted || false;

  switch (activityRecord.activityType) {
    case "Material":
      return (
        <div className="space-y-6">
          {/* Beautiful Notification Modal */}
          <Modal
            open={showCompletedModal}
            onCancel={handleCloseCompletedModal}
            footer={null}
            centered
            width={420}
            closable={false}
            className="completion-notification-modal"
          >
            <div className="text-center py-6 px-2">
              {/* Animated Icon Container */}
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 border-4 border-black bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 flex items-center justify-center mx-auto shadow-lg transform transition-transform hover:scale-105">
                  <CheckCircle2 className="w-12 h-12 text-black animate-bounce" />
                </div>
                {/* Sparkle decorations */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-yellow-400 border-2 border-black flex items-center justify-center">
                  <PartyPopper className="w-3 h-3 text-black" />
                </div>
              </div>

              {/* Title with celebration emoji */}
              <h2 className="text-2xl font-black text-black uppercase mb-3 tracking-tight">
                {t('trainee.learn.activityAlreadyCompleted')}
              </h2>

              {/* Description */}
              <p className="text-lg text-neutral-600 mb-2">
                {t('trainee.learn.activityAlreadyCompletedDesc')}
              </p>

              {/* Message dịch từ i18n */}
              <div className="bg-yellow-50 border-2 border-yellow-400 p-3 mb-6 mx-4">
                <p className="text-sm text-yellow-800 font-medium">
                  {t('trainee.learn.activityAlreadyCompletedNote')}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 text-black mb-6">
                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-bold uppercase tracking-wide">{t('trainee.learn.completed')}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCloseCompletedModal}
                className="px-8 py-3 bg-yellow-400 text-black font-black text-base uppercase tracking-wider border-4 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                {t('trainee.learn.gotIt')}
              </button>
            </div>
          </Modal>

          {materialsList.length > 0 ? (
            materialsList.map((material) => {
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
                    sessionStatus={sessionStatus}
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
                    sessionStatus={sessionStatus}
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
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-neutral-200 flex items-center justify-center mb-4">
                <span className="text-neutral-500 text-2xl font-black">?</span>
              </div>
              <h2 className="text-xl font-black text-neutral-900 uppercase mb-2">
                {t('trainee.learn.noMaterials')}
              </h2>
              <p className="text-neutral-600">
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
            sessionStatus={sessionStatus}
          />
        )
      );

    case "Practice":
      return (
        sectionPractice && (
          <PracticeContent
            practiceId={sectionPractice.id} // <--- ADD THIS LINE
            activityRecordId={sectionPractice.activityRecord.activityRecordId}
            title={sectionPractice.title}
            completed={sectionPractice.isCompleted}
            description={sectionPractice.practiceDescription}
            duration={`${sectionPractice.estimatedDurationMinutes || 0} min`}
            tasks={sectionPractice.tasks}
            sessionStatus={sessionStatus}
          />
        )
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-neutral-200 flex items-center justify-center mb-4">
            <span className="text-neutral-500 text-2xl font-black">?</span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 uppercase mb-2">
            {t('trainee.learn.unsupportedType')}
          </h2>
          <p className="text-neutral-600">
            {t('trainee.learn.unsupportedTypeDesc', { type: activityRecord.activityType })}
          </p>
        </div>
      );
  }
}