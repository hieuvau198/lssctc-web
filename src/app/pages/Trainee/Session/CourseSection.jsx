import React, { useMemo } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import SectionLayout from '../../../layouts/SectionLayout/SessionLayout';

export default function CourseSection() {
	const { courseId, sectionId } = useParams();

	// Mock data for course sections
	const mockSections = useMemo(() => [
		{
			id: 'truck-crane-overview',
			type: 'section',
			title: 'Truck-mounted Crane Overview',
			duration: '45 min',
			completed: false,
			partitions: [
				{
					id: 'crane-categories',
					type: 'video',
					title: 'Crane Categories and Types',
					duration: '15 min',
					completed: true
				},
				{
					id: 'what-is-truck-crane',
					type: 'video', 
					title: 'What is a Truck-mounted Crane?',
					duration: '12 min',
					completed: true
				},
				{
					id: 'test-truck-crane-overview',
					type: 'quiz',
					title: 'Test: Truck-mounted Crane Overview',
					duration: '10 min',
					completed: false
				}
			]
		},
		{
			id: 'basic-principles',
			type: 'section',
			title: 'Basic Principles',
			duration: '60 min',
			completed: false,
			partitions: [
				{
					id: 'duties-operator',
					type: 'video',
					title: 'Duties of the Operator',
					duration: '20 min',
					completed: false
				},
				{
					id: 'crane-safety',
					type: 'reading',
					title: 'Crane Operating Safety',
					duration: '25 min',
					completed: false
				}
			]
		},
		{
			id: 'tools-equipment',
			type: 'section',
			title: 'Tools & Equipment',
			duration: '90 min',
			completed: false,
			partitions: [
				{
					id: 'key-components',
					type: 'reading',
					title: 'Key Components',
					duration: '30 min',
					completed: false
				},
				{
					id: 'equipment-inspection',
					type: 'reading',
					title: 'Equipment Inspection',
					duration: '25 min',
					completed: false
				},
				{
					id: 'practice-identifying',
					type: 'practice',
					title: 'Practice: Identifying Components',
					duration: '20 min',
					completed: false
				},
				{
					id: 'test-tools-equipment',
					type: 'quiz',
					title: 'Test: Tools & Equipment',
					duration: '15 min',
					completed: false
				}
			]
		},
		{
			id: 'basic-operations',
			type: 'section',
			title: 'Basic Operations',
			duration: '75 min',
			completed: false,
			partitions: [
				{
					id: 'operating-levers',
					type: 'video',
					title: 'Operating Crane Levers',
					duration: '18 min',
					completed: false
				},
				{
					id: 'operators-manual',
					type: 'reading',
					title: "Operator's Manual",
					duration: '30 min',
					completed: false
				},
				{
					id: 'practice-levers',
					type: 'practice',
					title: 'Practice: Operating Levers',
					duration: '15 min',
					completed: false
				},
				{
					id: 'test-basic-operations',
					type: 'quiz',
					title: 'Test: Basic Operations',
					duration: '12 min',
					completed: false
				}
			]
		}
	], []);

	// Flatten all partitions for SectionLayout
	const allItems = useMemo(() => {
		const items = [];
		mockSections.forEach(section => {
			// Add section header
			items.push({
				...section,
				isHeader: true,
				type: 'section'
			});
			// Add all partitions with section reference
			section.partitions.forEach(partition => {
				items.push({
					...partition,
					sectionId: section.id,
					href: `/learn/${courseId}/${section.id}/${partition.id}`
				});
			});
		});
		return items;
	}, [mockSections, courseId]);

	const handleSelectItem = (item) => {
		console.log('Selected item:', item);
	};

	return (
		<SectionLayout
			items={allItems}
			onSelectItem={handleSelectItem}
			itemsLoading={false}
			error={null}
		/>
	);
}