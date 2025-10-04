import React from 'react';
import { useParams } from 'react-router-dom';
import VideoContent from './VideoContent';
import ReadingContent from './ReadingContent';
import QuizDescription from './QuizDescription';
import PracticeContent from './PracticeContent';

export default function LessonContent() {
	const { courseId, sectionId, partitionId } = useParams();

	// Mock data để map với partition
	const getPartitionData = () => {
		const partitionMap = {
			'crane-categories': {
				type: 'video',
				title: 'Crane Categories and Types',
				duration: '15 min',
				completed: true
			},
			'what-is-truck-crane': {
				type: 'video',
				title: 'What is a Truck-mounted Crane?',
				duration: '12 min',
				completed: true
			},
			'test-truck-crane-overview': {
				type: 'quiz',
				title: 'Test: Truck-mounted Crane Overview',
				duration: '10 min',
				completed: false,
				questionCount: 8,
				passingScore: 80
			},
			'duties-operator': {
				type: 'video',
				title: 'Duties of the Operator',
				duration: '20 min',
				completed: false
			},
			'crane-safety': {
				type: 'reading',
				title: 'Crane Operating Safety',
				duration: '25 min',
				completed: false
			},
			'key-components': {
				type: 'reading',
				title: 'Key Components',
				duration: '30 min',
				completed: false
			},
			'equipment-inspection': {
				type: 'reading',
				title: 'Equipment Inspection',
				duration: '25 min',
				completed: false
			},
			'practice-identifying': {
				type: 'practice',
				title: 'Practice: Identifying Components',
				duration: '20 min',
				completed: false
			},
			'test-tools-equipment': {
				type: 'quiz',
				title: 'Test: Tools & Equipment',
				duration: '15 min',
				completed: false,
				questionCount: 12,
				passingScore: 75
			},
			'operating-levers': {
				type: 'video',
				title: 'Operating Crane Levers',
				duration: '18 min',
				completed: false
			},
			'operators-manual': {
				type: 'reading',
				title: "Operator's Manual",
				duration: '30 min',
				completed: false
			},
			'practice-levers': {
				type: 'practice',
				title: 'Practice: Operating Levers',
				duration: '15 min',
				completed: false
			},
			'test-basic-operations': {
				type: 'quiz',
				title: 'Test: Basic Operations',
				duration: '12 min',
				completed: false,
				questionCount: 10,
				passingScore: 80
			}
		};

		return partitionMap[partitionId] || null;
	};

	const partitionData = getPartitionData();

	if (!partitionData) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold text-slate-900 mb-2">Content Not Found</h2>
				<p className="text-slate-600">The requested lesson content could not be found.</p>
			</div>
		);
	}

	const renderContent = () => {
		switch (partitionData.type) {
			case 'video':
				return (
					<VideoContent
						title={partitionData.title}
						duration={partitionData.duration}
						completed={partitionData.completed}
					/>
				);
			case 'reading':
				return (
					<ReadingContent
						title={partitionData.title}
						duration={partitionData.duration}
						completed={partitionData.completed}
					/>
				);
			case 'quiz':
				return (
					<QuizDescription
						title={partitionData.title}
						duration={partitionData.duration}
						completed={partitionData.completed}
						questionCount={partitionData.questionCount}
						passingScore={partitionData.passingScore}
					/>
				);
			case 'practice':
				return (
					<PracticeContent
						title={partitionData.title}
						duration={partitionData.duration}
						completed={partitionData.completed}
					/>
				);
			default:
				return (
					<div className="text-center py-12">
						<h2 className="text-xl font-semibold text-slate-900 mb-2">Unknown Content Type</h2>
						<p className="text-slate-600">This content type is not supported yet.</p>
					</div>
				);
		}
	};

	return renderContent();
}