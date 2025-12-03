// src\app\pages\Trainee\Learn\partials\VideoContent.jsx

import React, { useState, useRef } from "react";
import { Card, Button, Progress } from "antd";
import { Play, CheckCircle2 } from "lucide-react";

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
  onMarkAsNotComplete,
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [progress, setProgress] = useState(initialCompleted ? 100 : 0);
  const videoRef = useRef(null);

  const youtubeVideoId = getYouTubeVideoId(videoUrl);
  const isYouTube = isYouTubeUrl(videoUrl);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);

    // Mark as completed if watched 95%+
    if (percent >= 95 && !completed) {
      setCompleted(true);
      console.log('🎉 User watched the video completely');
      if (onMarkAsComplete) onMarkAsComplete();
    }
  };

  const handleVideoEnd = () => {
    setCompleted(true);
    setProgress(100);
    console.log("✅ Video ended – user watched it all");
    if (onMarkAsComplete) onMarkAsComplete();
  };

  // For YouTube videos, provide manual mark complete button
  const handleManualMarkComplete = () => {
    setCompleted(true);
    setProgress(100);
    if (onMarkAsComplete) onMarkAsComplete();
  };

  const handleManualMarkIncomplete = () => {
    setCompleted(false);
    setProgress(0);
    if (onMarkAsNotComplete) onMarkAsNotComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {isYouTube && youtubeVideoId ? (
              // YouTube embed iframe
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoUrl ? (
              // Native video player for direct video URLs
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
              <div className="h-full w-full flex items-center justify-center text-white bg-slate-900">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">{title}</p>
                  <p className="text-slate-300">No video URL provided</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar - only show for native videos */}
        {!isYouTube && (
          <Progress
            percent={Math.round(progress)}
            status={completed ? "success" : "active"}
          />
        )}

        {/* Completion Status & Manual Controls */}
        <div className="flex items-center justify-between mt-4">
          {completed ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Completed</span>
            </div>
          ) : (
            <div />
          )}

          {/* Manual mark buttons for YouTube (since we can't track progress) */}
          {isYouTube && (
            <div className="flex gap-2">
              {!completed ? (
                <Button type="primary" onClick={handleManualMarkComplete}>
                  Mark as Complete
                </Button>
              ) : (
                <Button danger onClick={handleManualMarkIncomplete}>
                  Mark as Incomplete
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
