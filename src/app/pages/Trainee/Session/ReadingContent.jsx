import React from 'react';
import { Card, Button, Progress } from 'antd';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

export default function ReadingContent({ title, duration, completed = false, contentHtml }) {
	return (
		<div className="max-w-4xl mx-auto">
			<Card className="mb-6">
				<div className="mb-4">
					<div className="flex items-center gap-2 mb-4">
						<BookOpen className="w-5 h-5 text-blue-600" />
						<h1 className="text-2xl font-bold text-slate-900">{title}</h1>
					</div>
					
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-slate-500" />
							<span className="text-sm text-slate-600">Reading time: {duration}</span>
						</div>
						
						{completed && (
							<div className="flex items-center gap-2 text-green-600">
								<CheckCircle2 className="w-4 h-4" />
								<span className="text-sm">Completed</span>
							</div>
						)}
					</div>
				</div>
				
				<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml || '' }} />
				
				{!completed && (
					<div className="mt-6 pt-6 border-t">
						<Button type="primary" size="large">
							Mark as Complete
						</Button>
					</div>
				)}
			</Card>
			
			{completed && (
				<Card title="Reading Progress">
					<Progress percent={100} status="success" />
					<p className="text-sm text-slate-600 mt-2">
						You have completed this reading material.
					</p>
				</Card>
			)}
		</div>
	);
}