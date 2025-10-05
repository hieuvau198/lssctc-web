import React from 'react';
import { Card, Button, Alert } from 'antd';
import { FileText, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function QuizDescription({ title, duration, completed = false, questionCount = 10, passingScore = 80, description }) {
	return (
		<div className="max-w-4xl mx-auto">
			<Card className="mb-6">
				<div className="text-center mb-6">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<HelpCircle className="w-8 h-8 text-blue-600" />
					</div>
					<h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
					<p className="text-slate-600">{description || 'Test your knowledge with this comprehensive quiz'}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<FileText className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">{questionCount}</div>
						<div className="text-sm text-slate-600">Questions</div>
					</div>
					
					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">{duration}</div>
						<div className="text-sm text-slate-600">Time Limit</div>
					</div>
					
					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<CheckCircle2 className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">{passingScore}%</div>
						<div className="text-sm text-slate-600">Passing Score</div>
					</div>
				</div>

				{completed ? (
					<Alert
						type="success"
						showIcon
						message="Quiz Completed"
						description="You have successfully completed this quiz. You can retake it to improve your score."
						className="mb-6"
					/>
				) : (
					<Alert
						type="info"
						showIcon
						message="Quiz Instructions"
						description="You will have a limited time to complete this quiz. Make sure you have a stable internet connection and enough time to finish."
						className="mb-6"
					/>
				)}

				<div className="space-y-3 mb-6">
					<h3 className="text-lg font-semibold text-slate-900">Quiz Topics</h3>
					<ul className="space-y-2 text-slate-700">
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
							Crane categories and classification systems
						</li>
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
							Basic truck-mounted crane components
						</li>
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
							Safety considerations and best practices
						</li>
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
							Operating principles and procedures
						</li>
					</ul>
				</div>

				<div className="flex gap-3">
					<Button 
						type="primary" 
						size="large"
						className="flex-1"
						href="/quiz/truck-crane-overview"
					>
						{completed ? 'Retake Quiz' : 'Start Quiz'}
					</Button>
					
					{completed && (
						<Button 
							size="large"
							className="px-8"
						>
							View Results
						</Button>
					)}
				</div>
			</Card>

			{completed && (
				<Card title="Previous Attempt">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<div className="text-sm text-slate-600">Score</div>
							<div className="text-xl font-semibold text-green-600">85%</div>
						</div>
						<div>
							<div className="text-sm text-slate-600">Completed On</div>
							<div className="text-sm font-medium">Oct 1, 2025 at 2:30 PM</div>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}