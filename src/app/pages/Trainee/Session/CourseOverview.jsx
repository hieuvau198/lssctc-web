import React from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Clock, Award } from 'lucide-react';

export default function CourseOverview() {
	const { courseId } = useParams();

	// Mock course data
	const courseData = {
		title: 'Introduction to Truck Crane',
		description: 'Comprehensive training on truck-mounted crane operations, safety protocols, and best practices.',
		instructor: 'Dr. John Smith',
		duration: '4 hours 30 minutes',
		modules: 4,
		certificate: 'Certificate of Completion',
		objectives: [
			'Understand truck-mounted crane components and categories',
			'Learn safety protocols and operator responsibilities',
			'Master basic crane operating principles',
			'Identify and use proper tools and equipment',
			'Perform basic crane operations safely'
		],
		requirements: [
			'Basic understanding of construction equipment',
			'Completed safety orientation course',
			'Valid operator license (where applicable)'
		]
	};

	return (
		<div className="max-w-4xl mx-auto">
			{/* Course Header */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 mb-8">
				<h1 className="text-3xl font-bold mb-2">{courseData.title}</h1>
				<p className="text-blue-100 text-lg mb-4">{courseData.description}</p>
				<div className="flex flex-wrap gap-6 text-sm">
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4" />
						<span>{courseData.duration}</span>
					</div>
					<div className="flex items-center gap-2">
						<BookOpen className="w-4 h-4" />
						<span>{courseData.modules} Modules</span>
					</div>
					<div className="flex items-center gap-2">
						<Award className="w-4 h-4" />
						<span>{courseData.certificate}</span>
					</div>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{/* Learning Objectives */}
				<div className="bg-white border border-slate-200 rounded-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 mb-4">Learning Objectives</h2>
					<ul className="space-y-3">
						{courseData.objectives.map((objective, index) => (
							<li key={index} className="flex items-start gap-3">
								<div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
									{index + 1}
								</div>
								<span className="text-slate-700">{objective}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Prerequisites */}
				<div className="bg-white border border-slate-200 rounded-lg p-6">
					<h2 className="text-xl font-semibold text-slate-900 mb-4">Prerequisites</h2>
					<ul className="space-y-3">
						{courseData.requirements.map((requirement, index) => (
							<li key={index} className="flex items-start gap-3">
								<div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0 mt-2"></div>
								<span className="text-slate-700">{requirement}</span>
							</li>
						))}
					</ul>
					<div className="mt-6 pt-4 border-t border-slate-200">
						<p className="text-sm text-slate-600">
							<strong>Instructor:</strong> {courseData.instructor}
						</p>
					</div>
				</div>
			</div>

			{/* Getting Started */}
			<div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-slate-900 mb-4">Getting Started</h2>
				<p className="text-slate-700 mb-4">
					Welcome to the truck crane training course. To begin your learning journey, select a module from the sidebar navigation. 
					Each module contains videos, reading materials, practice exercises, and quizzes to test your understanding.
				</p>
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<p className="text-blue-800 text-sm">
						<strong>Tip:</strong> Complete modules in order for the best learning experience. 
						Green checkmarks indicate completed sections.
					</p>
				</div>
			</div>
		</div>
	);
}