import React from 'react';
import { useParams } from 'react-router-dom';
import VideoContent from './partials/VideoContent';
import ReadingContent from './partials/ReadingContent';
import QuizDescription from './partials/QuizDescription';
import PracticeContent from './partials/PracticeContent';
import { getPartitionData } from '../../../mock/lessonPartitions';

export default function LearnContent() {
	const { courseId, sectionId, partitionId } = useParams();

	// Lookup from mock store
	const partitionData = getPartitionData(courseId, partitionId);

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
						videoUrl={partitionData.videoUrl}
					/>
				);
			case 'reading':
				return (
					<ReadingContent
						title={partitionData.title}
						duration={partitionData.duration}
						completed={partitionData.completed}
						contentHtml={partitionData.contentHtml}
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
						description={partitionData.description}
					/>
				);
			case 'practice':
				return (
					<PracticeContent
						title={partitionData.title}
						duration={partitionData.duration}
						completed={partitionData.completed}
						description={partitionData.description}
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