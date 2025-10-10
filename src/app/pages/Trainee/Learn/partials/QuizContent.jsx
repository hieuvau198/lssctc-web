// src/app/pages/Trainee/Learn/partials/QuizDescription.jsx

import React from 'react';
import { Card, Button, Alert } from 'antd';
import { FileText, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function QuizContent({ sectionQuiz }) {
	if (!sectionQuiz) {
		return (
			<div className="max-w-4xl mx-auto p-8 text-center text-slate-500">
				No quiz data available.
			</div>
		);
	}

	// Destructure useful fields from the sectionQuiz prop
	const {
		quizName,
		description,
		isCompleted,
		passScoreCriteria,
		timelimitMinute,
		totalScore,
		lastAttemptScore,
		lastAttemptIsPass,
		lastAttemptDate,
	} = sectionQuiz;

	// Format date nicely if it exists
	const formattedDate = lastAttemptDate
		? new Date(lastAttemptDate).toLocaleString()
		: null;

	return (
		<div className="max-w-4xl mx-auto">
			<Card className="mb-6">
				<div className="text-center mb-6">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<HelpCircle className="w-8 h-8 text-blue-600" />
					</div>
					<h1 className="text-2xl font-bold text-slate-900 mb-2">{quizName}</h1>
					<p className="text-slate-600">
						{description || 'Test your knowledge with this quiz.'}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<FileText className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">{totalScore ?? '-'}</div>
						<div className="text-sm text-slate-600">Total Score</div>
					</div>

					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">
							{timelimitMinute ? `${timelimitMinute} mins` : 'No limit'}
						</div>
						<div className="text-sm text-slate-600">Time Limit</div>
					</div>

					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<CheckCircle2 className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">
							{passScoreCriteria ?? '-'}
						</div>
						<div className="text-sm text-slate-600">Pass Score</div>
					</div>
				</div>

				{isCompleted ? (
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

				<div className="flex gap-3">
					<Button
						type="primary"
						size="large"
						className="flex-1"
						href={`/quiz/${sectionQuiz.quizId}`}
					>
						{isCompleted ? 'Retake Quiz' : 'Start Quiz'}
					</Button>

					{isCompleted && (
						<Button size="large" className="px-8">
							View Results
						</Button>
					)}
				</div>
			</Card>

			{isCompleted && (
				<Card title="Previous Attempt">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<div className="text-sm text-slate-600">Score</div>
							<div
								className={`text-xl font-semibold ${
									lastAttemptIsPass ? 'text-green-600' : 'text-red-600'
								}`}
							>
								{lastAttemptScore != null ? `${lastAttemptScore}` : '-'}
							</div>
						</div>
						<div>
							<div className="text-sm text-slate-600">Completed On</div>
							<div className="text-sm font-medium">
								{formattedDate || 'N/A'}
							</div>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}
