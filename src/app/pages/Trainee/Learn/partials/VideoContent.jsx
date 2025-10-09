import React from 'react';
import { Card, Button, Progress } from 'antd';
import { Play, CheckCircle2, Clock } from 'lucide-react';

export default function VideoContent({ title, completed = false, videoUrl }) {
	return (
		<div className="max-w-4xl mx-auto">
			<Card className="mb-6">
				<div className="mb-4">
					<div className="flex items-center gap-2 mb-3">
						<h1 className="text-2xl font-bold text-slate-900">{title}</h1>
					</div>
					<div className="aspect-video bg-black rounded-lg overflow-hidden">
						{videoUrl ? (
							<video src={videoUrl} controls className="w-full h-full" preload="metadata">
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
				
				<div className="flex items-center justify-between">
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