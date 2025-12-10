// src\app\pages\Trainee\Learn\partials\VideoContent.jsx

import React, { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Button, Progress, Tag, Alert } from "antd"; // Import Alert
import { Play, CheckCircle2, Video, Clock, AlertCircle } from "lucide-react";
import dayjs from 'dayjs';

// Helper to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/,
    /youtube\.com\/watch\?.*v=([^&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Check if URL is a YouTube video
const isYouTubeUrl = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default function VideoContent({
  title,
  completed: initialCompleted = false,
  videoUrl,
  onMarkAsComplete,
  sessionStatus // [NEW] Nhận prop sessionStatus
}) {
  const { t } = useTranslation();
  const [completed, setCompleted] = useState(initialCompleted);
  const [progress, setProgress] = useState(initialCompleted ? 100 : 0);
  const videoRef = useRef(null);

  const youtubeVideoId = getYouTubeVideoId(videoUrl);
  const isYouTube = isYouTubeUrl(videoUrl);
  
  // [NEW] Logic kiểm tra session
  const isSessionOpen = sessionStatus ? sessionStatus.isOpen : true;

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);

    // [UPDATED] Chỉ mark complete nếu session mở
    if (percent >= 95 && !completed && isSessionOpen) {
      setCompleted(true);
      console.log('🎉 User watched the video completely');
      if (onMarkAsComplete) onMarkAsComplete();
    }
  };

  const handleVideoEnd = () => {
    // [UPDATED]
    if(isSessionOpen) {
        setCompleted(true);
        setProgress(100);
        console.log("✅ Video ended – user watched it all");
        if (onMarkAsComplete) onMarkAsComplete();
    }
  };

  const handleManualMarkComplete = () => {
    // [UPDATED]
    if(isSessionOpen) {
        setCompleted(true);
        setProgress(100);
        if (onMarkAsComplete) onMarkAsComplete();
    }
  };

  return (
    <div className="space-y-4">
      {/* [NEW] Session Warning Banner */}
      {sessionStatus && !isSessionOpen && (
        <Alert
          message={
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-red-600">
                {sessionStatus.message === "Not started yet" 
                  ? t('trainee.learn.sessionNotStarted') 
                  : t('trainee.learn.sessionExpired')}
              </span>
              <span className="text-xs text-gray-500">
                {sessionStatus.startTime && `Start: ${dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm')}`}
                {sessionStatus.endTime && ` - End: ${dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm')}`}
              </span>
            </div>
          }
          type="warning"
          showIcon
          icon={<AlertCircle className="w-5 h-5 text-red-500" />}
          className="border-red-200 bg-red-50"
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag color="blue" className="text-xs font-medium">{t('trainee.learn.video')}</Tag>
                  {completed && (
                    <Tag color="success" className="text-xs font-medium">{t('trainee.learn.completed')}</Tag>
                  )}
                </div>
                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="p-6">
          <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg">
            {isYouTube && youtubeVideoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-full"
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnd}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10" />
                  </div>
                  <p className="text-lg font-semibold">{title}</p>
                  <p className="text-slate-400 text-sm">{t('trainee.learn.noVideoUrl')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar - only show for native videos */}
          {!isYouTube && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>{t('trainee.learn.watchProgress')}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress
                percent={Math.round(progress)}
                status={completed ? "success" : "active"}
                strokeColor={{ from: '#3b82f6', to: '#6366f1' }}
                showInfo={false}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {completed ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{t('trainee.learn.completed')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{t('trainee.learn.inProgress')}</span>
              </div>
            )}
          </div>

          {/* Manual mark button for YouTube */}
          {isYouTube && !completed && (
            <Button type="primary" onClick={handleManualMarkComplete} className="shadow-sm">
              {t('trainee.learn.markComplete')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}