import React from 'react';
import { Card, Button, Progress } from 'antd';
import { Settings, CheckCircle2, Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PracticeContent({ title, duration, completed = false, description }) {
	const navigate = useNavigate();
	return (
		<div className="max-w-4xl mx-auto">
			<Card className="mb-6">
				<div className="text-center mb-6">
					<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Settings className="w-8 h-8 text-orange-600" />
					</div>
					<h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
					<p className="text-slate-600">{description || 'Interactive practice session to reinforce your learning'}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">{duration}</div>
						<div className="text-sm text-slate-600">Practice Time</div>
					</div>
					
					<div className="text-center p-4 bg-slate-50 rounded-lg">
						<Settings className="w-6 h-6 text-slate-600 mx-auto mb-2" />
						<div className="text-lg font-semibold text-slate-900">Interactive</div>
						<div className="text-sm text-slate-600">Hands-on Practice</div>
					</div>
				</div>

				<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
					<h3 className="text-lg font-semibold text-amber-800 mb-2">Practice Objectives</h3>
					<ul className="space-y-2 text-amber-700">
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-amber-600 rounded-full"></div>
							Identify different crane components visually
						</li>
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-amber-600 rounded-full"></div>
							Understand component functions and relationships
						</li>
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-amber-600 rounded-full"></div>
							Practice safety inspection procedures
						</li>
						<li className="flex items-center gap-2">
							<div className="w-2 h-2 bg-amber-600 rounded-full"></div>
							Build confidence in component recognition
						</li>
					</ul>
				</div>

				{completed ? (
					<div className="text-center">
						<div className="flex items-center justify-center gap-2 text-green-600 mb-4">
							<CheckCircle2 className="w-5 h-5" />
							<span className="font-semibold">Practice Completed</span>
						</div>
						<Button 
							size="large" 
							icon={<Play className="w-4 h-4" />}
							onClick={() => navigate('/simulator')}
						>
							Practice Again
						</Button>
					</div>
				) : (
					<div className="text-center">
						<Button 
							type="primary" 
							size="large"
							icon={<Play className="w-4 h-4" />}
							className="px-8"
							onClick={() => navigate('/simulator')}
						>
							Start Practice
						</Button>
					</div>
				)}
			</Card>

			{completed && (
				<Card title="Practice Summary">
					<div className="space-y-4">
						<Progress 
							percent={100} 
							status="success"
							format={() => 'Completed'}
						/>
						<div className="grid grid-cols-2 gap-4 pt-4">
							<div>
								<div className="text-sm text-slate-600">Components Identified</div>
								<div className="text-xl font-semibold text-slate-900">12/12</div>
							</div>
							<div>
								<div className="text-sm text-slate-600">Accuracy</div>
								<div className="text-xl font-semibold text-green-600">95%</div>
							</div>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}