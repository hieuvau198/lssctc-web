// src\app\pages\Trainee\Learn\partials\VideoContent.jsx

import React, { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Button, Tag } from "antd";
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
        <div className="space-y-4">
            {/* Session Warning Banner */}
            {sessionStatus && !isSessionOpen && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-400">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                        <span className="font-bold text-yellow-800 block text-sm uppercase tracking-wide">
                            {sessionStatus.message === "Not started yet"
                                ? t('trainee.learn.sessionNotStarted')
                                : t('trainee.learn.sessionExpired')}
                        </span>
                        <span className="text-xs text-yellow-700">
                            {sessionStatus.startTime && `Start: ${dayjs(sessionStatus.startTime).format('DD/MM/YYYY HH:mm')}`}
                            {sessionStatus.endTime && ` - End: ${dayjs(sessionStatus.endTime).format('DD/MM/YYYY HH:mm')}`}
                        </span>
                    </div>
                </div>
            )}

            {/* Main Card - Light Wire Theme */}
            <div className="bg-white border-2 border-black overflow-hidden">
                {/* Yellow accent bar */}
                <div className="h-0.5 bg-yellow-400" />

                {/* Header */}
                <div className="px-6 py-4 border-b-2 border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-yellow-400">
                            <Video className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black">
                                    {t('trainee.learn.video', 'Video')}
                                </span>
                                {completed && (
                                    <span className="px-3 py-1 bg-black text-yellow-400 font-bold text-xs uppercase tracking-wider border-2 border-black">
                                        {t('trainee.learn.completed', 'Completed')}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-lg font-black text-black uppercase tracking-tight">{title}</h1>
                        </div>
                    </div>

                    {/* Status */}
                    {completed ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black border-2 border-black">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase">{t('trainee.learn.completed', 'Completed')}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-neutral-500">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm font-medium">{t('trainee.learn.inProgress', 'Đang học')}</span>
                        </div>
                    )}
                </div>

                {/* Video Player */}
                <div className="p-6">
                    <div className="aspect-video bg-black border-2 border-black overflow-hidden min-h-[50vh]">
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
                            <div className="h-full w-full flex items-center justify-center text-white bg-neutral-900">
                                <div className="text-center">
                                    <div className="w-20 h-20 border-2 border-yellow-400 flex items-center justify-center mx-auto mb-4">
                                        <Play className="w-10 h-10 text-yellow-400" />
                                    </div>
                                    <p className="text-lg font-bold uppercase">{title}</p>
                                    <p className="text-neutral-400 text-sm">{t('trainee.learn.noVideoUrl', 'No video available')}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar - only show for native videos */}
                    {!isYouTube && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
                                <span className="uppercase font-bold tracking-wider">{t('trainee.learn.watchProgress', 'Watch Progress')}</span>
                                <span className="font-bold text-black">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 border-2 border-black bg-white">
                                <div
                                    className={`h-full transition-all duration-300 ${completed ? 'bg-yellow-400' : 'bg-yellow-400'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Manual mark button for YouTube */}
                    {isYouTube && !completed && (
                        <div className="mt-4 text-right">
                            <button
                                onClick={handleManualMarkComplete}
                                className="px-6 py-3 bg-yellow-400 text-black font-bold text-sm uppercase tracking-wider border-2 border-black hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
                            >
                                {t('trainee.learn.markComplete', 'Mark as Complete')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
