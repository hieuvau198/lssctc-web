// Mock dataset for course sections and partitions with rich fields
// courseId -> sections -> partitions

/**
 * Data shape
 * courseLessons[courseId] = {
 *   sections: [
 *     { id, title, partitions: [ { id, type, title, duration, completed, videoUrl?, contentHtml?, description?, questionCount?, passingScore? } ] }
 *   ]
 * }
 */
export const courseLessons = {
  '1': {
    sections: [
      {
        id: 'truck-crane-overview',
        title: 'Truck-mounted Crane Overview',
        partitions: [
          {
            id: 'crane-categories',
            type: 'video',
            title: 'Crane Categories and Types',
            duration: '15 min',
            completed: true,
            videoUrl: 'https://res.cloudinary.com/dz6yciqlp/video/upload/v1759764473/mov_bbb_cdziab.mp4'
          },
          {
            id: 'what-is-truck-crane',
            type: 'video',
            title: 'What is a Truck-mounted Crane?',
            duration: '12 min',
            completed: true,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
          },
          {
            id: 'test-truck-crane-overview',
            type: 'quiz',
            title: 'Test: Truck-mounted Crane Overview',
            duration: '10 min',
            completed: false,
            questionCount: 8,
            passingScore: 80,
            description: 'Quick assessment to verify your understanding of crane categories and basics.'
          }
        ]
      },
      {
        id: 'basic-principles',
        title: 'Basic Principles',
        partitions: [
          {
            id: 'duties-operator',
            type: 'video',
            title: 'Duties of the Operator',
            duration: '20 min',
            completed: false,
            videoUrl: 'https://www.w3schools.com/html/movie.mp4'
          },
          {
            id: 'crane-safety',
            type: 'reading',
            title: 'Crane Operating Safety',
            duration: '25 min',
            completed: false,
            contentHtml: `
              <h2>Introduction</h2>
              <p>This document covers essential safety protocols and operating procedures for crane operations.</p>
              <h3>Key Safety Considerations</h3>
              <ul>
                <li>Always perform pre-operation inspections</li>
                <li>Maintain proper communication with ground personnel</li>
                <li>Understand load weight limits and capacity charts</li>
                <li>Be aware of environmental conditions (wind, obstacles)</li>
                <li>Follow proper rigging procedures</li>
              </ul>
            `
          }
        ]
      },
      {
        id: 'tools-equipment',
        title: 'Tools & Equipment',
        partitions: [
          {
            id: 'key-components',
            type: 'reading',
            title: 'Key Components',
            duration: '30 min',
            completed: false,
            contentHtml: `
              <p>Learn the key components of cranes including boom, jib, counterweights and more.</p>
            `
          },
          {
            id: 'equipment-inspection',
            type: 'reading',
            title: 'Equipment Inspection',
            duration: '25 min',
            completed: false,
            contentHtml: `
              <p>Daily inspection procedures to ensure equipment safety and reliability.</p>
            `
          },
          {
            id: 'practice-identifying',
            type: 'practice',
            title: 'Practice: Identifying Components',
            duration: '20 min',
            completed: false,
            description: 'Hands-on task: identify components from images and drag-drop into correct labels.'
          },
          {
            id: 'test-tools-equipment',
            type: 'quiz',
            title: 'Test: Tools & Equipment',
            duration: '15 min',
            completed: false,
            questionCount: 12,
            passingScore: 75,
            description: 'A quick test on tools, equipment, and inspection best practices.'
          }
        ]
      },
      {
        id: 'basic-operations',
        title: 'Basic Operations',
        partitions: [
          {
            id: 'operating-levers',
            type: 'video',
            title: 'Operating Crane Levers',
            duration: '18 min',
            completed: false,
            videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
          },
          {
            id: 'operators-manual',
            type: 'reading',
            title: "Operator's Manual",
            duration: '30 min',
            completed: false,
            contentHtml: `
              <p>Open, read and understand the operator's manual before running the machine.</p>
            `
          },
          {
            id: 'practice-levers',
            type: 'practice',
            title: 'Practice: Operating Levers',
            duration: '15 min',
            completed: false,
            description: 'Simulated lever control task focusing on direction and speed.'
          },
          {
            id: 'test-basic-operations',
            type: 'quiz',
            title: 'Test: Basic Operations',
            duration: '12 min',
            completed: false,
            questionCount: 10,
            passingScore: 80,
            description: 'Quiz about basic crane operations and safety steps.'
          }
        ]
      }
    ]
  }
};

export function getPartitionData(courseId, partitionId) {
  const course = courseLessons[String(courseId)];
  if (!course) return null;
  for (const sec of course.sections) {
    const found = sec.partitions.find(p => p.id === partitionId);
    if (found) return found;
  }
  return null;
}

export function getFirstPartitionPath(courseId) {
  const course = courseLessons[String(courseId)];
  if (!course) return null;
  const firstSection = course.sections[0];
  if (!firstSection || !firstSection.partitions.length) return null;
  return `/learn/${courseId}/${firstSection.id}/${firstSection.partitions[0].id}`;
}
