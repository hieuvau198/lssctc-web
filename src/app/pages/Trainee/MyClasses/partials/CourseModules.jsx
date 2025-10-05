import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Tag, Progress } from 'antd';
import { Clock, DollarSign, User, Award } from 'lucide-react';
import { getFirstPartitionPath } from '../../../../mock/lessonPartitions';

export default function CourseModules({ mockClassCourses }) {
	return (
		<Card title="Course Modules" className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
			{/* Course Summary - moved to top */}
			<div className="grid grid-cols-4 gap-4 text-center mb-6 pb-4 border-b border-slate-200">
				<div className="space-y-1">
					<div className="text-lg font-semibold text-slate-900">{mockClassCourses.length}</div>
					<div className="text-xs text-slate-500">Total Courses</div>
				</div>
				<div className="space-y-1">
					<div className="text-lg font-semibold text-green-600">
						{mockClassCourses.filter(c => c.status === 'completed').length}
					</div>
					<div className="text-xs text-slate-500">Completed</div>
				</div>
				<div className="space-y-1">
					<div className="text-lg font-semibold text-blue-600">
						{mockClassCourses.filter(c => c.status === 'in-progress').length}
					</div>
					<div className="text-xs text-slate-500">In Progress</div>
				</div>
				<div className="space-y-1">
					<div className="text-lg font-semibold text-slate-600">
						{Math.round(mockClassCourses.reduce((acc, course) => acc + course.progress, 0) / mockClassCourses.length)}%
					</div>
					<div className="text-xs text-slate-500">Avg Progress</div>
				</div>
			</div>

			<div className="space-y-5">
				{mockClassCourses.map((course, index) => {
					const deepLink = getFirstPartitionPath(course.id) || `/learn/${course.id}`;
					return (
					<Link key={course.id} to={deepLink} className="block">
						<div className="flex items-start justify-between p-5 border border-slate-200 rounded-lg bg-slate-50/30 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
							<div className="flex-1">
							<div className="flex items-start gap-3">
								<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xs font-semibold">
									{course.code.split('-')[0]}
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<h4 className="font-semibold text-slate-900 text-base">{course.name}</h4>
										<Tag color={
											course.status === 'completed' ? 'green' :
												course.status === 'in-progress' ? 'blue' :
													'default'
										}>
											{course.status === 'completed' ? 'Completed' :
												course.status === 'in-progress' ? 'In Progress' :
													'Not Started'}
										</Tag>
									</div>
									<p className="text-sm text-slate-600 mb-3 line-clamp-2">{course.description}</p>

									<div className="grid grid-cols-2 gap-4 mb-3 text-xs text-slate-500">
										<div className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											<span>{course.duration}h</span>
										</div>
										<div className="flex items-center gap-1">
											<DollarSign className="w-3 h-3" />
											<span>{course.price.toLocaleString('vi-VN')} VND</span>
										</div>
										<div className="flex items-center gap-1">
											<User className="w-3 h-3" />
											<span>{course.instructor}</span>
										</div>
										<div className="flex items-center gap-1">
											<Award className="w-3 h-3" />
											<span>{course.category}</span>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="text-slate-600">Progress</span>
											<span className="font-medium text-slate-900">{course.progress}%</span>
										</div>
										<Progress
											percent={course.progress}
											showInfo={false}
											size="small"
											strokeColor={course.status === 'completed' ? '#10b981' : '#0f766e'}
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