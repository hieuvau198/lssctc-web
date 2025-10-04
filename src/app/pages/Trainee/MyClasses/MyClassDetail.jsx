import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageNav from '../../../components/PageNav/PageNav';
import ClassHeader from './partials/ClassHeader';
import CourseOverview from './partials/CourseOverview';
import CourseModules from './partials/CourseModules';
import InstructorInfo from './partials/InstructorInfo';
import ClassSchedule from './partials/ClassSchedule';

export default function MyClassDetail() {
	const { id } = useParams();

	// Mock data để demo - trong thực tế sẽ fetch theo ID
	const mockClasses = useMemo(() => [
		{
			id: 101,
			provider: 'Global Crane Academy',
			name: 'Seaport Crane Operations Fundamentals',
			progress: 22,
			badge: 'Foundational',
			color: 'from-cyan-500 to-blue-600',
			startDate: 'Sep 1, 2025',
			endDate: 'Nov 30, 2025'
		},
		{
			id: 102,
			provider: 'Logistics Institute',
			name: 'Container Yard Workflow & Optimization',
			progress: 48,
			badge: 'Applied',
			color: 'from-violet-500 to-indigo-600',
			startDate: 'Oct 1, 2025',
			endDate: 'Dec 15, 2025'
		},
		{
			id: 103,
			provider: 'Global Crane Academy',
			name: 'Advanced Load Balancing & Swing Control',
			progress: 73,
			badge: 'Advanced',
			color: 'from-amber-500 to-orange-600',
			startDate: 'Aug 15, 2025',
			endDate: 'Oct 30, 2025'
		}
	], []);

	// Tìm class theo ID
	const classData = useMemo(() => {
		return mockClasses.find(cls => cls.id === parseInt(id));
	}, [mockClasses, id]);

	if (!classData) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<PageNav nameMap={{ 'my-classes': 'My Classes' }} />
				<div className="mt-2">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-slate-900 mb-4">Class Not Found</h1>
						<p className="text-slate-600">The class you're looking for doesn't exist.</p>
					</div>
				</div>
			</div>
		);
	}

	// Mock instructor data
	const mockInstructor = {
		id: 1,
		name: 'John Smith',
		email: 'john.smith@lssctc.edu',
		phone: '+84 123 456 789',
		specialization: 'Mobile Crane Operations',
		yearsOfExperience: 15,
		certifications: ['Certified Crane Operator', 'Safety Training Specialist', 'OSHA 30-Hour']
	};

	// Mock courses in this class with learner's progress
	const mockClassCourses = [
		{
			id: 1,
			name: 'Mobile Crane Operations – Level 1 (Beginner)',
			code: 'MCO-L1-001',
			description: 'Introduction to mobile crane operations with safety focus',
			progress: 85,
			status: 'in-progress',
			duration: 48,
			price: 5000000,
			startDate: '2025-09-01',
			endDate: '2025-11-30',
			instructor: 'John Smith',
			category: 'Mobile Crane'
		},
		{
			id: 2,
			name: 'Safety Protocols and Risk Management',
			code: 'SPR-L1-002',
			description: 'Comprehensive safety training for crane operations',
			progress: 100,
			status: 'completed',
			duration: 24,
			price: 3000000,
			startDate: '2025-08-15',
			endDate: '2025-09-15',
			instructor: 'John Smith',
			category: 'Safety Training'
		},
		{
			id: 3,
			name: 'Load Calculation and Chart Reading',
			code: 'LCC-L2-003',
			description: 'Advanced load calculation techniques and chart interpretation',
			progress: 45,
			status: 'in-progress',
			duration: 36,
			price: 4200000,
			startDate: '2025-10-01',
			endDate: '2025-12-15',
			instructor: 'Sarah Johnson',
			category: 'Technical Skills'
		},
		{
			id: 4,
			name: 'Equipment Maintenance and Inspection',
			code: 'EMI-L1-004',
			description: 'Preventive maintenance and daily inspection procedures',
			progress: 0,
			status: 'not-started',
			duration: 30,
			price: 3500000,
			startDate: '2025-11-01',
			endDate: '2025-12-30',
			instructor: 'Mike Wilson',
			category: 'Maintenance'
		}
	];

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<PageNav nameMap={{ 'my-classes': 'My Classes', [id]: classData.name }} />
			<div className="mt-2">
				{/* Class Header */}
				<ClassHeader classData={classData} />

			{/* Course Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-8">
					<CourseOverview />
					<CourseModules mockClassCourses={mockClassCourses} />
				</div>

				{/* Sidebar */}
				<div className="space-y-8">
					<InstructorInfo mockInstructor={mockInstructor} />
					<ClassSchedule classData={classData} />
				</div>
			</div>
			</div>
		</div>
	);
}