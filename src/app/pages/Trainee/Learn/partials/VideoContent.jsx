// src\app\pages\Trainee\Learn\partials\VideoContent.jsx

import React, { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Button, Progress, Tag } from "antd";
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
  sessionStatus
}) {
  const { t } = useTranslation();
  const [completed, setCompleted] = useState(initialCompleted);
  const [progress, setProgress] = useState(initialCompleted ? 100 : 0);
  const videoRef = useRef(null);

  const youtubeVideoId = getYouTubeVideoId(videoUrl);
  const isYouTube = isYouTubeUrl(videoUrl);

  const isSessionOpen = sessionStatus ? sessionStatus.isOpen : true;

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);

    if (percent >= 95 && !completed && isSessionOpen) {
      setCompleted(true);
      console.log('🎉 User watched the video completely');
      if (onMarkAsComplete) onMarkAsComplete();
    }
  };

  const handleVideoEnd = () => {
    if (isSessionOpen) {
      setCompleted(true);
      setProgress(100);
      console.log("✅ Video ended – user watched it all");
      if (onMarkAsComplete) onMarkAsComplete();
    }
  };

  const handleManualMarkComplete = () => {
    if (isSessionOpen) {
      setCompleted(true);
      setProgress(100);
      if (onMarkAsComplete) onMarkAsComplete();
    }
  };

  return (
    <div className="space-y-3">
      {/* Session Warning Banner */}
      {sessionStatus && !isSessionOpen && (
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-amber-700 block text-sm">
              {sessionStatus.message === "Not started yet"
                ? t('trainee.learn.sessionNotStarted')
                : t('trainee.learn.sessionExpired')}
            </span>
            <span className="text-xs text-amber-600">
              {sessionStatus.startTime && `Start: ${dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm')}`}
              {sessionStatus.endTime && ` - End: ${dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm')}`}
            </span>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />

        {/* Compact Header */}
        <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-200">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Tag color="cyan" className="text-xs font-medium m-0">{t('trainee.learn.video')}</Tag>
                {completed && (
                  <Tag color="success" className="text-xs font-medium m-0">{t('trainee.learn.completed')}</Tag>
                )}
              </div>
              <h1 className="text-base font-semibold text-slate-900 leading-tight mt-0.5">{title}</h1>
            </div>
          </div>

          {/* Quick status */}
          {completed ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{t('trainee.learn.completed')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">{t('trainee.learn.inProgress')}</span>
            </div>
          )}
        </div>

        {/* Video Player - Larger */}
        <div className="p-4">
          <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-lg min-h-[50vh]">
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
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold">{title}</p>
                  <p className="text-slate-400 text-sm">{t('trainee.learn.noVideoUrl')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar - only show for native videos */}
          {!isYouTube && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span>{t('trainee.learn.watchProgress')}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress
                percent={Math.round(progress)}
                status={completed ? "success" : "active"}
                strokeColor={{ from: '#06b6d4', to: '#3b82f6' }}
                showInfo={false}
                size="small"
              />
            </div>
          )}

          {/* Manual mark button for YouTube */}
          {isYouTube && !completed && (
            <div className="mt-3 text-right">
              <Button type="primary" size="small" onClick={handleManualMarkComplete}>
                {t('trainee.learn.markComplete')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}