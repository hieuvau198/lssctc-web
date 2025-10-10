// src/app/pages/Trainee/Learn/CourseSection.jsx

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SectionLayout from '../../../layouts/SectionLayout/SectionLayout';
import {
	getLearningSectionsByClassIdAndTraineeId,
	getLearningPartitionsBySectionIdAndTraineeId,
} from '../../../apis/Trainee/TraineeLearningApi';

export default function CourseSection() {
	const { courseId } = useParams(); // courseId == classId in your API
	const classId = courseId;
	const traineeId = 1; // Hardcoded trainee ID
	const courseTitle = 'Back to Course';

	const [sections, setSections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch sections and their partitions
	useEffect(() => {
		const fetchSectionsAndPartitions = async () => {
			try {
				setLoading(true);
				setError(null);

				const fetchedSections = await getLearningSectionsByClassIdAndTraineeId(classId, traineeId);

				const sectionsWithPartitions = await Promise.all(
					fetchedSections.map(async (section) => {
						const partitions = await getLearningPartitionsBySectionIdAndTraineeId(section.sectionId, traineeId);
						return { ...section, partitions };
					})
				);

				setSections(sectionsWithPartitions);
			} catch (err) {
				console.error('Error fetching sections/partitions:', err);
				setError('Failed to load learning sections.');
			} finally {
				setLoading(false);
			}
		};

		fetchSectionsAndPartitions();
	}, [classId]);

	// Flatten all sections + partitions for SectionLayout
	const allItems = useMemo(() => {
		const items = [];
		sections.forEach((section) => {
			// Add section header
			items.push({
				id: section.sectionId,
				type: 'section',
				title: section.sectionName,
				duration: `${section.durationMinutes ?? 0} min`,
				isCompleted: section.isCompleted,
				isHeader: true,
			});

			// Add partitions
			section.partitions?.forEach((partition) => {
				items.push({
					id: partition.sectionPartitionId,
					type: partition.partitionType || 'content',
					title: partition.partitionName,
					duration: partition.partitionDescription || '', // Or use actual duration if available
					isCompleted: partition.isCompleted,
					sectionId: section.sectionId,
					href: `/learn/${classId}/${section.sectionId}/${partition.sectionPartitionId}`,
				});
			});
		});
		return items;
	}, [sections, classId]);

	const handleSelectItem = (item) => {
		console.log('Selected item:', item);
	};

	return (
		<SectionLayout
			items={allItems}
			onSelectItem={handleSelectItem}
			itemsLoading={loading}
			error={error}
			courseTitle={courseTitle}
		/>
	);
}
