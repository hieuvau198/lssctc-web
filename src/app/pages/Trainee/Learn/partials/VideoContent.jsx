// src\app\pages\Trainee\Learn\partials\VideoContent.jsx

import React, { useState, useRef } from "react";
import { Card, Button, Progress } from "antd";
import { Play, CheckCircle2 } from "lucide-react";

export default function VideoContent({
  title,
  completed: initialCompleted = false,
  videoUrl,
  onMarkAsComplete,
onMarkAsNotComplete,
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);

    // Mark as completed if watched 95%+
    if (percent >= 95 && !completed) {
			setCompleted(true);
			console.log('🎉 User watched the video completely');

			// Trigger backend update
			if (onMarkAsComplete) onMarkAsComplete();
		}
  };

  const handleVideoEnd = () => {
    setCompleted(true);
    setProgress(100);
    console.log("✅ Video ended – user watched it all");
	if (onMarkAsComplete) onMarkAsComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            {videoUrl ? (
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

        {/* Progress Bar */}
        <Progress
          percent={Math.round(progress)}
          status={completed ? "success" : "active"}
        />

        {/* Completion Status */}
        <div className="flex items-center justify-between mt-3">
          {completed && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Completed</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
