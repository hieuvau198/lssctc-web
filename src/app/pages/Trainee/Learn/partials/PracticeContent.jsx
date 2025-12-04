// src/app/pages/Trainee/Learn/partials/PracticeContent.jsx

import React from 'react';
import { Button, Progress, Tag } from 'antd';
import { Settings, CheckCircle2, Clock, Play, ListTodo, ChevronsRight, Monitor, Download, LogIn, MousePointer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PracticeContent({ 
	title, 
	duration, 
	completed = false, 
	description, 
	tasks = [] 
}) {
	const navigate = useNavigate();

	const completedTasks = tasks.filter(t => t.isPass).length;
	const avgScore = tasks.length > 0 
		? Math.round(tasks.reduce((acc, t) => acc + (t.score || 0), 0) / tasks.length)
		: 0;

	return (
		<div className="space-y-6">
			{/* Header Card */}
			<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
				<div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-amber-50">
					<div className="flex items-start justify-between gap-4">
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-200">
								<Settings className="w-6 h-6 text-white" />
							</div>
							<div>
								<div className="flex items-center gap-2 mb-1">
									<Tag color="orange" className="text-xs font-medium">Practice</Tag>
									{completed && (
										<Tag color="success" className="text-xs font-medium">Completed</Tag>
									)}
								</div>
								<h1 className="text-xl font-bold text-slate-900">{title}</h1>
								{description && (
									<p className="text-slate-600 mt-1">{description}</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Practice Info */}
				<div className="p-6">
					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
						<div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
									<Clock className="w-5 h-5 text-slate-600" />
								</div>
								<div>
									<div className="text-sm text-slate-500">Practice Time</div>
									<div className="text-lg font-bold text-slate-900">{duration || 'Flexible'}</div>
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
									<Monitor className="w-5 h-5 text-orange-600" />
								</div>
								<div>
									<div className="text-sm text-slate-500">Type</div>
									<div className="text-lg font-bold text-slate-900">Simulator</div>
								</div>
							</div>
						</div>
					</div>

					{/* Practice Tasks */}
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
						<h3 className="text-base font-semibold text-blue-900 mb-4 flex items-center gap-2">
							<ListTodo className="w-5 h-5" />
							Practice Tasks ({tasks.length})
						</h3>
						{tasks.length > 0 ? (
							<ul className="space-y-3">
								{tasks.map((task, index) => (
									<li key={task.taskId || index} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-100">
										<div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
											task.isPass 
												? 'bg-green-100 text-green-600' 
												: 'bg-slate-100 text-slate-400'
										}`}>
											{task.isPass ? (
												<CheckCircle2 className="w-4 h-4" />
											) : (
												<span className="text-xs font-bold">{index + 1}</span>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-slate-900">{task.taskName || 'Unnamed Task'}</div>
											{task.taskDescription && (
												<div className="text-sm text-slate-600 mt-0.5">{task.taskDescription}</div>
											)}
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="text-slate-600 text-sm">No specific tasks listed for this practice.</p>
						)}
					</div>

					{/* Instructions */}
					<div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
						<h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
							<ChevronsRight className="w-5 h-5" />
							How to Complete
						</h3>
						<ol className="space-y-3">
							{[
								{ icon: <Play className="w-4 h-4" />, text: 'Click "Start Practice" to go to the simulator page' },
								{ icon: <Download className="w-4 h-4" />, text: 'Download the simulator application' },
								{ icon: <MousePointer className="w-4 h-4" />, text: 'Open the downloaded .exe file to run the simulator' },
								{ icon: <LogIn className="w-4 h-4" />, text: 'Log in with the same account as the website' },
								{ icon: <ListTodo className="w-4 h-4" />, text: 'Select your class and the correct practice' },
								{ icon: <CheckCircle2 className="w-4 h-4" />, text: 'Follow the in-simulator guide to complete tasks' },
							].map((step, i) => (
								<li key={i} className="flex items-start gap-3">
									<div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
										{step.icon}
									</div>
									<span className="text-slate-700 pt-1">{step.text}</span>
								</li>
							))}
						</ol>
					</div>

					{/* Action Button */}
					<div className="text-center">
						<Button 
							type="primary" 
							size="large"
							icon={<Play className="w-4 h-4" />}
							className="px-8 shadow-lg shadow-orange-200"
							onClick={() => navigate('/simulator')}
						>
							{completed ? 'Practice Again' : 'Start Practice'}
						</Button>
					</div>
				</div>
			</div>

			{/* Summary Card - Only show when completed */}
			{completed && (
				<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
					<div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50">
						<h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
							<CheckCircle2 className="w-5 h-5 text-green-600" />
							Practice Summary
						</h3>
					</div>
					<div className="p-6">
						<Progress 
							percent={100} 
							status="success"
							strokeColor={{ from: '#10b981', to: '#059669' }}
							className="mb-6"
						/>
						<div className="grid grid-cols-2 gap-6">
							<div className="bg-slate-50 rounded-xl p-4 text-center">
								<div className="text-sm text-slate-500 mb-1">Tasks Completed</div>
								<div className="text-2xl font-bold text-slate-900">
									{completedTasks} / {tasks.length}
								</div>
							</div>
							<div className="bg-green-50 rounded-xl p-4 text-center">
								<div className="text-sm text-slate-500 mb-1">Average Score</div>
								<div className="text-2xl font-bold text-green-600">
									{avgScore}%
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}