import React from 'react';
import { Card, Progress } from 'antd';
import { BookOpen, Clock, Users } from 'lucide-react';

export default function ClassHeader({ classData }) {
	if (!classData) return null;

	return (
		<Card className="rounded-2xl border border-slate-900 overflow-hidden relative mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
			<div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-80 from-transparent via-slate-200 to-transparent" />
			<div className="flex">
				<div className="flex-1">
					<div className="flex items-start gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 flex-wrap mb-2">
								<div className="text-sm text-slate-500">{"LSSCTC"}</div>
								{classData.badge && (
									<span className="text-xs uppercase tracking-wide font-semibold bg-slate-900 text-white px-2 py-1 rounded-full">
										{classData.badge}
									</span>
								)}
							</div>
							<h1 className="text-2xl font-bold text-slate-900 leading-tight mb-3">
								{classData.name}
							</h1>
							<div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
								<div className="flex items-center gap-2">
									<BookOpen className="w-4 h-4" />
									<span>{classData.progress}% complete</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4" />
									<span>25 students</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									<span>8 weeks</span>
								</div>
							</div>
							<Progress
								percent={classData.progress}
								showInfo={false}
								strokeColor="#0f766e"
								trailColor="#e2e8f0"
								strokeWidth={8}
							/>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}