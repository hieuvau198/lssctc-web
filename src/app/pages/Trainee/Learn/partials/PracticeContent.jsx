// src/app/pages/Trainee/Learn/partials/PracticeContent.jsx

import React from 'react';
import { Card, Button, Progress } from 'antd';
import { Settings, CheckCircle2, Clock, Play, ListTodo, ChevronsRight } from 'lucide-react'; // <-- Import thêm icon
import { useNavigate } from 'react-router-dom';

// Thêm `tasks` vào props, mặc định là mảng rỗng
export default function PracticeContent({ 
	title, 
	duration, 
	completed = false, 
	description, 
	tasks = [] 
}) {
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

				{/* --- THAY THẾ "PRACTICE OBJECTIVES" BẰNG "PRACTICE TASKS" --- */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
						<ListTodo className="w-5 h-5" />
						Practice Tasks
					</h3>
					{tasks.length > 0 ? (
						<ul className="space-y-3 text-blue-900">
							{tasks.map((task, index) => (
								<li key={task.taskId || index} className="flex items-start gap-2.5">
									<div className="w-2 h-2 bg-blue-600 rounded-full mt-[7px] flex-shrink-0"></div>
									<div>
										<span className="font-semibold">{task.taskName || 'Unnamed Task'}</span>:
										<span className="ml-1 text-slate-700">{task.taskDescription || 'No description provided.'}</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="text-slate-600 text-sm">No specific tasks listed for this practice.</p>
					)}
				</div>
				{/* --- KẾT THÚC THAY THẾ --- */}


				{/* --- THÊM PHẦN HƯỚNG DẪN MỚI --- */}
				<div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
						<ChevronsRight className="w-5 h-5" />
						Practice Instruction
					</h3>
                    <ol className="list-decimal list-outside space-y-2 text-slate-700 pl-5">
                        <li>Click the "Start Practice" button below to go to the simulation page.</li>
                        <li>Download the simulator application.</li>
                        <li>Open the downloaded <code className="font-mono text-sm bg-slate-200 px-1 py-0.5 rounded">.exe</code> file to run the simulator.</li>
                        <li>Log in to the simulator using the same account as website.</li>
                        <li>Select your class and the correct practice you want to complete.</li>
                        <li>Follow the in-simulator guide to complete the tasks and submit your attempt.</li>
                        <li>Return to this page to see if your result was updated.</li>
                    </ol>
                </div>
				{/* --- KẾT THÚC PHẦN HƯỚNG DẪN MỚI --- */}


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
					{/* Giả sử bạn sẽ thêm logic hiển thị kết quả task ở đây sau */}
					<div className="space-y-4">
						<Progress 
							percent={100} 
							status="success"
							format={() => 'Completed'}
						/>
						<div className="grid grid-cols-2 gap-4 pt-4">
							<div>
								<div className="text-sm text-slate-600">Tasks Completed</div>
								<div className="text-xl font-semibold text-slate-900">
									{/* Ví dụ: đếm task hoàn thành */}
									{tasks.filter(t => t.isPass).length} / {tasks.length}
								</div>
							</div>
							<div>
								<div className="text-sm text-slate-600">Overall Score</div>
								<div className="text-xl font-semibold text-green-600">
									{/* Ví dụ: Lấy điểm trung bình */}
									{tasks.length > 0 ? 
										(tasks.reduce((acc, t) => acc + t.score, 0) / tasks.length).toFixed(0) 
										: 0
									}%
								</div>
							</div>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}