// src\app\pages\Trainee\MyClasses\partials\Sections.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Progress } from 'antd';
import { Clock, DollarSign, User, Award } from 'lucide-react';
import { getFirstPartitionPath } from '../../../../mock/lessonPartitions';

export default function Sections({ sections }) {
	if(!sections || sections.length === 0) 
	{
		return (
			<Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
				<div className="text-center text-slate-500 py-10">
					No sections available at the moment.
				</div>
			</Card>
		);
	}
	
	return (
		<Card  className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
			<div className="space-y-5">
				{sections.map((section) => {
					const deepLink = getFirstPartitionPath(section.sectionId) || `/learn/${section.sectionId}`;
					return (
					<Link key={section.sectionId} to={deepLink} className="block">
						<div className="flex items-start justify-between p-5 border border-slate-200 rounded-lg bg-slate-50/30 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
							<div className="flex-1">
							<div className="flex items-start gap-3">
								<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xs font-semibold">
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<h4 className="font-semibold text-slate-900 text-base">{section.sectionName}</h4>
										<Tag color={
											section.isCompleted === true ? 'green' :
												section.isCompleted === false ? 'blue' :
													'default'
										}>
											{section.sectionRecordStatus}
										</Tag>
									</div>
									<p className="text-sm text-slate-600 mb-3 line-clamp-2">{section.sectionDescription}</p>

									<div className="grid grid-cols-2 gap-4 mb-3 text-xs text-slate-500">
										<div className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											<span>{section.durationMinutes} mins</span>
										</div>
										<div className="flex items-center gap-1">
											<User className="w-3 h-3" />
											<span>"course.instructor"</span>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="text-slate-600">Progress</span>
											<span className="font-medium text-slate-900">{section.sectionProgress * 100}%</span>
										</div>
										<Progress
											percent={section.sectionProgress * 100}
											showInfo={false}
											size="small"
											strokeColor={section.isCompleted === true ? '#10b981' : '#0f766e'}
											trailColor="#e2e8f0"
										/>
									</div>
								</div>
							</div>
						</div>
						</div>
					</Link>
					);
				})}
			</div>
		</Card>
	);
}